'use strict';

const fib = require('./build/Release/fib.node');

console.log(fib(parseInt(process.argv[2])));