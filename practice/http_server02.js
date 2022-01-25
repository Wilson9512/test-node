const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    })
    fs.writeFile(
        './header.txt',
        JSON.stringify(req.headers, null, 4),
        err => {
            if (err) {
                // res.end(`<h1>錯誤 :${error}</h1>`);
                res.end('錯誤');
            }else {
                // res.end(`<h2>ok</h2>`);
                res.end('沒問題');
            }
        });

});

server.listen(3000);