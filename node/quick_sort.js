'use strict';

function quick_sort(arr, l = 0, r = arr.length - 1) {
    if (l >= r) return;
    let i = l,
        j = r,
        x = arr[l];

    while (i < j) {
        while (i < j && arr[j] > x) --j;
        if (i < j) arr[i++] = arr[j];

        while (i < j && arr[i] <= x) ++i;
        if (i < j) arr[j--] = arr[i];
    }

    arr[i] = x;

    quick_sort(arr, l, i - 1);
    quick_sort(arr, i + 1, r);
}

let arr = [1, 2, 4, 3, 5, 8, 7, 4, 3];
quick_sort(arr);

console.log(arr);



// function quick_sort(...arr){
// 	if (arr.length <= 1) return arr;

// 	let left = [],
// 		right = [],
// 		x = arr.shift();

// 	for (let i = arr.length - 1; i >= 0; --i) {
// 		if(arr[i] <= x) left.push(arr[i]);
// 		else right.push(arr[i]);
// 	}

// 	return quick_sort(...left).concat(x, quick_sort(...right));
// }

// console.log(quick_sort(1, 2, 4, 3, 5, 8, 7, 4, 3));



// function quick_sort(...arr){
// 	if(arr.length <= 1) return arr;
// 	let __ = arr.shift();
// 	return quick_sort(...arr.filter(_ => _ <= __)).concat([__], quick_sort(...arr.filter(_ => _ > __)));
// }

// console.log(quick_sort(1, 2, 4, 3, 5, 8, 7, 4, 3));
