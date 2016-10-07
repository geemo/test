'use strict';

const utils = require('../../lib/utils.js');
const database = require('../../lib/database.js');

exports.verifyAccessToken = verifyAccessToken;
exports.getArticles = getArticles;

function verifyAccessToken(req, res, next) {
	const accessToken = (req.body && req.body.access_token) || req.query.access_token;
	if(!accessToken) return next(utils.missingParameterError('access_token'));

	const clientId = (req.body && req.body.client_id) || req.query.client_id;
	if(!clientId) return next(utils.missingParameterError('client_id'));

	const timestamp = Number(accessToken.split('.').pop());
	if(timestamp < parseInt(Date.now() / 1000)) return next(utils.accessTokenExpiredError());

	database.getAccessTokenInfo(accessToken, (err, info) => {
		if(err) return next(err);

		if(info.clientId !== clientId) return next(utils.invalidParameterError('client_id'));

		req.accessTokenInfo = info;
		
		next();
	});
}

function getArticles(req, res, next) {
	database.queryArticles(req.query, (err, articles) => {
		if(err) return next(err);
		res.apiSuccess({
			articles: articles
		});
	});
}