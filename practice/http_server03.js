require('dotenv').config();//載入 .env的設定

const http = require('http');

const server = http.createServer((req,res)=>{
    res.writeHead(200,{
        'Content-Type':'text/html'
    })
    res.end(`<p>POST : ${process.env.POST}</p>`);

});
console.log(`POST : ${process.env.POST}`);
server.listen(process.env.POST);