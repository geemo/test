#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const repl = require('repl');

const ctx = repl.start('> ').context;

ctx.load = name => {
    const real_name = require.resolve(name);
    const module_name = path.basename(name).split('.')[0].replace(/-+(\w)/g, (str, $1) => {
        return $1.toUpperCase();
    });

    try {
        ctx[module_name] = require(real_name);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

ctx.reload = name => {
    const time = Date.now();

    ctx.clear(name);
    ctx.load(name);

    console.log(`\x1b[32mreload success, use time: ${Date.now() - time}ms\x1b[0m`);
};

ctx.clear = name => {
    const real_name = require.resolve(name);
    if (require.cache[real_name]) {
        delete ctx[name];
        _clear(real_name);
        delete require.cache[real_name];
    }

    function _clear(real_name) {
        require
            .cache[real_name]
            .children
            .map((mod, idx, arr) => {
                return mod.id;
            })
            .forEach((mod_name, idx, arr) => {
                if (require.cache[mod_name].children.length) _clear(mod_name);
                else delete require.cache[mod_name];
            });
    }
};