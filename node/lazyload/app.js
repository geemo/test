'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('./mime.json');
const port = process.env.PORT || 80;

console.dir(mime);

const server = http.createServer((req, res) => {
	const url = req.url;
	if(url === '/favicon.ico'){
		resErr(res, 404);
	} else {
		if(url.search(/^\/static\/.+$/) !== -1){
			const realPath = url.slice(1);
			fs.stat(realPath, (err, stats) => {
				if(err){
					resErr(res, 404, err.stack);
				}else if(!stats.isFile()){
					resErr(res, 404, `${realPath} is not a file.`);
				}else{
					res.writeHead(200, {'Content-Type': mime[path.extname(realPath)]});
					fs.createReadStream(realPath).pipe(res);
				}
			});
		}else{
			resErr(res, 404, `the requested uri ${url} was not found on this server.`);
		}
	}

	function resErr(res, code, msg){
		res.writeHead(code, {'Content-Type': 'text/plain'});
		res.end(msg);
	}
});

server.listen(port, () => {
	console.log(`server start on port: ${port}`);
});