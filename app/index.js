const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');

const index_page = fs.readFileSync('./html_files/index.ejs', 'utf8');
const other_page = fs.readFileSync('./html_files/other.ejs', 'utf8');
const style_css = fs.readFileSync('./html_files/style.css', 'utf8');

const getFromClient = (request, response) => {
  const url_parts = url.parse(request.url, true);
  const query = url_parts.query;
  let content_type, content;
  switch (url_parts.pathname) {
    case '/':
      content_type = 'text/html';
      const msg = query.msg !== undefined ? `「${query.msg}」` : '';
      content = ejs.render(index_page, {
        title: 'Index',
        content: 'これはテンプレートを使ったサンプルページです。' + msg,
      });
      break;
    case '/other':
      content_type = 'text/html';
      content = ejs.render(other_page, {
        title: 'Other',
        content: 'Otherページです。',
      });
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
