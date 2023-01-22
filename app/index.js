const http = require('http');

const server = http.createServer((request, response) => {
  // response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('<html><h1>Hello World</h1></html>');
});

server.listen(3000);

console.log('起動!!!');
