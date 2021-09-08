/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-08 10:24:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-08 17:13:21
 */
const Koa = require('koa');
const path = require('path');
const staticCache = require('koa-static-cache');

const routers = require('./routers/index'); // 加载路由器
const config = require('./config'); // 加载配置文件
const app = new Koa(); // 创建一个 app
// 初始化路由中间件
app
  .use((ctx, next) => {
    // 跨域
    if (
      ctx.request.header.host.split(':')[0] === 'localhost' ||
      ctx.request.header.host.split(':')[0] === '127.0.0.1'
    ) {
      ctx.set('Access-Control-Allow-Origin', '*');
    } else {
      ctx.set('Access-Control-Allow-Origin', SystemConfig.HTTP_server_host);
    }
    ctx.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    ctx.set('Access-Control-Allow-Credentials', true); // 允许带上 cookie
    return next();
  })
  .use(routers.routes()) // 路由中间件
  .use(routers.allowedMethods())
  .use(
    // 静态资源中间件
    staticCache(path.join(__dirname, '../public'), {
      maxAge: 365 * 24 * 60 * 60,
    })
  );

// 监听端口
app.listen(config.port, () => {
  console.log('服务启动成功');
});
