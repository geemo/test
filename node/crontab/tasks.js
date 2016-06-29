const mailer = require('nodemailer');
const util = require('util');
const conf = require('./conf.js');
const transporter = mailer.createTransport(conf.smtp_url);

exports = module.exports = {

	log: (...args) => {
		console.log(...args);
	},

	sendMail: (to_email) => {
		let code = 'SC53DM';
		let mail_opts = {
			from: '13627099611@163.com',
			to: to_email,
			subject: '速递易',
			html: `<p>您有新快件啦!点击<a href="sudiyi.cn">sudiyi.cn</a>下载APP查看详情，扫码取件更便捷!您也可凭[${code}]取快件!</p>`
		}

		transporter.sendMail(mail_opts, (err, result) => {
			if (err) {
				console.log(err);
				process.exit(1);
			} else {
				console.log(`crontab result: ${util.inspect(result)}`);
			}
		});
	}
};