'use strict';

const router = require('express').Router();
const client = require('./client.js');

exports = module.exports = router;

router.get('/');
router.get('/auth');
router.get('/auth/callback');