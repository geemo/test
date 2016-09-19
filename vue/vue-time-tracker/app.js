const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongodb = require('mongodb');

const MONGO_URL = 'mongodb://localhost:27017/time_tracker';

mongodb.MongoClient.connect(MONGO_URL, (err, db) => {
    if(err) return console.error(err);

    _init(db);
});

function _init(db) {
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(express.static('dist'));

    app.post('/create', (req, res, next) => {
        const mission = req.body;
        const coll = db.collection('mission');

        if(!mission.date || !mission.totalTime || !mission.comment) 
            return next(new Error('params missed'));

        coll.insert({
            date: mission.date,
            totalTime: mission.totalTime,
            comment: mission.comment
        }, (err, ret) => {
            if(err) return next(err);
            res.json({
                errcode: 0,
                errmsg: 'ok'
            });
        });
    });

    app.get('/time', (req, res, next) => {
        const coll = db.collection('mission');
        let time = 0;
        coll.find({}).toArray((err, docs) => {
            if(err) return next(err);

            time = docs
                    .map(doc => parseFloat(doc.totalTime))
                    .reduce((prev, next) => prev + next, time);

            res.json({
                errcode: 0,
                errmsg: '0k',
                time: time
            });
        });
    });

    app.get('/time-entries', (req, res, next) => {
        const coll = db.collection('mission');
        coll.find({}).toArray((err, docs) => {
            res.json({
                errcode: 0,
                errmsg: 'ok',
                entries: docs
            });
        });
    });

    app.delete('/delete/:id', (req, res, next) => {
        const id = req.params.id;
        const coll = db.collection('mission');
        const ObjectID = mongodb.ObjectID;

        coll.remove({_id: new ObjectID(id)}, (err, result) => {
            if(err) return next(err);
            res.json({
                errcode: 0,
                errmsg: 'ok'
            });
        });
    });

    app.use((err, req, res, next) => {
        res.status(500).json({
            errcode: -1,
            errmsg: err.stack
        });
    });

    app.listen(8888, () => console.log('server is running...'));
}