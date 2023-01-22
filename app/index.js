const http = require('http');
const fs = require('fs');

const promiseReadFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'UTF-8', (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

const getFromClient = async (request, response) => {
  const filePath = './html_files/index.html';
  const data = await promiseReadFile(filePath);
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(data);
  response.end();
};

const server = http.createServer(getFromClient);
server.listen(3000);
console.log('起動!!!');
