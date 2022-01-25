const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    res.write(`<div>122</div>`);//回應
    res.end(`<h2>Hello World</h2>
            <p>${req.url}</p>`);
});

server.listen(3000);