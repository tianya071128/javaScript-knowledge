var http = require("http");
var fs = require("fs");

var server = http.createServer();
var wwwDir =
  "C:/Users/天涯游子君莫问/Desktop/学习/javaScript-knowledge/库和框架/node/B站-视频/02/www";

server.on("request", function(req, res) {
  var url = req.url;

  fs.readFile("./template.html", function(err, data) {
    if (err) {
      return res.end("404 Not Found");
    }

    // 获取指定目录下的文件列表
    fs.readdir(wwwDir, function(err, files) {
      if (err) {
        return res.end("Can not find www dir.");
      }
      /**
       * 如何将得到的文件名和目录名替换到 template.html 中?
       * 1. 在 template.html 中需要替换的位置预留一个特殊的标记(类似模板引擎)
       * 2. 根据 files 生成需要的 HTML 内容
       */

      // 1. 生成 html
      var content = "";

      for (const item of files) {
        content += `<div>${item}</div>`;
      }

      // 2. 替换 html
      data = data.toString();
      data = data.replace("^_^", content);

      res.end(data);
    });
  });
});

server.listen(3000, function() {
  console.log("服务器启动成功了");
});
