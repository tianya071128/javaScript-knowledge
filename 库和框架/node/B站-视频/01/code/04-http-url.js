// 1. 加载 http 核心模块
var http = require("http");

// 2.使用 http.createServer() 方法创建一个 Web 服务器
//    返回一个 Server 实例
var server = http.createServer();

// 3. 注册 request 请求事件
// 当客户端请求过来,就会自动触发服务器的 request 请求事件
// request: 请求对象,用来获取客户端的一些请求信息,例如请求路径;
// response: 响应对象, 响应对象可以用来给客户端发送响应消息
server.on("request", function(req, res) {
  console.log("收到客户端的请求了");
  // 根据不同的请求路径发送不同的响应结果
  const url = req.url;

  // if (url === "/") {
  //   res.end("index page");
  // } else if (url === "/login") {
  //   res.end("login page");
  // } else {
  //   res.end("404");
  // }

  if (url === "/products") {
    // 响应数据只能是二进制数据或者字符串
    //    此时可以 JSON 序列化
    var products = [
      {
        name: "1",
        value: "1"
      },
      {
        name: "1",
        value: "1"
      },
      {
        name: "1",
        value: "1"
      }
    ];

    res.end(JSON.stringify(products));
  }
});

// 4. 绑定端口号,启动服务器
server.listen(3000, function() {
  console.log("服务器启动成功了");
});
