'use strict';

const router = require('express').Router();
const utils = require('../../lib/utils.js');
const authorize = require('./authorize.js');

exports = module.exports = router;

router.route('/authorize')
	.get(utils.ensureLogin, authorize.checkAuthorizeParams, authorize.showAppInfo)
	.post(utils.ensureLogin, authorize.checkAuthorizeParams, authorize.authorizationConfirm);