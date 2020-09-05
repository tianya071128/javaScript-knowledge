var http = require("http");

var server = http.createServer();

server.on("request", function(req, res) {
  // 浏览器在不知道服务器响应内容的编码的情况下会按照当前操作系统的默认编码去解析 => 中文操作系统默认是 gbk
  // 此时, 需要添加响应头 Content-Type 告知浏览器编码方式
  // res.setHeader("Content-Type", "text/planin; charset=utf-8");
  // res.end("hello 世界");

  const url = req.url;

  if (url === "/plain") {
    res.setHeader("Content-Type", "text/planin; charset=utf-8");
    res.end("hello 世界");
  } else if (url === "/html") {
    // 如果发送的是 html 格式的字符串, 则也要告诉浏览器发送的是 text/html 格式的内容
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end("<p>hello html <a href=''>点我</a></p>");
  }
});

server.listen(3000, function() {
  console.log("Server is running...");
});
