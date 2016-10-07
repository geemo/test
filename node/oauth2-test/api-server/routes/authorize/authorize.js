'use strict';

const utils = require('../../lib/utils.js');
const database = require('../../lib/database.js');

exports.ensureLogin = ensureLogin;
exports.checkAuthorizeParams = checkAuthorizeParams;
exports.showAppInfo = showAppInfo;
exports.authorizationConfirm = authorizationConfirm;
exports.verifyAuthorizationCode = verifyAuthorizationCode;
exports.getAccessToken = getAccessToken;

function ensureLogin(req, res, next) {
	// 检查用户是否已经登录
	// 为了简化直接默认已经登录
	req.loginUserId = 'geemo';
	next();
}

function checkAuthorizeParams(req, res, next) {
	if(!req.query.client_id)
		return next(utils.missingParameterError('client_id'));

	if(!req.query.redirect_uri)
		return next(utils.missingParameterError('redirect_uri'));

	database.getAppInfo(req.query.client_id, (err, info) => {
		if(err) return next(err);

		if(!info) 
			return next(utils.invalidParameterError('client_id'));

		if(info.redirectUri !== req.query.redirect_uri)
			return next(utils.redirectUriNotMatchError(req.query.redirect_uri));

		req.appInfo = info;
		next();
	});
}

function showAppInfo(req, res, next) {
	res.render('authorize', {
		loginUserId: req.loginUserId,
		appInfo: req.appInfo
	});
}

function authorizationConfirm(req, res, next) {
	database.generateAuthorizationCode(req.loginUserId, req.query.client_id, req.query.redirect_uri, (err, code) => {
		if(err) return next(err);

		res.redirect(utils.addQueryParamsToUrl(req.query.redirect_uri, {
			code: code
		}));
	});
}

function verifyAuthorizationCode(req, res, next) {
	const clientId = req.body.client_id || req.query.client_id;
	if(!clientId) return next(utils.missingParameterError('client_id'));

	const clientSecret = req.body.client_secret || req.query.client_secret;
	if(!clientSecret) return next(utils.missingParameterError('client_secret'));

	const redirectUri = req.body.redirect_uri || req.query.redirect_uri;
	if(!redirectUri) return next(utils.missingParameterError('redirect_uri'));

	const code = req.body.code || req.query.code;
	if(!code) return next(utils.missingParameterError('code'));

	const timestamp = Number(code.split('.').pop());
	if(timestamp < parseInt(Date.now() / 1000)) return next(utils.authorizationCodeExpiredError());

	database.getAuthorizationCodeInfo(code, (err, codeInfo) => {
		if(err) return next(err);
		if(codeInfo.clientId !== clientId) return next(utils.invalidParameterError('code'));

		database.getAppInfo(clientId, (err, appInfo) => {
			if(err) return next(err);
			if (appInfo.secret !== clientSecret) return next(utils.invalidParameterError('client_secret'));
			if (appInfo.redirectUri !== redirectUri) return next(utils.invalidParameterError('redirect_uri'));
			
			req.userId = userId;
			next();
		});
	});
}

function getAccessToken(req, res, next) {
	const clientId = req.body.client_id || req.query.client_id;
	const code = req.body.code || req.query.code;

	database.generateAccessToken(req.userId, clientId, (err, token) => {
		if(err) return next(err);

		database.deleteAuthorizationCode(code, err => console.log(err));

		res.apiSuccess({
		    access_token: token,
		    expires_in: 3600 * 2
		});
	});
}