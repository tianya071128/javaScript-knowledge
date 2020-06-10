// 1. 引包
var express = require("express");

// 2. 创建服务器应用程序
var app = express();

// 公开指定目录
// 只要这样做, 就可以通过 /public/xx 的方式访问 public 的所有资源了
app.use("/public", express.static("./public/"));

app.get("/", function(req, res) {
  res.send("hello express!");
});

app.get("/about", function(req, res) {
  // 无需设置 Content-Type, 内部自动处理
  res.send("你好, 我是 Exporess!");
});

// 相当于 server.listen
app.listen(3000, function() {
  console.log("app is running at port 3000");
});
