const koa = require("koa");
const app = new koa();

app.use(async ctx => {
  let url = ctx.url;
  /** 从 request 接受 Get 请求参数 */
  let request = ctx.request;
  let req_query = request.query; // 已经编译成对象 {"user":"wzb","age":"25"}
  let req_querystring = request.querystring; // 原参数: user=wzb&age=2

  /** 从 ctx 中获取 Get 请求参数 */
  let ctx_query = ctx.query; // {"user":"wzb","age":"25"}
  ctx.body = {
    url,
    req_query,
    req_querystring,
    ctx_query
  };
});

app.listen(3000, () => {
  console.log("server runing...");
});
