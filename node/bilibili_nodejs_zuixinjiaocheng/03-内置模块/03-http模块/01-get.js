const http = require('http');
const logger = require('../../utils/logger');

http.createServer((req, res) => {
  // 返回信息, 状态码, 响应头
  res.writeHead(200, {
    'content-type': 'application/json;charset=utf-8'
  })
  res.write('home!'); // 响应体
  res.end(); // 发送响应
}).listen(8080, () => {
  console.log('localhost:8080')
});

