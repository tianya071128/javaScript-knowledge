var fs = require("fs");

// 读取目录
fs.readdir(
  "C:/Users/天涯游子君莫问/Desktop/学习/javaScript-knowledge/库和框架/node/B站-视频/02/www",
  function(err, files) {
    console.log(err, files);
  }
);
