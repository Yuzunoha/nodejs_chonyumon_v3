const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');

const index_page = fs.readFileSync('./html_files/index.ejs', 'utf8');
const style_css = fs.readFileSync('./html_files/style.css', 'utf8');

const getFromClient = (request, response) => {
  const url_parts = url.parse(request.url);
  let content_type, content;
  switch (url_parts.pathname) {
    case '/':
      content_type = 'text/html';
      const data = {
        title: 'タイトル。Indexページ',
        content: 'コンテンツ。これはテンプレートを使ったサンプルページです。',
      };
      content = ejs.render(index_page, data);
      break;
    case '/style.css':
      content_type = 'text/css';
      content = style_css;
      break;
    default:
      content_type = 'text/plain';
      content = 'no page ...';
  }
  response.writeHead(200, { 'Content-Type': content_type });
  response.write(content);
  response.end();
};

const server = http.createServer(getFromClient);
server.listen(3000);
console.log('起動!!!');
