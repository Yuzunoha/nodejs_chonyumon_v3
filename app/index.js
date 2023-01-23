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

const response_index = (request, response) => {
  const data = {
    Taro: '090-999-999',
    Hanako: '080-888-888',
    Sachiko: '070-777-777',
    Ichiro: '060-666-666',
  };
  const content = ejs.render(index_page, {
    title: 'Index',
    content: 'これはIndexページです。',
    data: data,
    filename: './html_files/data_item.ejs', // includeのために必須
  });
  sendResponse(response, 'text/html', content);
};

const response_other = (request, response) => {
  let msg = 'これはOtherページです。';
  if (request.method === 'POST') {
    let body = '';
    request.on('data', (data) => (body += data));
    request.on('end', () => {
      const post_data = qs.parse(body); // データのパース
      console.log({ body, post_data });
      msg += `post_data.msg: ${post_data.msg}`;
      const content = ejs.render(other_page, { title: 'Other', content: msg });
      sendResponse(response, 'text/html', content);
    });
  } else {
    msg = 'ページがありません';
    const content = ejs.render(other_page, { title: 'Other', content: msg });
    sendResponse(response, 'text/html', content);
  }
};

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
