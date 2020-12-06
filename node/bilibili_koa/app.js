const Koa = require("koa");

const app = new Koa();

const router = require("./router");

// 启动路由
app.use(router.routes(), router.allowedMethods());

app.listen(3000);
