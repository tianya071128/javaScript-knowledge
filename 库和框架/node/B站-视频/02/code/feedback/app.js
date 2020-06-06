var http = require("http");
var fs = require("fs");

// 简写方式: createServer 参数会自动注册 request 事件
http
  .createServer(function(req, res) {
    var url = req.url;

    if (url === "/") {
      fs.readFile("./views/index.html", function(err, data) {
        if (err) {
          return res.end("404 Not Found.");
        }

        res.end(data);
      });
    } else if (url.indexOf("/public/") === 0) {
      // 处理静态资源 -- 以 '/public/' 开头的都直接返回文件
      fs.readFile("." + url, function(err, data) {
        if (err) {
          return res.end("404 Not Found.");
        }
        res.end(data);
      });
    } else {
      // 404 处理
      res.end("404 Not Found.");
    }
  })
  .listen(3000, function() {
    console.log("running...");
  });
