'use strict';

const fs = require('fs');

function co(generate){
	let it = generate();

	function exec(res){
		if(res.done) return;

		res.value.then(val => {
			exec(it.next(val));
		}, err => {
			exec(it.next(err));
		});
	}

	exec(it.next());
}

function readFile(path){
	return new Promise((resolve, reject) => {
		fs.readFile(path, 'utf8', (err, data) => {
			if(err) reject(err);
			else resolve(data);
		});
	});
}

co(function *(){
	let data1 = yield readFile('txt1');
	console.log(data1);
	let data2 = yield readFile('txt2');
	console.log(data2);
});