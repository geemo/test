'use strict';

const arr = [1, 2, [3, 4, [5, 6], 7], 8, [9, 10]];

for(let i of flat(arr)) {
	console.log(i);
}

function* flat(arr) {
	if(Array.isArray(arr)) {
		for(let i = 0; i < arr.length; ++i) {
			if(Array.isArray(arr[i])) {
				yield* flat(arr[i]);
			} else {
				yield arr[i];
			}
		}
	} else {
		yield arr;
	}
}
