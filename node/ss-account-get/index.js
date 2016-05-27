#!/usr/bin/env node
'use strict';

const http = require('http');
const cheerio = require('cheerio');

const req = http.request({
    hostname: 'www.ishadowsocks.net',
    port: 80,
    path: '/',
    method: 'GET'
}, res => {
    let chunks = [];
    
    res.on('data', data => chunks.push(data));
    res.on('end', () => {
        let $ = cheerio.load(Buffer.concat(chunks).toString());
        let free_divs = $('#free div.row:last-child > div');
        for(let i = 0; i < free_divs.length; ++i){
            let h4s = $(free_divs[i]).children('h4');
            for(let j = 0; j < 4; ++j){
                console.log($(h4s[j]).text());
            }
            console.log('\r\n');
        }
    });
});

req.end();