'use strict';

const net = require('net');
const PORT = process.env.PORT || 3000;

const server = net.createServer(c => {
	let chunks = [],
		resTxt = '';

	c.on('data', data => {
		chunks.push(data);
		resTxt = Buffer.concat('chunks').toString('utf8');
		if(resTxt.split('\r\n\r\n') !== -1) {
			const headers = _parseReqTxt(resTxt).headers;
			if(headers['']) {}

		}
	}).on('end', _ => {
		let resultTxt = Buffer.concat(chunks).toString('utf8');
		if(resultTxt.split('\r\n\r\n') !== -1) {

		}
	}).on('upgrade', _ => {

	});
});

function parseUrl(url) {
    if(!url) return null;
    if (!(/^http:\/\/.+/i.test(url))) 
        throw new Error('url format error, should be start with "http://" !');

    let urlObj = {};

    url = url.replace(/^http:\/\//i, '');

    let parseArr = url.match(/([\w\.]+):?(\d{2,})?(\/[\w\/\.\u4e00-\u9fa5]*)?/);
    urlObj.hostname = parseArr[1];
    urlObj.port = parseArr[2] || '80'
    urlObj.pathname = parseArr[3] || '/';

    return urlObj;
}

function _parseHeaders() {

}

function _parseReqTxt(txt) {
	if(!txt) return null;
	if(typeof txt !== 'string') 
		return new Error('txt type error, should be string');

	let ret = {
		requestLine: '',
		headers: {},
		body: ''
	};

	let txtArr = txt.split('\r\n\r\n'),
		requestLine = txtArr[0].shift(),
		headersArr = txtArr[0].split('\r\n'),
		body = txtArr[1];

	ret.requestLine = requestLine;

	const headerArr = [];
	for(let i = 0, len = headersArr.length; i < len; ++i) {
		headerArr = headersArr.split(/:\s?/);
		ret.headers[headerArr[0].toLowerCase()] = headerArr[1];
	}

	ret.body = body;

	return ret;
}

server.listen(PORT, _ => console.log('server bound.'));