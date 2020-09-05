var http = require("http");
var fs = require("fs");
var template = require("art-template");

var server = http.createServer();
var wwwDir =
  "C:/Users/天涯游子君莫问/Desktop/学习/javaScript-knowledge/库和框架/node/B站-视频/02/www";

server.on("request", function(req, res) {
  var url = req.url;

  fs.readFile("./template2.html", function(err, data) {
    if (err) {
      return res.end("404 Not Found");
    }

    // 获取指定目录下的文件列表
    fs.readdir(wwwDir, function(err, files) {
      if (err) {
        return res.end("Can not find www dir.");
      }

      data = template.render(data.toString(), {
        files,
        title: "模板引擎"
      });

      res.end(data);
    });
  });
});

server.listen(3000, function() {
  console.log("服务器启动成功了");
});
