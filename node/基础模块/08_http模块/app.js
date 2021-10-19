const http = require("http");
const baseMiddleware = require("./middleware/baseMiddleware");
const bodyMiddleware = require("./middleware/bodyMiddleware");
const staticMiddeware = require("./middleware/staticMiddeware");

http
  .createServer(async function (req, res) {
    const ctx = {
      req,
      res,
    };
    await baseMiddleware(ctx); // 基础处理

    try {
      await staticMiddeware(ctx); // 静态资源处理
    } catch(e) {
      return;
    } 

    await bodyMiddleware(ctx); // post - 请求体处理

    delete ctx.req;
    delete ctx.res;
    console.log(ctx);
    res.end("hello word");
  })
  .listen(3000, () => console.log("启动成功"));
