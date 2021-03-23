/*
 * @Descripttion: 
 * @Author: 温祖彪
 * @Date: 2021-03-22 20:53:22
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-22 20:56:24
 */
const http = require('http');

const server = http.createServer((req, res) => {
  let url = req.url;
  res.write(url);
  res.end();
})

server.listen(8090, 'localhost', () => {
  console.log('启动服务')
})
