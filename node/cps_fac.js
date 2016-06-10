//CPS版本阶乘函数
/*
 * CPS可以理解为把程序内部的部分逻辑控制，抽取出来暴露给外部，类似于回调。
 */

'use strict';

function fac(n, cb){
    if(n === 0) cb(1);
    else fac(n - 1, res => cb(n * res));
}

fac(3, console.log.bind(console));