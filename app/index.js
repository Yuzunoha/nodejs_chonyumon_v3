const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const index_page = fs.readFileSync('./html_files/index.ejs', 'utf8');
const other_page = fs.readFileSync('./html_files/other.ejs', 'utf8');
const style_css = fs.readFileSync('./html_files/style.css', 'utf8');

const sendResponse = (response, content_type, render_result) => {
  response.writeHead(200, { 'Content-Type': content_type });
  response.write(render_result);
  response.end();
};

let data = { msg: 'no message...' };

const write_index = (request, response) => {
  var msg = '※伝言を表示します。';
  var content = ejs.render(index_page, {
    title: 'Index',
    content: msg,
    data,
  });
  sendResponse(response, 'text/html', content);
};

const response_index = (request, response) => {
  if ('POST' === request.method) {
    let body = '';
    request.on('data', (data) => (body += data));
    request.on('end', () => {
      data = qs.parse(body);
      write_index(request, response);
    });
  } else {
    write_index(request, response);
  }
};

function response_other(request, response) {
  const data = {
    Taro: ['taro@yamada', '09-999-999', 'Tokyo'],
    Hanako: ['hanako@flower', '080-888-888', 'Yokohama'],
    Sachiko: ['sachi@happy', '070-777-777', 'Nagoya'],
    Ichiro: ['ichi@baseball', '060-666-666', 'USA'],
  };
  const content = ejs.render(other_page, {
    title: 'Other',
    content: 'これはOtherページです。',
    data,
    filename: './html_files/data_item.ejs', // includeのために必須
  });
  sendResponse(response, 'text/html', content);
}

const getFromClient = (request, response) => {
  const url_parts = url.parse(request.url, true);
  switch (url_parts.pathname) {
    case '/':
      response_index(request, response);
      break;
    case '/other':
      response_other(request, response);
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
