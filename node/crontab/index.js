const Redis = require('ioredis');
const tasks = require('./tasks.js');
const conf = require('./conf.js');
const redis = new Redis(conf.redis_opts);
const sub = new Redis(conf.redis_opts);

sub.once('connect', () => {

    sub.subscribe(conf.sub_key, (err, count) => {
        if (err) {
            handleError(err);
        } else {
            console.log(`subscription success, subscription count is: ${count}`);
            // createCrontab('log', [1, 2, 3], 5);
            createCrontab('sendMail', ['153330685@qq.com'], 5);
        }
    });

});

sub.on('message', crontabTrigger);

/* 生产唯一id
 * @return {String} uid 唯一id值 
 */

let genUID = (() => {
    let num = 0;

    function getIncNum() {
        if (num >= 10000) num = 0;
        return '0'.repeat(4 - String(num).length) + num++;
    }

    return () => {
        return Date.now() + getIncNum();
    };
})();

/* 创建定时任务
 * @param {String} fn 函数名
 * @param {Array} args 函数参数
 * @timeout {Number} timeout 过期时间
 */

function createCrontab(fn, args, timeout) {
    // 添加唯一id的原因是应对同一毫秒，同函数同参数的key，会进行覆盖
    const cron_key = `${genUID()}:${fn}:${JSON.stringify(args)}`;
    // 设置定时任务
    redis.set(cron_key, '', 'EX', timeout, (err, result) => {
        if (err) {
            handleError(err);
        } else {
            console.log(`create crontab status: ${result}`);
        }
    });
}

/* 定时任务触发器
 * @param {String} channel 订阅频道
 * @param {String} key 定时任务的键
 */

function crontabTrigger(channel, key) {

    const fileds = key.split(':');
    if (fileds.length < 3) return;

    // 去掉key的uid
    fileds.shift();
    // 获取函数名
    const fn_name = fileds.shift();
    
    // 获取函数参数
    // 如果剩余字段数大于1，说明参数中有带':'的参数，需要重新拼接回去
    // 字段数等于1时,join后返回原数组第一个元素
    let args = fileds.join(':');

    try {
    	// 解析函数参数, 多参数时, args为数组
        args = JSON.parse(args);
    } catch (e) {
    	handleError(e);
    }

    console.log('---------------%s : %s--------------',fn_name, args);

    // 获取函数
    const fn = tasks[fn_name];
   	// 执行函数
   	fn(...args);
}

/* 错误处理函数
 * @param {Error} err 错误对象
 */

function handleError(err) {
    console.log(err);
    process.exit(1);
}
