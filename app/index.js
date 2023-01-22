const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const index_page = fs.readFileSync('./html_files/index.ejs', 'utf8');

const getFromClient = (request, response) => {
  const data = {
    title: 'タイトル。Indexページ',
    content: 'コンテンツ。これはテンプレートを使ったサンプルページです。',
  };
  const content = ejs.render(index_page, data);

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(content);
  response.end();
};

const server = http.createServer(getFromClient);
server.listen(3000);
console.log('起動!!!');
