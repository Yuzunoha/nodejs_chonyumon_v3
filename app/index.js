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

const setCookie = (key, value, response) => {
  var cookie = escape(value);
  response.setHeader('Set-Cookie', [key + '=' + cookie]);
};

const getCookie = (key, request) => {
  var cookie_data = '';
  if (request.headers.cookie !== undefined) {
    cookie_data = request.headers.cookie;
  }
  console.log({ cookie_data });
  var data = cookie_data.split(';');
  for (const i in data) {
    if (data[i].trim().startsWith(key + '=')) {
      // 発見した
      var result = data[i].trim().substring(key.length + 1);
      return unescape(result);
    }
  }
  return '';
};

const write_index = (request, response) => {
  var cookie_data = getCookie('msg', request);
  var content = ejs.render(index_page, {
    title: 'Index',
    content: '※伝言を表示しています。',
    data,
    cookie_data,
  });
  sendResponse(response, 'text/html', content);
};

const response_index = async (request, response) => {
  if ('POST' === request.method) {
    var body = '';
    request.on('data', (data) => (body += data));
    await new Promise((resolve) => {
      request.on('end', () => {
        // グローバル変数を上書きする
        data = qs.parse(body);
        // クッキーを保存する
        setCookie('msg', data.msg, response);
        resolve();
      });
    });
  }
  write_index(request, response);
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
