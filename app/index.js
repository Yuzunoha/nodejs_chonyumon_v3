const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');

const index_page = fs.readFileSync('./html_files/index.ejs', 'utf8');
const other_page = fs.readFileSync('./html_files/other.ejs', 'utf8');
const style_css = fs.readFileSync('./html_files/style.css', 'utf8');

const sendResponse = (response, content_type, render_result) => {
  response.writeHead(200, { 'Content-Type': content_type });
  response.write(render_result);
  response.end();
};

const getFromClient = (request, response) => {
  const url_parts = url.parse(request.url, true);
  const query = url_parts.query;
  let render_result;
  switch (url_parts.pathname) {
    case '/':
      const msg = query.msg !== undefined ? `「${query.msg}」` : '';
      render_result = ejs.render(index_page, {
        title: 'Index',
        content: 'これはテンプレートを使ったサンプルページです。' + msg,
      });
      sendResponse(response, 'text/html', render_result);
      break;
    case '/other':
      render_result = ejs.render(other_page, {
        title: 'Other',
        content: 'Otherページです。',
      });
      sendResponse(response, 'text/html', render_result);
      break;
    case '/style.css':
      sendResponse(response, 'text/css', style_css);
      break;
    default:
      sendResponse(response, 'text/plain', 'no page ...');
  }
};

const server = http.createServer(getFromClient);
server.listen(3000);
console.log('起動!!!');
