#!/usr/bin/env node
'use strict';

function fib(n, prev = 1, next = 1){
  if (n < 2) return prev;
  return fib(n - 1, next, prev + next);
}

console.log(fib(process.argv[2]));
