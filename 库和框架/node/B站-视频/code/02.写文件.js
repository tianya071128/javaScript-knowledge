var fs = require("fs");

// 第一个参数：文件路径
// 第二个参：文件内容
// 第三个参数：回调函数
//  error：成功时，值为 null； 失败，值为错误对象；
fs.writeFile("./data/你好.md", "I LOVE YOU", function(error) {
  console.log(error);
});
