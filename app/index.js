const http = require('http');
const fs = require('fs');

const server = http.createServer(async (request, response) => {
  const data = await new Promise((resolve) => {
    fs.readFile('./html_files/index.html', 'UTF-8', (e, d) => resolve(d));
  });
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(data);
  response.end();
});

server.listen(3000);

console.log('起動!!!');
