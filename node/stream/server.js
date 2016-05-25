'use strict';

const net = require('net');

let client = net.connect(6379, () => console.log('connected'));

client.setEncoding('utf8');
client.on('data', data => {
	console.log(data);
});

process.stdin.pipe(client);