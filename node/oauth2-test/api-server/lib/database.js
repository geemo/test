'use strict';

const conf = require('../conf.json');
const utils = require('./utils.js');
const Redis = require('ioredis');
const faker = require('faker');

const redis = new Redis(conf.REDIS_URL);

exports.getAppInfo = getAppInfo;
exports.generateAuthorizationCode = generateAuthorizationCode;
exports.getAuthorizationCodeInfo = getAuthorizationCodeInfo;
exports.deleteAuthorizationCode = deleteAuthorizationCode;
exports.generateAccessToken = generateAccessToken;
exports.getAccessTokenInfo = getAccessTokenInfo;
exports.queryArticles = queryArticles;

function getAppInfo(clientId, callback) {
    redis.get(`info:${clientId}`, (err, info) => {
        if (err) return callback(err);
        if (!info) return callback(utils.invalidParameterError('client_id'));

        try {
            info = JSON.parse(info);
        } catch (e) {
            return callback(e);
        }

        callback(null, info);
    });
}

function generateAuthorizationCode(userId, clientId, callback) {
    const code = utils.randomString(20) + '.' + parseInt(Date.now() / 1000) + 3600 * 2;

    redis.set(`code:${code}`, 'EX', 3600 * 2, JSON.stringify({
        userId: userId,
        clientId: clientId
    }), err => {
        if (err) return callback(err);
        callback(null, code);
    });
}


function getAuthorizationCodeInfo(code, callback) {
    redis.get(`code:${code}`, (err, info) => {
        if (err) return callback(err);
        if (!info) return callback(utils.invalidParameterError('code'));

        if (typeof info !== 'object') {
            try {
                info = JSON.parse(info);
            } catch (e) {
                return callback(e);
            }
        }

        callback(null, info);
    });
}

function deleteAuthorizationCode(code, callback) {
    redis.del(`code:${code}`, err => {
        if (err) return callback(err);
        callback(null);
    });
}

function generateAccessToken(userId, clientId, callback) {
    const token = utils.randomString(20) + '.' + parseInt(Date.now() / 1000) + 3600 * 2;

    redis.set(`token:${token}`, 'EX', 3600 * 2, JSON.stringify({
        userId: userId,
        clientId: clientId
    }), err => {
        if (err) return callback(err);
        callback(null, token);
    });
}

function getAccessTokenInfo(token, callback) {
    redis.get(`token:${token}`, (err, info) => {
        if (err) return callback(err);
        if (!info) return callback(utils.invalidParameterError('access_token'));

        try {
            info = JSON.parse(info);
        } catch (e) {
            return callback(e);
        }

        callback(null, info);
    });
}


// 生成随机测试数据
faker.locale = 'zh_CN';
let dataArticles = [];
const ARTICLE_NUM = 100;

for(let i = 0; i < ARTICLE_NUM; ++i) {
	dataArticles.push({
		id: faker.random.uuid(),
		author: faker.name.findName(),
		title: faker.lorem.sentence(),
		createdAt: faker.date.past(),
		content: faker.lorem.paragraphs(10)
	});
}

function queryArticles(query, callback) {
	query.skip = utils.defaultNumber(query.skip, 0);
	query.limit = utils.defaultNumber(query.limit, 10);

	callback(null, dataArticles.slice(query.skip, query.skip + query.limit));
}