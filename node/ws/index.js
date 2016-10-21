'use strict';
// 原生模块实现ws服务器

const http      = require('http');
const fs        = require('fs');
const crypto    = require('crypto');
const path      = require('path');

const PORT      = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const url = req.url;
    // 响应主页
    if(/^\/(?=\?.*)?$/.test(url)) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream(path.resolve(__dirname, './static/index.html')).pipe(res);
    } else { //其余响应404
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end();
    }
});

server.on('upgrade', (req, socket, head) => {
    // ws握手
    handshake(req, socket);
    // 挂载握手成功后的各类自定义事件处理器
    mountCustomEvent(socket);
    // 挂载响应方法
    mountSendMethod(socket);
    // 原始ws帧解析处理
    rawFrameParseHandle(socket);
});

server.listen(PORT, () => console.log(`server start on port ${PORT}`));

// ws握手阶段
function handshake(req, socket) {
    // 固定随机串
    const NONCE = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
    // 获取客户端返回的key与随机串进行sha1编码后获取base64格式摘要
    let key = req.headers['sec-websocket-key'];
    key = crypto.createHash('sha1').update(key + NONCE).digest('base64');

    // 返回101协议切换响应
    const resMsg = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        'Sec-WebSocket-Accept: ' + key,
        '\r\n'
    ].join('\r\n');

    socket.write(resMsg);
}

function mountCustomEvent(socket) {

    socket.on('message', msg => {
        console.log(msg);

        // socket.write(encodeWsFrame({isFinal: false, opcode: 1, payloadData: 'bbb'}));
        // socket.write(encodeWsFrame({isFinal: false, opcode: 0, payloadData: 'ccc'}));
        // socket.write(encodeWsFrame({isFinal: true, opcode: 0, payloadData: 'ddd'}));

        // socket.send('asdf');
        // socket.send({data: 'bbb', isFinal: false});
        // socket.send({data: 'ccc'});
        // socket.send({data: new Buffer('ccc'), type: 'binary'});
        // socket.send(new Buffer('bbbbasdf'));
        socket.send({data: new Buffer('bsdf')});
    });

    socket.on('close', () => {
        socket.end();
    });
}

function mountSendMethod(socket) {
    let startFrameWrited = false;
    socket.send = function(opts) {
        if(typeof opts === 'string') {
            return this.write(encodeWsFrame({isFinal: true, opcode: 1, payloadData: String(opts)}));
        } else if(opts instanceof Buffer) {
            return this.write(encodeWsFrame({isFinal: true, opcode: 2, payloadData: opts}));
        }

        let isFinal = opts.isFinal === undefined ? true : opts.isFinal,
            type = opts.type,
            payloadData = opts.data,
            opcode;

        if(opts.data instanceof Buffer) {
            type = 'binary';
            payloadData = new Buffer(payloadData);
        }

        switch(type) {
            case 'text':
                opcode = 1;
                break;
            case 'binary':
                opcode = 2;
                break;
            case 'ping':
                opcode = 9;
                break;
            case 'pong':
                opcode = 10;
                break;
            case 'close':
                opcode = 8;
                break;
            default:
                opcode = 1;
        }

        if(opcode === 1) payloadData = String(payloadData);

        // 如果起始帧已经写入，后续帧直到终止帧都是附加帧
        if(startFrameWrited) opcode = 0;

        if(isFinal === false) {
            startFrameWrited = true;
            return this.write(encodeWsFrame({isFinal, opcode, payloadData}));
        } else if(startFrameWrited && isFinal) {
            startFrameWrited = false;
            return this.write(encodeWsFrame({isFinal, opcode, payloadData}));
        }

        return this.write(encodeWsFrame({isFinal, opcode, payloadData}));
    }
}

function rawFrameParseHandle(socket) {
    let frame, 
        frameArr = [],
        totalLen = 0;
    socket.on('data', rawFrame => {
        frame = decodeWsFrame(rawFrame);

        if(frame.isFinal) {
            if(frame.opcode === 0) {
                frameArr.push(frame);
                totalLen += frame.payloadLen;

                let frame = frameArr[0],
                    payloadDataArr = [];
                payloadDataArr = frameArr
                                    .filter(frame => frame.payloadData)
                                    .map(frame => frame.payloadData);
                frame.payloadData = Buffer.concat(payloadDataArr);
                frame.payloadLen = totalLen;
                opHandle(socket, frame);
                frameArr = [];
                totalLen = 0;
            } else {
                opHandle(socket, frame);
            }
        } else {
            frameArr.push(frame);
            totalLen += frame.payloadLen;
        }
    });
}

// 帧类型处理
function opHandle(socket, frame) {
    switch(frame.opcode) {
        case 1: 
            // 文本帧
            socket.emit('message', {type: 'text', data: frame.payloadData.toString('utf8')});
            break;
        case 2:
            // 二进制帧
            socket.emit('message', {type: 'binary', data: frame.payloadData});
            break;
        case 8:
            // 关闭帧
            socket.emit('close');
            break;
        case 9:
            // ping帧
            socket.emit('ping');
            console.dir(frame);
            socket.write(encodeWsFrame({opcode: 10}));
            break;
        case 10:
            // pong帧
            socket.emit('pong');
            console.dir(frame);
            break;
    }
}

// ws帧解码
function decodeWsFrame(data) {
    let start = 0;
    let frame = {
        isFinal: (data[start] & 0x80) === 0x80,
        opcode: data[start++] & 0xF,
        masked: (data[start] & 0x80) === 0x80,
        payloadLen: data[start++] & 0x7F,
        maskingKey: '',
        payloadData: null
    };

    if(frame.payloadLen === 126) {
        frame.payloadLen = (data[start++] << 8) + data[start++];
    } else if(frame.payloadLen === 127) {
        start += 4;
        frame.payloadLen = (data[start++] << 24)
                        + (data[start++] << 16)
                        + (data[start++] << 8)
                        + (data[start++]);
    }

    if(frame.payloadLen) {
        if(frame.masked) {
            const maskingKey = [
                data[start++],
                data[start++],
                data[start++],
                data[start++]
            ];

            frame.maskingKey = maskingKey;

            frame.payloadData = data
                                .slice(start, start + frame.payloadLen)
                                .map((byte, idx) => byte ^ maskingKey[idx % 4]);
        } else {
            frame.payloadData = data.slice(start, start + frame.payloadLen);
        }
    }

    return frame;
}

// 编码ws帧
function encodeWsFrame(data) {
    const isFinal = data.isFinal !== undefined ? data.isFinal : true,
          opcode = data.opcode !== undefined ? data.opcode : 1,
          payloadData = data.payloadData ? new Buffer(data.payloadData) : null,
          payloadLen = payloadData ? payloadData.length : 0;

    let frame = [];

    if(isFinal) frame.push((1 << 7) + opcode);
    else frame.push(opcode);

    if(payloadLen < 126) frame.push(payloadLen);
    else if(payloadLen < 65536) frame.push(126, payloadLen >> 8, payloadLen & 0xFF);
    else frame.push(127, 0, 0, 0, 0, 
                    (payloadLen & 0xFF000000) >> 24, 
                    (payloadLen & 0xFF0000) >> 16, 
                    (payloadLen & 0xFF00) >> 8, 
                    payloadLen & 0xFF);

    
    frame = payloadData ? Buffer.concat([new Buffer(frame), payloadData]) : new Buffer(frame);

    console.dir(decodeWsFrame(frame));
    return frame;
}