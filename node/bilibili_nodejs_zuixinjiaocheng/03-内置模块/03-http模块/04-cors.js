const http = require('http');
const url = require('url');

http.createServer((req, res) => {
  let urlStr = req.url;

  const myURL = url.parse(urlStr, true);
  console.log(myURL);

  switch (myURL.pathname) {
    case '/api/data':
      res.writeHead(200, {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
      res.write('{ "ret": "test" }')
      break;
    default:
      res.write('page not found');
      break;
  }

  res.end();
}).listen(8080, () => {
  console.log('localhost:8080');
})
