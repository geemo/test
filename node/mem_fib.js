'use strict';

let fib = (() => {
	let mem_arr = [0, 1];

	return function fib_ret(n) {
		if(n < mem_arr.length) return mem_arr[n];
		mem_arr.push(fib_ret(n - 1) + fib_ret(n - 2));
		return mem_arr[n];
	};

})();
console.time('time');
console.log(fib(400));
console.timeEnd('time');