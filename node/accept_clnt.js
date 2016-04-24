'use strict';
const net = require('net');

let socket = net.connect({
  port: 4660,
  host: 'localhost'
}, () => console.log('connected!'));

let chunks = [];
socket.on('data', chunk => {
  chunks.push(chunk);
});

socket.on('end', () => {
  console.log(Buffer.concat(chunks).toString('utf8'));
});

socket.end();
