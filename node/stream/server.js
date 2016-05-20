'use strict';

const net = require('net');

let chunks = [];
let server = net.createServer(conn => {

	conn.setEncoding('utf8');
	conn.on('data', data => {
		console.log(data);
	});
	conn.pipe(conn);
});
server.listen(3000, () => console.log('server start on port 3000'));