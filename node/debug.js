'use strict';
const assert = require('assert');

function debug(desc, fn){
	let start = Date.now();

	if(fn.length){
		fn(done);
	} else {
		let err = null;

		try {
			fn();
		} catch(e) {
			err = e;
		} finally {
			done(err);
		}
	}

	function done(err){
		let time = Date.now() - start;
		let state = err ? 'fail' : 'success';
		console.log(`${desc} - ${state} - ${time}ms`);
	}
}

process.on('uncaughtException', err => console.log(err.stack));

debug('test1', () => assert.equal(2, 3));
debug('test2', done => {
	setTimeout(() => {
		assert.equal(3, 4);
		done();
	}, 1000);
});