// 1. 加载 http 核心模块
var http = require("http");

// 2.使用 http.createServer() 方法创建一个 Web 服务器
//    返回一个 Server 实例
var server = http.createServer();

// 3. 注册 request 请求事件
// 当客户端请求过来,就会自动触发服务器的 request 请求事件
// request: 请求对象,用来获取客户端的一些请求信息,例如请求路径;
// response: 响应对象, 响应对象可以用来给客户端发送响应消息
server.on("request", function(request, response) {
  console.log("收到客户端的请求了");
  // 发送响应, write 方法可以调用多次,最后使用 end 方法发送响应
  // response.write("hello");
  // response.write("中文");
  // response.end();

  // 或者,直接通过 ned 方法返回响应
  response.end("hello nodejs");
});

// 4. 绑定端口号,启动服务器
server.listen(3000, function() {
  console.log("服务器启动成功了");
});
