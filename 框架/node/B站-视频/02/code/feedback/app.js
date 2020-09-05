var http = require("http");
var fs = require("fs");
var template = require("art-template");
var url = require("url");

var comments = [
  {
    name: "张三",
    message: "今天天气不错!",
    dateTime: "2015-10-16"
  },
  {
    name: "张三",
    message: "今天天气不错!",
    dateTime: "2015-10-16"
  }
];

// 简写方式: createServer 参数会自动注册 request 事件
http
  .createServer(function(req, res) {
    // 使用 url 模块解析 url
    var parseObj = url.parse(req.url, true);

    var pathname = parseObj.pathname;
    if (pathname === "/") {
      fs.readFile("./views/index.html", function(err, data) {
        if (err) {
          return res.end("404 Not Found.");
        }

        var str = template.render(data.toString(), {
          comments
        });

        res.end(str);
      });
    } else if (pathname === "/post") {
      fs.readFile("./views/post.html", function(err, data) {
        if (err) {
          return res.end("404 Not Found.");
        }

        res.end(data);
      });
    } else if (pathname.indexOf("/public/") === 0) {
      // 处理静态资源 -- 以 '/public/' 开头的都直接返回文件
      fs.readFile("." + pathname, function(err, data) {
        if (err) {
          return res.end("404 Not Found.");
        }
        res.end(data);
      });
    } else if (pathname === "/pinglun") {
      var comment = parseObj.query;
      comment.dateTime = "2017-11-2";
      comments.unshift(comment);
      // 重定向:
      // 1. 状态码设置为 302 临时重定向
      res.statusCode = 302;
      // 2. 在响应中通过 Location 告诉客户端重定向 url -- 客户端在收到 302 状态码时,就会根据 Location 来重定向
      res.setHeader("Location", "/");
      return res.end();
    } else {
      // 404 处理
      res.end("404 Not Found.");
    }
  })
  .listen(3000, function() {
    console.log("running...");
  });
