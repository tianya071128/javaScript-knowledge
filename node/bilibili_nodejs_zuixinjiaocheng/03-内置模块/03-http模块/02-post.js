const http = require('http');
const querystring = require('querystring');
const logger = require('../../utils/logger');

http.createServer((req, res) => {
  let data = '';
  // 在 post 请求中, 响应体是通过事件流接收的
  
  req.on('data', (chunk) => { // 接收数据流 - 事件
    logger.debug(chunk);
    data += chunk;
  })

  req.on('end', () => { // 数据接收完毕 - 事件
    logger.debug(req);
    // 返回信息, 状态码, 响应头
    res.writeHead(200, {
      'content-type': 'application/json;charset=utf-8'
    })
    res.write(JSON.stringify(querystring.parse(data))); // 响应体
    res.end(); // 发送响应
  })
}).listen(8080, () => {
  console.log('localhost:8080')
});


