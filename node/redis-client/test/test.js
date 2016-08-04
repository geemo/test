//test
const Redis = require('../lib/redis.js');
const redis = new Redis();

redis.on('connect', () => {
    console.log('connected!');

// redis.query('auth Wmeiyoumima')
//     .query('lrange list1 0 -1', (err, data) => {
//         if (err) console.log(err);
//         else console.log(data);
//     })
//     .query('set aa 5', (err, data) => {
//         if (err) console.log(err);
//         else console.log(data);
//     })
//     .query('get aa', (err, data) => {
//         if(err) console.log(err);
//         else console.log(data);
//         redis.close();
//     });


    redis.auth('Wmeiyoumima')
        .get('aa', (err, data) => {
            if (err) return console.error(err);

            console.log(data);
            redis.close();
            redis.set(['geemo', 'dog'], (err, result) => {
                if(err) return console.error(err);

                console.log(data);
            });
        });
}).on('close', () => {
    console.log('close');
}).on('error', (err) => {
    console.error(err)
});