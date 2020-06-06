var http = require("http");
var fs = require("fs");

var server = http.createServer();

server.on("request", function(req, res) {
  console.log(req.url);
  var url = req.url;

  if (url === "/") {
    fs.readFile("./resource/index.html", function(err, data) {
      if (err) {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("文件读取失败, 请稍后重试");
      } else {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(data);
      }
    });
  } else if (url === "/images") {
    fs.readFile("./resource/imgage.png", function(err, data) {
      if (err) {
        console.log(err);
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("文件读取失败, 请稍后重试");
      } else {
        // data 默认是二进制数据, 可以通过 .toString 转为能识别的字符串
        // res.end() 支持两种数据类型, 一种是二进制, 一种是字符串
        // charset=utf-8 字符集是针对字符串的, 所以对于图片来讲是不需要指定字符编码的
        res.setHeader("Content-Type", "image/png");
        res.end(data);
      }
    });
  }
});

server.listen(3000, function() {
  console.log("Server is running...");
});

fs.readFile("./resource/学习路径.png", function(err, data) {
  console.log(err, data, data.toString());
});
