'use strict';

const http = require('http');
const EventEmitter = require('events').EventEmitter;

exports = module.exports = createServer;

let _proto = {};

function createServer() {
    function app(req, res, next) { app.handle(req, res, next); }
    Object.assign(app, _proto);
    Object.assign(app, EventEmitter.prototype);
    app._route = '/';
    app._stack = [];
    return app;
}

_proto.use = function(route, fn) {
    if(typeof route !== 'string') {
        fn = route;
        route = '/';
    }

    // 如果是子app
    if(typeof fn.handle === 'function') {
        fn._route = route;
        fn = fn.handle.bind(fn);
    }

    if(route[route.length - 1] === '/')
        route = route.slice(0, -1);

    this._stack.push({ route: route, handle: fn });

    return this;
};

_proto.handle = function(req, res, out) {
    let index = 0,
        removed = '',
        slashAdded = false;

    let next = err => {
        if(slashAdded) {
            req.url = req.url.substr(1);
            slashAdded = false;
        }

        if(removed.length) {
            req.url = removed + req.url;
            removed = '';
        }

        let layer = this._stack[index++];

        if(!layer) {
            // 跳出子app
            out && out(err);
            return;
        }

        let route = layer.route;
        if(req.url.substr(0, route.length).toLowerCase() !== route.toLowerCase())
            return next(err);

        let border = req.url[route.length];
        // 防止req.url为/aaa匹配/aa的情况
        if(border !== undefined && border !== '/')
            return next(err);

        if(route.length !== 0 && route !== '/') {
            req.url = req.url.substr(route.length);
            removed = route;
            if(req.url[0] !== '/') {
                req.url = '/' + req.url;
                slashAdded = true;
            }
        }

        let handle = layer.handle;
        if (err && handle.length === 4) 
            return handle(err, req, res, next);
        else if (!err && handle.length < 4) 
            return handle(req, res, next);
        
        next(err);
    };

    next();
};

_proto.listen = function(...args) {
    const server = http.createServer(this);
    return server.listen.apply(server, args);
};