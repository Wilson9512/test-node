const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async (req,res)=>{
    res.writeHead(200,{
        'Content-Type':'text/html; charset=utf-8'
    });
    try{
        await fs.writeFile(__dirname + './Wilson-header.txt', JSON.stringify(req.headers, null, 4));
    } catch(ex){
        res.end('沒問題');
    }

});
// console.log(`POST : ${process.env.POST}`);
server.listen(3000);