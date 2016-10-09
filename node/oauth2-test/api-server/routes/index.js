'use strict';
const authorize = require('./authorize');
const api = require('./api');
// const client = require('./client');

exports = module.exports = app => {
	app.use('/Oauth2', authorize);
	app.use('/api', api);
	// 模拟客户端获取授权码
	app.use('/client', client);
};