'use strict';

// const net = require('net');

// let client = net.connect({
// 	port: 3000,
// 	host: '127.0.0.1'
// }, () => console.log('connected redis!'));

// client.setEncoding('utf8');
// client.on('data', data => {
// 	console.log(data);
// });

// process.stdin.pipe(client);
// client.write('auth Wmeiyoumima\r\n');
// process.stdin.pipe(client);

// const readline = require('readline');
// const rl = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout,
// 	completer: line => {
// 		let completions = 'help hello error exit quit q'.split(' ');
// 		let hits = completions.filter(c => c.indexOf(line) === 0);
// 		return [hits.length ? hits : completions, line];
// 	}	
// });

// rl.setPrompt('geemo> ');
// rl.prompt();

// rl.on('line', line => {
// 	switch(line.trim()){
// 		case 'hello':
// 			console.log('world');
// 			break;
// 		default:
// 		    console.log(`default: ${line.trim()}`);	
// 	}
// 	rl.prompt();
// }).on('close', () => {
// 	console.log('have a great day!');
// 	process.exit(0);
// });


// const net = require('net');
// const rl = require('readline');

// let client = net.connect(6379, '127.0.0.1', () => {
// 	console.log('connected');
// });

// client.setEncoding('utf8');
// client.on('data', data => {
// 	console.log(data);
// });

// process.stdin.pipe(client);


// const net = require('net');
// const rl = require('readline');

// let client = net.connect(6379, '127.0.0.1', () => {
// 	console.log('connected');
// });

// client.setEncoding('utf8');
// client.on('data', data => {
// 	console.log(data);
// });

// process.stdin.pipe(client);

// function* g1(){
// 	yield 1;
// 	yield 2;
// 	yield 3;
// }

// function* g2(){
// 	yield 0;
// 	yield* g1();
// 	yield 4;
// }

// let iter = new function*(){
// 		yield 0;
// 	yield* g1();
// 	yield 4;
// };

// let obj;
// while(obj = iter.next(), obj.done){
// 	console.log(obj.value);
// }

const util = require('util');

// class A{}
// class B extends A {}

// console.log(B.__proto__ === A);
// console.log(B.prototype.__proto__ === A.prototype);

// console.log(Object.getPrototypeOf(B) === B.__proto__);

class NewObj extends Object{
	constructor(){
		super(...arguments);
	}
}
let o = new NewObj({attr: true});
console.log(o.attr === true);
console.dir(o);