'use strict';

const router = require('express').Router();
const api = require('./api.js');

exports = module.exports = router;

router.route('/v1/articles.*')
	.get(api.verifyAccessToken, api.getArticles);

router.route('/v1/articles')
	.get(api.verifyAccessToken, api.getArticles);