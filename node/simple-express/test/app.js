'use strict';

const simpleExpress = require('../index.js');
const PORT = process.env.PORT || 3000;
const app = simpleExpress();

app.use('/test', (req, res, next) => {
    console.log('test');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('test');
});

app.use('/404', (req, res, next) => {
    console.log('404');
    next();
});

app.use('/error', (req, res, next) => {
    console.log('error');
    next(new Error('error'));
});

app.use((req, res) => {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end();
});

app.use((err, req, res, next) => {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end(err.stack);
});

app.listen(PORT, () => console.log(`server start on port ${PORT}`));