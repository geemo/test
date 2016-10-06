'use strict';

const express = require('express');
const conf = require('./conf.json');
const middleware = require('./lib/middleware.js');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(middleware.extendApiOutput);
require('./routes')(app);
app.use((req, res, next) => {
	res.status(404).send('sorry cant find that!');
});
app.use(middleware.apiErrorHandle);
app.use((err, req, res, next) => {
	if(req.headersSend) return next(err);
	res.status(500).send(err.stack);
});

app.listen(conf.PORT, () => console.log(`server start on port: ${conf.PORT}`));