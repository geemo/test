'use strict';

const conf = require('../conf.json');
const utils = require('./utils.js');
const Redis = require('ioredis');

const redis = new Redis(conf.REDIS_URL);

exports.getAppInfo = getAppInfo;
exports.generateAuthorizationCode = generateAuthorizationCode;
exports.verifyAuthorizationCode = verifyAuthorizationCode;

function getAppInfo(clientId, callback) {
	redis.get(`info:${clientId}`, (err, info) => {
		if(err) return callback(err);

		try {
			info = JSON.parse(info);
		} catch(e) {
			return callback(e);
		}

		callback(null, info);
	});
}

function generateAuthorizationCode(userId, clientId, callback) {
	const code = utils.randomString(20);

	redis.set(`code:${code}`, JSON.stringify({
		userId: userId,
		clientId: clientId
	}), err => {
		if(err) return callback(err);
		callback(null, code);
	});
}

function verifyAuthorizationCode(code, clientId, clientSecret, redirectUri, callback) {
	redis.get(`code:${code}`, (err, result) => {
		if(err) return callback(err);

		if(!result) return callback(utils.invalidParameterError('code'));

		if(typeof result !== 'object') {
			try {
				result = JSON.parse(result);
			} catch(e) {
				return callback(e);
			}
		}

		if(result.clientId !== clientId) return callback(utils.invalidParameterError('code'));

		getAppInfo(clientId, (err, info) => {
			if(err) return callback(err);
			if(info.secret !== clientSecret) return callback(utils.invalidParameterError('client_secret'));
			if(info.redirectUri !== redirectUri) return callback(utils.invalidParameterError('redirect_uri'));

			callback(null, info.userId);
		});
	});
}