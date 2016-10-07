'use strict';
const authorize = require('./authorize');
const api = require('./api');
// const client = require('./client');

exports = module.exports = app => {
	app.use('/Oauth2', authorize);
	app.use('/api', api);
	// app.use('/example', client);
};