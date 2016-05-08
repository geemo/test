'use strict';

const http = require('http');
const util = require('util');
const path = require('path');
const fs = require('fs');
const IncomingForm = require('formidable').IncomingForm;
const PORT = process.env.PORT || 3000;

let server = http.createServer();

server.on('request', (req, res) => {
    if (req.url === '/upload' && req.method.toLowerCase() === 'post') {

        let form = new IncomingForm();
        form.uploadDir = path.join(__dirname, 'tmpdir');

        form.on('progress', (bRecv, bExpct) => {
            // console.log(`bytesReceived: ${bRecv}`);
            // console.log(`bytesExpeced: ${bExpct}`);
            res.write(JSON.stringify({bRecv: bRecv, bExpct: bExpct}));
        });

        form.parse(req, (err, fields, files) => {
            console.log(fields);
            console.log(files);
            fs.rename(files['upload']['path'],
                path.join(form.uploadDir, files['upload']['name']),
                err => {
                    if (err) res.end(err.stack);
                    else res.end(util.inspect({ fields: fields, files: files }));
                });
        });

        return;

    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream('static/index.html').pipe(res);

});

server.listen(PORT, _ => console.log(`server start on port ${PORT}`));
