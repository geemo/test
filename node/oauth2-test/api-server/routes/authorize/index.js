'use strict';

const router = require('express').Router();
const bodyParser = require('body-parser');
const authorize = require('./authorize.js');

exports = module.exports = router;

router.route('/authorize')
	.get(authorize.ensureLogin, authorize.checkAuthorizeParams, authorize.showAppInfo)
	.post(authorize.ensureLogin, authorize.checkAuthorizeParams, authorize.authorizationConfirm);

router.route('/access_token')
	.post(bodyParser.urlencoded({extended: false}), authorize.verifyAuthorizationCode, authorize.getAccessToken);