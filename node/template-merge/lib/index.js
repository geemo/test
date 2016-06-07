#!/usr/bin/env node

'use strict';
const fs = require('fs');
const path = require('path');

// 当前工作路径
const cwd = process.cwd();
// 入口文件
const entryFile = process.argv[2];
// 入口文件所在目录
let entryDirname = '';

try{
    // 判断命令行是否输入了入口文件参数
    if(!entryFile){
        throw new Error('path must be string, received undefined!');
    }
    // 入口文件路径
    let entryPath = path.join(cwd, entryFile);
    // 判断入口文件是否存在，不存在会抛出异常    
    fs.statSync(entryPath);   
    // 获取入口文件所在的目录
    entryDirname = path.dirname(entryPath);
}catch(err){
    catchError(err);
}

let realPath = path.join(cwd, entryFile);
merge(path.join(cwd, entryFile));
// 监听文件修改
fs.watch(realPath, (event, filename) => {
    // 如果是内容修改，重新渲染合并
    if(event === 'change'){
        console.log('\x1b[33mlisten to the file has been modified, rebuild...\x1b[0m');
        merge(realPath);    
    }
});

function merge(file){
    fs.readFile(file, 'utf8', (err, data) => {
        if(err) catchError(err);
        
        // 替换模板中<link rel="import" href="path">为对应path的内容
        let replaceData = data.replace(/<link\s+rel="import"\s+href="(.*)"\s*>/mgi, (match, m1) => {
            let m1Data = '';
            try{
                // 读取替换文件的内容，若文件路径不存在则抛出异常
                m1Data = fs.readFileSync(path.join(entryDirname, m1), 'utf8');
            }catch(err){
                catchError(err);
            }
            
            return m1Data;
        });
        
        // 在入口文件所在目录生成一个合并文件，形如: {filename}-merge.{ext}
        let pair = path.basename(entryFile).split('.');
        fs.writeFile(path.join(entryDirname, `${pair[0]}-merge.${pair[1]}`), replaceData, 'utf8', err => {
            if(err) catchError(err);
            console.log('\x1b[32mmerge success!\x1b[0m');
        });
    });
}

function catchError(err){
    // 以红色字体打印错误栈信息，并退出进程。
    console.log(`\x1b[31m${err.stack}\x1b[0m`);  
    process.exit(1);
}