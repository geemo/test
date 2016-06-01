//test
const Redis = require('../lib/redis.js');
const redis = new Redis();

redis.on('connect', () => {
    console.log('connected!');
});

redis.exec('auth Wmeiyoumima')
    .exec('lrange list1 0 -1', (err, data) => {
        if (err) console.log(err);
        else console.log(data);
    })
    .exec('set aa 5', (err, data) => {
        if (err) console.log(err);
        else console.log(data);
    })
    .exec('get aa', (err, data) => {
        if(err) console.log(err);
        else console.log(data);
        redis.close();
    });