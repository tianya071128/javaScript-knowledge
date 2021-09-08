/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-08 10:24:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-08 11:37:28
 */
const Koa = require('koa');

const routers = require('./routers/index'); // 加载路由器
const config = require('./config'); // 加载配置文件
const app = new Koa(); // 创建一个 app
// 初始化路由中间件
app.use(routers.routes()).use(routers.allowedMethods());

app.listen(config.port, () => {
  console.log('服务启动成功');
});
