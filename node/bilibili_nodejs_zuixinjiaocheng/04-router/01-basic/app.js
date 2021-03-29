const http = require('http');
const fs = require('fs').promises;

http.createServer(async (req, res) => {
  // 获取 url
  const urlString = req.url;
  console.log(urlString);

  // 简陋版本
  // switch (urlString) {
  //   case '/':
  //     res.end('hello');
  //     break;
  //   case '/home':
  //     fs.readFile('./home.html', (err, content) => {
  //       res.end(content);
  //     })
  //     break;
  //   case '/index.js':
  //     fs.readFile('./index.js', (err, content) => {
  //       res.end(content);
  //     })
  //     break;
  //   default:
  //     res.end('404');
  //     break;
  // }

  // 重构
  try {
    const content = await fs.readFile(`.${urlString}`);

    res.end(content);
  } catch (e) {
    res.end('404');
  }
}).listen(8080, () => {
  console.log('localhost:8080...')
})