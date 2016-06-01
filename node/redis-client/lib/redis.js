'use strict';

const EventEmitter = require('events').EventEmitter;
const net = require('net');

class RedisProto {
	constructor(){
		this._tailStr = '';
		this._lines = [];
	}

	push(str){
		let lines = (this._tailStr + str).split('\r\n');
		this._tailStr = lines.pop();
		this._lines = this._lines.concat(lines);
	}

	next(){
		const lines = this._lines;
		const first = lines[0];

		const popResult = (num, result) => {
			this._lines = this._lines.slice(num);
			return this.result = result;
		};

		const popEmpty = () => {
			return this.result = false;
		};

		if(lines.length < 1) return popEmpty();

		switch(first[0]){
			case '+':
				return popResult(1, {data: first.slice(1)});
			case '-':
				return popResult(1, {error: first.slice(1)});
			case ':':
				return popResult(1, {data: Number(first.slice(1))});
			case '$': {
				const n = Number(first.slice(1));
				if(n === -1){
					return popResult(1, {data: null});
				} else {
					const second = lines[1];
					if(second === 'undefined'){
						return popEmpty();
					} else {
						return popResult(2, {data: second});
					}
				}
			}
			case '*': {
				const n = Number(first.slice(1));

				if(n === 0){
					return popResult(1, {data: []});
				} else if(n === -1) {
					return popResult(1, {data: null});
				} else {
					let i = 1;
					let arr = [];
					for(; i < lines.length && arr.length < n; ++i){
						let k = lines[i];
						let v = lines[i + 1];
						if(Number(k.slice(1)) === -1){
							arr.push(null);
						} else {
							if(v === 'undefined'){
								return popEmpty();
							} else {
								arr.push(v);
								++i;
							}
						}
					}

					if(arr.length !== n){
						return popEmpty();
					} else {
						return popResult(i, {data: arr});
					}
				}
			}
			default: return popEmpty();
		}
	}
}

class Redis extends EventEmitter {
	constructor(opts){
		super();

		opts = opts || {};
		opts.port = opts.port || 6379;
		opts.host = opts.host || '127.0.0.1';

		this._fns = []; //回调数组
		this._isConnected = false;
		this._isClosed = false;

		this._proto = new RedisProto();
		this._connect = net.connect(opts.port, opts.host, () => {
			this.emit('connect')
			this._isConnected = true;
		});

		this._connect.on('error', err => this.emit('error', err));
		this._connect.on('close', () => {
			this.emit('close');
			this._isClosed = true;
		});
		this._connect.on('data', data => this._handle(data));
		this._connect.on('end', () => this.emit('end'));
	}

	exec(cmd, fn){
		if(this._isClosed) throw new Error('connection has been closed');

		fn ? this._fns.push(fn) : this._fns.push(null);

		this._connect.write(`${cmd}\r\n`);

		return this;
	}

	_handle(data){
		this._proto.push(data);
		while(this._proto.next()){
			const fn = this._fns.shift();
			const result = this._proto.result;

			if(result.error){
				fn && fn(new Error(result.error));
			} else {
				fn && fn(null, result.data);
			}
		}
	}

	close() {
		this._connect.destroy();
	}
}

module.exports = exports = Redis;