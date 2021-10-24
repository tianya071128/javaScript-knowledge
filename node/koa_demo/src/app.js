/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-08 10:24:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-24 13:29:30
 */
const Koa = require("koa");

const compose = require("koa-compose"); // 方便中间件管理
const MD = require("./middlewares/index");

const config = require("../config"); // 加载配置文件
const utils = require("./common/utils");
const app = new Koa(); // 创建一个 app

app.context.utils = utils;

// 初始化中间件
app.use(compose(MD));

// 监听全局错误
app.on("error", (err, ctx) => {
  if (ctx) {
    ctx.body = {
      code: 9999,
      message: `程序运行时报错：${err.message}`,
    };
  }
});

// 监听端口 - 如果不指定第二个参数, 那么将会监听 IPV6 的, 在腾讯云上是支持的, 但是有些服务器应该是不支持的
// app.listen(config.port, () => {
//   console.log("服务启动成功");
// });
app.listen(config.port, '0.0.0.0', () => {
  console.log("服务启动成功");
});