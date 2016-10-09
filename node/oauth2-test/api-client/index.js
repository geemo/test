'use strict';

const utils = require('./utils.js');

const API_URL = 'http://localhost:3000';
const API_OAUTH2_AUTHORIZE = API_URL + '/OAuth2/authorize';
const API_OAUTH2_ACCESS_TOKEN = API_URL + '/OAuth2/access_token';
const API_ARTICLES = API_URL + '/api/v1/articles.json';

class APIClient {
	constructor(opts) {
		this._appKey = opts.appKey;
		this._appSecret = opts.appSecret;
		this._callbackUrl = opts.callbackUrl;
	}

	_request() {
		
	}
}

