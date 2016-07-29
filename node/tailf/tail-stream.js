'use strict';
const Readable = require('stream').Readable;
const fs = require('fs');

class TailStream extends Readable {
    constructor(opts) {
        super();

        opts = opts || {};

        this._file = opts.file;

        this._pos = opts.pos || 0;

        this._ready = false;

        this._timer = null;

        this._openFile();
    }

    _openFile() {
        fs.open(this._file, 'r', (err, fd) => {
            if (err) return this.emit('error', err);

            this._fd = fd;

			this._ready = true;

            const next = () => {
            	this._watchFile();
            };

            if ('end' === this._pos) {
                this._toEnd(next);
            } else {
                next();
            }

        });
    }

    _watchFile() {

        fs.watch(this._file, (event, filename) => {
            if ('change' === event) {

            	global.clearTimeout(this._timer);

                this._read();

                this._timer = global.setTimeout(() => {
                	this._read();
                }, 1000);
            }
        });

    }

    _getSize() {
        return this._readableState.highWaterMark - this._readableState.length;
    }

    _toEnd(next) {
        if (this._ready) {
            fs.fstat(this._fd, (err, stats) => {
                if (err) return this.emit('error', err);

                this._pos = stats.size;

                next();
            });
        }
    }

    _read(size) {
        if (this._ready) {
            this._ready = false;

            size = size === undefined ? this._getSize() : size;

            fs.read(this._fd, new Buffer(size), 0, size, this._pos, (err, bytesRead, buf) => {
                if (err) return this.emit('error', err);

                if (bytesRead > 0) {
                    this._pos += bytesRead;
                    this.push(buf.slice(0, bytesRead));
                }

                this._ready = true;
            });
        }
    }
}

const tailStream = new TailStream({
    file: 'test.log',
    pos: 'end'
});

tailStream.on('data', data => {
    console.log(data.toString());
}).on('error', err => {
    console.error(err);
});
