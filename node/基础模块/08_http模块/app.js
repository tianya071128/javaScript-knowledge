const http = require("http");
const baseMiddleware = require("./middleware/baseMiddleware");

http
  .createServer(async function (req, res) {
    const ctx = {
      req,
      res,
    };
    await baseMiddleware(ctx);


    delete ctx.req;
    delete ctx.res;
    console.log(ctx);
  })
  .listen(3000, () => console.log("启动成功"));
