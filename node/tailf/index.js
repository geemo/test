#!/usr/bin/env node

'use strict';

const fs = require('fs');

/*
 *	@param {String} name 文件名
 *  @param [Number] size 可选，每次读取的文件块大小
 *  @param {Function} fn 回调处理函数
 */

function tailf(name, size, fn){
	let BUFFER_SIZE = 4 * 1024;

	if(typeof size !== 'number') fn = size;
	else BUFFER_SIZE = size;

	//打开文件获取文件描述符
	fs.open(name, 'r', (err, fd) => {
		if(err) return fn(err);

		fs.fstat(fd, (err, stats) => {
			if(err) return fn(err);
			//文件开始位置
			let pos = stats.size;
			
			const loop = () => {
				//文件块
				let buf = new Buffer(BUFFER_SIZE);
				//开始读取
				fs.read(fd, buf, 0, BUFFER_SIZE, pos, (err, bytesRead, buffer) => {
					if(err) return fn(err);
					//更新起始位置
					pos += bytesRead;
					fn(null, buffer.slice(0, bytesRead));
					//如果已读满文件块，继续循环读取
					if(bytesRead >= BUFFER_SIZE) loop();
				});
			};

			loop();

			fs.watch(name, event => {
				if(event === 'change') loop();
			});
		});
	});
}

tailf(process.argv[2], 2, (err, data) => {
	if(err) return console.error(err);
	console.log(data.toString('utf8'));
});
