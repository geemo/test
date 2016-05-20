'use strict';
/* ---------- 可读流 ---------- */
// const Readable = require('stream').Readable;

// class ToReadable extends Readable {
// 	constructor(iter, ...opt) {
// 		super(...opt);
// 		this.iter = (function*(){
// 			yield　* iter;
// 		})();
// 	}

// 	_read(n) {
// 		console.log(n);
// 		const res = this.iter.next();
// 		if(res.done) this.push(null);
// 		else this.push(res.value + '\n');
// 	}
// }

// const iter = (function * (limit){
// 	while(limit--) yield Math.random();
// })(1e2);

// const readable = new ToReadable(iter);

// readable.on('data', data => process.stdout.write(data));
// readable.on('end', () => process.stdout.write('DONE'));

/* 创建可读流时，需要继承Readable，并实现_read方法。
 *　*　_read方法是从底层系统读取具体数据的逻辑，即生产数据的逻辑。
 * * 在_read方法中，通过调用push(data)将数据放入可读流中供下游消耗。
 * * 在_read方法中，可以同步调用push(data)，也可以异步调用。
 * * 当全部数据都生产出来后，必须调用push(null)来结束可读流。
 * *　流一旦结束，便不能再调用push(data)添加数据。
 * 可以通过监听data事件的方式消耗可读流。
 * * 在首次监听其data事件后，readable便会持续不断的调用_read()，触发data事件将数据输出。
 * * 第一次data事件会在下一个tick中触发，所以，可以安全地将数据输出前地逻辑放在事件监听后(同一个tick)。
 * * 当数据全部被消耗时，会触发end事件。
 */

/* ---------- paused模式 ---------- */
// 在paused模式下通过readable.read()去读取数据。
/* 以下条件均可使readable进入paused模式:
 * * 流创建完，即初始状态
 *　* 在flowing模式下调用paused方法
 * * 通过unpipe方法移除所有下游
 */
 // const stream = require('stream');

 // let source = ['a', 'b', 'c'];
 // const readable = stream.Readable({
 // 	read: function(){
 // 		var data;
 // 		this.push(data = (source.shift() || null));
 // 		console.log(`push: ${data}`);
 // 	}
 // });

 // readable.on('readable', function(){
 // 	let data;
 // 	while(data = this.read()){
 // 		console.log(`data: ${data}`);
 // 	}
 // 	console.log('readable');
 // });
 // readable方法表示流中产生了新数据，或是到了流的尽头。read(n)时，会从缓存中试图读取相应的字节数。当n未指定时，会一次将缓存中的字节全部读取出。
 // 如果在flowing模式下调用read()，不指定n时，会逐个元素的将缓存中的数据读完，而不像paused模式会一次全部读取。

 /* -------- flowing模式 -------- */
 // 在flowing模式下，readable的数据会持续不断的生产出来，每个数据会触发一次data事件，通过监听该事件来获取数据。
 /* 以下条件均可使readable进入flowing模式:
  * * 调用resume()方法
  * * 如果之前未调用pause方法进入paused模式，则监听data事件也会调用resume方法
  * * readable.pipe(writeable)。pipe会监听data事件
  */
  // const stream = require('stream');

  // let readable = stream.Readable();
  // let source = ['a', 'b', 'c'];
  // readable._read = function(){
  // 	let data;
  // 	this.push(data = (source.shift() || null));
  // 	console.log(`push: ${data}`);
  // };
  // readable.on('data', function(data){
  // 	console.log(`data: ${data}`);
  // });

  /* ---------- 小结 ---------- */
  /* 使用push来产生数据。
   *　必须调用push(null)来结束流，否则下游会一直等待。
   * push可以同步调用，也可以异步调用。
   * end事件表示可读流中的数据已完全被消耗。
   * 通常在flowing模式下使用可读流。
   */



 /* ---------- 可写流 ---------- */
 // const Writable = require('stream').Writable;

 // class ToWritable extends Writable {
 // 	constructor(...opts){
 // 		super(...opts);
 // 	}

 // 	_write(data, enc, next){
 // 		process.stdout.write(data.toString());
 // 		// process.nextTick(next);
 // 		next();
 // 	}
 // }

 // const writable = new ToWritable();
 // writable.on('finish', () => process.stdout.write('DONE'));
 
 // writable.write('a\n'); 
 // writable.write('b\n');
 // writable.write('c\n');

 // writable.end();

 /* 上游通过调用writable.write(data)将数据写入可读流中。write()方法会调用_write()将data写入底层。
  *　* 在_write中，当数据成功写入底层后，必须调用next()告诉流开始处理下一个数据
  * * next的调用可以是异步的
  * * 调用write(data)方法来往writable中写入数据。将触发_write的掉欧诺个，将数据写入底层。
  * * 必须调用end()方法来告诉writable，所有数据均已写入。
  */

  /* ---------- finish事件 ---------- */
  /*　与Redable的end事件类似，Writable有两个事件来表示所有写入完成的状况:
   * * 1.prefinish事件。表示所有数据均已写入底层系统，即最后一次_write的调用，
   * * 其next已被执行。此时，不会再有新的数据写入，缓存总也无积累的待写数据。
   * * 2.finish事件。在prefinish之后，表示所有在调用write(data, cb)时传入的cb均已执行完。
   * * 3.一般监听finish事件，来判断写操作完成。
   */
  //const stream = require('stream');

  // let writable = stream.Writable({
  // 	write: function(data, _, next){
  // 		console.log(data);
  // 		next();
  // 	}
  // });

  // writable.on('finish', () => {
  // 	console.log('finish');
  // });
  // writable.on('prefinish', () => {
  // 	console.log('prefinish');
  // });
  // writable.write('b', () => {
  // 	console.log('write a');
  // });
  // writable.write('b', () => {
  // 	console.log('write b');
  // });
  // writable.write('c', () => {
  // 	console.log('write c');
  // });
  // writable.end();

// objectMode　测试
// const stream = require('stream');
// const util = require('util');

// let sources = [{a: 5, b: 6}, 'c', 'd'];
// let readable = stream.Readable({
// 	read: function(){
// 		let data;
// 		this.push(data = (sources.shift() || null));
// 		console.log(`push: ${util.inspect(data)}`);
// 	},
// 	objectMode: true
// });

// readable.on('readable', function(){
// 	let data;
// 	while(data = this.read()){
// 		console.log(`data: ${util.inspect(data)}`);
// 	}
// });