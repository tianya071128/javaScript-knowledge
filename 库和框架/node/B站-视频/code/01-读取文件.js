// 浏览器中的 JS 是没有文件操作的能力的
// 但是 Node 中的 JS 具有文件操作的能力

// fs 是 file-system 的简写，就是文件系统的意思

// 1. 使用 require 方法加载 fs 核心模块
var fs = require("fs");

// 2. 读取文件
//    第一个参数就是要读取的文件路径；
//    第二个参数是一个回调函数;
//      error：读取失败时，error 就是错误对象；读取成功，error 为 null；
//      data： 读取失败时，undefined；读取成功，就是返回数据

fs.readFile("./data/hello.txt", function(error, data) {
  // 文件中存储的其实都是二进制数据
  // 在这里打印的是 转化后的 16 进制
  // 无论是 2 进制还是 16 进制，都可以通过 toString 方法转换
  console.log(data); // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
  console.log(data.toString()); // hello world
});
