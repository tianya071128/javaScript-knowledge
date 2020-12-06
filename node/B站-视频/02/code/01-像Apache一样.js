var http = require("http");
var fs = require("fs");

var server = http.createServer();
var wwwDir =
  "C:/Users/天涯游子君莫问/Desktop/学习/javaScript-knowledge/库和框架/node/B站-视频/02/www";

server.on("request", function(req, res) {
  var url = req.url;

  var filePath = "/index.html";
  if (url !== "/") {
    filePath = url;
  }
  console.log(wwwDir + filePath);
  fs.readFile(wwwDir + filePath, function(err, data) {
    if (err) {
      return res.end("404 Not Found");
    }

    res.end(data);
  });
});

server.listen(3000, function() {
  console.log("服务器启动成功了");
});
