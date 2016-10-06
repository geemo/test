'use strict';

exports.extendApiOutput = extendApiOutput;
exports.apiErrorHandle = apiErrorHandle;
exports.ensureLogin = ensureLogin;

function extendApiOutput(req, res, next) {
	res.apiSuccess = data => {
		res.json({
			status: 'OK',
			data: data
		});
	};

	res.apiError = err => {
		res.json({
			status: 'ERROR',
			err_code: err.err_code || 'UNKNOWN',
			err_msg: err.err_msg || err.toString()
		});
	};

	next();
}

function apiErrorHandle(err, req, res, next) {
	if(process.env.NODE_ENV !== 'production')
		console.error(err.stack);

	if(typeof res.apiError === 'function')
		return res.apiError(err);

	next(err);
}

function ensureLogin(req, res, next) {
	// 检查用户是否已经登录
	// 为了简化直接默认已经登录
	req.loginUserId = 'geemo';
	next();
}