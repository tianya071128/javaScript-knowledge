const Router = require("koa-router");

const router = new Router();

// 配置路由
router.get("/", async ctx => {
  ctx.body = "这是返回数据";
});

router.get("/new", async ctx => {
  ctx.body = "这是另外一个页面";
});

module.exports = router;
