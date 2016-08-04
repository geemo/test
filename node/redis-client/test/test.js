//test
const Redis = require('../lib/redis.js');
const redis = new Redis();

redis.on('connect', () => {
    console.log('connected!');
});

redis.query('auth Wmeiyoumima')
    .query('lrange list1 0 -1', (err, data) => {
        if (err) console.log(err);
        else console.log(data);
    })
    .query('set aa 5', (err, data) => {
        if (err) console.log(err);
        else console.log(data);
    })
    .query('get aa', (err, data) => {
        if(err) console.log(err);
        else console.log(data);
        redis.close();
    });