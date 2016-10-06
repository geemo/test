'use strict';
const authorize = require('./authorize');
const client = require('./client');
const api = require('./api');

exports = module.exports = app => {
	app.use('/Oauth2', authorize);
	app.use('/example', client);
	app.use('/api', api);
};