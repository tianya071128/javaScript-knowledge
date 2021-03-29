const http = require('http');
const url = require('url');

http.createServer((req, res) => {
  let urlStr = req.url;

  const myURL = url.parse(urlStr, true);
  console.log(myURL);

  switch (myURL.pathname) {
    case '/api/data':
      // jsonp 原理
      res.write(`${myURL.query.cb}("hello")`);
      break;
    default:
      res.write('page not found');
      break;
  }

  res.end();
}).listen(8080, () => {
  console.log('localhost:8080');
})