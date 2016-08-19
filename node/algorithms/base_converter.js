'use strict';

// 十进制转二，八，十六进制方法

function baseConv(num, base) {
	let stack = [];
	let rem = 0;
	const base_str = '0123456789ABCDEF';

	while (num > 0) {
		rem = num % base;
		stack.push(base_str[rem]);
		num = Math.floor(num / base);
	}

	return stack.reverse().join('');
}

console.log(baseConv(2000, 2));
console.log(baseConv(2000, 8));
console.log(baseConv(2000, 16));