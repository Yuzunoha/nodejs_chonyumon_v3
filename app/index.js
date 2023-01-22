const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response) => {
  fs.readFile('./html_files/index.html', 'UTF-8', (err, data) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();
  });
});

server.listen(3000);

console.log('起動!!!');
