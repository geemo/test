'use strict';

const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const PORT = process.env.PORT || 80;

const server = http.createServer((req, res) => {
    const url = req.url;
    if(/^\/(?=\?.*)?$/.test(url)) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream(path.join(__dirname, './static/index.html')).pipe(res);
    } else if (/^\/favicon.ico/.test(url)) {
        res.writeHead(404, 'Not Found', {'Content-Type': 'text/plain'});
        res.end();
    }

    console.log('url: ', req.url);
});

server.on('upgrade', (req, socket, head) => {
    const NONCE='258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
    let key = req.headers['sec-websocket-key'];
    key = crypto.createHash('sha1').update(key + NONCE).digest('base64');

    const resMsg = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        'Sec-WebSocket-Accept: ' + key,
        '\r\n'
    ].join('\r\n');

    socket.write(resMsg);

    eventMount(socket);
    handle(socket);
});

server.listen(PORT, () => console.log(`server start on port ${PORT}`));

function eventMount(socket) {
    socket.on('message', msg => {
        console.log(msg);
        socket.write(encodeWsFrame({payloadData: 'hello 小埋!'}));
    });

    socket.on('close', () => {
    });
}

function handle(socket) {
    let frame, frameArr = [];
    socket.on('data', rawFrame => {
        frame = decodeWsFrame(rawFrame);
        if(frame.isFinal && frame.opcode === 1) {
            socket.emit('message', {type: 'text', data: frame.payloadData.toString('utf8')});
        }
    });
}

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
        payloadLen = (data[start++] << 8) + data[start++];
    } else if(frame.payloadLen === 127) {
        start += 4;
        payloadLen = (data[start++] << 24)
                    + (data[start++] << 16)
                    + (data[start++] << 8)
                    + (data[start++]);
    }

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

    return frame;
}

function encodeWsFrame(data) {
    const isFinal = data.isFinal || true,
          opcode = data.opcode || 1,
          payloadData = new Buffer(data.payloadData),
          payloadLen = payloadData.length;

    let frame = [];

    if(isFinal) frame.push((1 << 7) + opcode);

    if(payloadLen < 126) frame.push(payloadLen);
    else if(payloadLen < 65536) frame.push(126, payloadLen >> 8, payloadLen & 0xFF);
    else frame.push(127, 0, 0, 0, 0, 
                    (payloadLen & 0xFF000000) >> 24, 
                    (payloadLen & 0xFF0000) >> 16, 
                    (payloadLen & 0xFF00) >> 8, 
                    payloadLen & 0xFF);

    frame = Buffer.concat([new Buffer(frame), payloadData]);

    return frame;
}