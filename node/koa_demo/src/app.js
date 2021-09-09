/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-08 10:24:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-09 16:46:46
 */
const Koa = require('koa');

const compose = require('koa-compose'); // 方便中间件管理
const MD = require('./middlewares/index');

const config = require('../config'); // 加载配置文件
const app = new Koa(); // 创建一个 app

// 初始化中间件
app.use(compose(MD));
//   .use(
//     // 静态资源中间件
//
//   );

// 监听端口
app.listen(config.port, () => {
  console.log('服务启动成功');
});
