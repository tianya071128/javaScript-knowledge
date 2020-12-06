/**
 * 1. 安装 art-template
 * 2. 在需要使用的文件模板中加载 art-template
 * 3. 使用模板引擎
 */

var template = require("art-template");
var fs = require("fs");

fs.readFile("./tpl.html", function(err, data) {
  if (err) {
    return console.log("读取文件出错了");
  }

  data = data.toString();

  var ret = template.render(data, {
    name: "Jack"
  });

  console.log(ret);
});
