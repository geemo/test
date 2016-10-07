'use strict';

const parseUrl = require('url').parse;
const formatUrl = require('url').format;

exports.addQueryParamsToUrl = addQueryParamsToUrl;
exports.randomString = randomString;
exports.defaultNumber = defaultNumber;
exports.createApiError = createApiError;
exports.missingParameterError = missingParameterError;
exports.redirectUriNotMatchError = redirectUriNotMatchError;
exports.invalidParameterError = invalidParameterError;
exports.authorizationCodeExpiredError = authorizationCodeExpiredError;
exports.accessTokenExpiredError = accessTokenExpiredError;

function addQueryParamsToUrl(url, params) {
	let urlObj = parseUrl(url, true);
	for(let key in params)
		urlObj[key] = params[key];

	delete urlObj.search;
	return formatUrl(urlObj);
}

function randomString(size, chars) {
	size = size || 6;
	chars = chars || 'ABCSEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

	let randomStr = '';
	while(size--) 
		randomStr += chars[Math.floor(Math.random() * size)];

	return randomStr;
}

function defaultNumber(n, d) {
	n = Number(n);
	d = Number(d);
	return n > 0 ? n : d;
}

function createApiError(code, msg) {
	const err = new Error(msg);
	err.err_code = code;
	err.err_msg = msg;
	return err;
}

function missingParameterError(name) {
	return createApiError('MISSING_PARAMETER', `missing parameter: ${name}`);
}

function redirectUriNotMatchError(uri) {
	return createApiError('REDIRECT_URI_NOT_MATCH', `redirect uri not match: ${uri}`);
}

function invalidParameterError(name) {
	return createApiError('INVALID_PARAMETER', `invalid parameter: ${name}`);
}

function authorizationCodeExpiredError() {
	return createApiError('AUTHORIZATION_CODE_EXPIRED', 'authorization code expired');
}

function accessTokenExpiredError() {
	return createApiError('ACCESS_TOKEN_EXPIRED', 'access token expired');
}