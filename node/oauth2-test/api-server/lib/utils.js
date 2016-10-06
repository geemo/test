'use strict';

const parseUrl = require('url').parse;
const formatUrl = require('url').format;

exports.addQueryParamsToUrl = addQueryParamsToUrl;
exports.randomString = randomString;
exports.createApiError = createApiError;
exports.missingParameterError = missingParameterError;
exports.redirectUriNotMatchError = redirectUriNotMatchError;
exports.invalidParameterError = invalidParameterError;

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