'use strict';

const APIClient = require('../../../api-client');

const client = new APIClient({
	appKey: '666',
	appSecret: '233',
	callbackUrl: 'http://localhost:3000/client/auth/callback'
});

