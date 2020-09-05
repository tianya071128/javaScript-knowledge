const Koa = require("koa");
const app = new Koa();
app.keys = ["im a newer secret", "i like turtle"];

app.use(async ctx => {
  console.log(ctx.request);
  ctx.body = "Hello World";
});

app.listen(3000);
