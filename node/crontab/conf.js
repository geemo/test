exports = module.exports = {
    redis_opts: {
        port: 6379,
        host: '127.0.0.1',
        family: 4,
        password: 'your redis password',
        db: 5
    },

    sub_key: '__keyevent@5__:expired',

    smtp_url: 'smtp://user:pass@smtp.163.com'
};
