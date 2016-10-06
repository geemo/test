'use strict';

const utils = require('../../lib/utils.js');
const database = require('../../lib/database.js');

exports.checkAuthorizeParams = checkAuthorizeParams;
exports.showAppInfo = showAppInfo;

function checkAuthorizeParams(req, res, next) {
	if(!req.query.client_id)
		return next(utils.missingParameterError('client_id'));

	if(!req.query.redirect_uri)
		return next(utils.missingParameterError('redirect_uri'));

	database.getAppInfo(req.query.client_id, (err, info) => {
		if(err) return next(err);

		if(!info) 
			return next(utils.invalidParameterError('client_id'));

		if(info.redirect_uri !== req.query.redirect_uri)
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