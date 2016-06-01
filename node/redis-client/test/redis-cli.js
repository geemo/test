const net = require('net');
const readline = require('readline');

const conn = net.connect(6379, '127.0.0.1', () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.setPrompt('redis> ');
    rl.prompt();
    
    let db_match = null;
    rl.on('line', cmd => {
        db_match = cmd.match(/^select\s+(\d|1[0-5]{1})$/);
        conn.write(`${cmd}\r\n`);
        process.stdin.pause();
    });
    conn.on('data', data => {
        process.stdout.write(data);
        if(db_match && !/^-.*/.test(data)){
            rl.setPrompt(`redis[${db_match[1]}]> `);
        }
        rl.prompt();
        process.stdin.resume();
    });
});