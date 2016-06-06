'use strict';
//可读流(Readable)
// const Readable = require('stream').Readable;
// class MyReadable extends Readable {
//     constructor(iterable) {
//         super();
//         this.iter =  (function *(){
//             yield *iterable;
//         })();
//     }
    
//     _read() {
//         const res = this.iter.next();
//         if(res.done) this.push(null);
//         else this.push(`${res.value}\n`)
//     }
// }

// const iterate = function *(limit){
//     while(limit--){
//         yield Math.random();
//     }
// };

// const readable = new MyReadable(iterate(5));
// readable.on('data', data => console.log(data));
// readable.on('end', () => console.log('DONE\n'));

//可写流(Writable)
// const Writable = require('stream').Writable;

// const writable = new Writable();
// writable._write = function(data, enc, next){
//     // process.stdout.write(data.toString().toUpperCase());
//     console.log(data);
//     process.nextTick(next);
// };
// writable.on('finish', () => console.log('DONE\n'));

// writable.write('a\n');
// writable.write('b\n');
// writable.write('c\n');
// writable.end();

//可读可写流(Duplex)
// const Duplex = require('stream').Duplex;

// const duplex = new Duplex();
// duplex._read = function(){
//     this._readNum = this._readNum || 0;
//     if(this._readNum > 1) this.push(null);  
//     else this.push(`${this._readNum++}`);
// };
// duplex._write = function(buf, enc, next){
//     console.log(buf);
//     next();
// };

// duplex.on('data', data => duplex.write(data));
// duplex.on('end', () => duplex.end());

//变换流(Transform)
// const Transform = require('stream').Transform;

// class Rotate extends Transform {
//     constructor(offset) {
//         super();
//         this.offset = (offset || 13) % 26;
//     }
    
//     _transform(buf, enc, next) {
//         let res = buf.toString().split('').map(c => {
//             let code = c.charCodeAt(0);
//             if(c >= 'a' && c <= 'z'){
//                 code += this.offset;
//                 if(code > 'z'.charCodeAt(0)){
//                     code -= 26;
//                 }
//             } else if(c >= 'A' && c <= 'Z') {
//                 code += this.offset;
//                 if(code > 'Z'.charCodeAt(0)){
//                     code -= 26;
//                 }
//             }
            
//             return String.fromCharCode(code);
//         }).join('');
        
//         this.push(res);
//         next();
//     }
// }

// const rotate = new Rotate(3);
// rotate.on('data', data => console.log(data));
// rotate.write('hello');
// rotate.write(' world!');
// rotate.end();

//对象模式(objectMode)
// const Readable = require('stream').Readable;
// const readable = new Readable({objectMode: true});

// readable.on('data', data => console.log(data));

// readable.push('a');
// readable.push('b');
// readable.push({});
// readable.push(null);