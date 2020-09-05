var express = require("express");
var bodyParser = require("body-parser");

var app = express();

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
// 配置 body-parser 中间件
app.use(bodyParser.urlencoded({ extended: false }));

// 开放静态资源
app.use("/public", express.static("./public"));

// 第一个参数:当渲染以 .art 结尾的文件的时候, 使用 art-template 模板引擎
app.engine("html", require("express-art-template"));
// Exporess 提供了一个方法: render
// 默认是不可用的,但是如果配置了模板引擎就可以使用了
/*
 * res.render('html模板名', { 模板数据 });
 * 第一个参数: 不能写路径, 默认会去项目中的 views 目录查找该模板文件
 * 也就是说 Express 有一个约定: 开发人员把所有的试图文件都放到 views 目录中
 */

app.get("/", function(req, res) {
  res.render("index.html", {
    comments: comments
  });
});
app.get("/post", function(req, res) {
  res.render("post.html");
});
app.post("/post", function(req, res) {
  var comment = req.body;
  comment.dateTime = "2017-11-5";
  comments.unshift(comment);
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("running...");
});
