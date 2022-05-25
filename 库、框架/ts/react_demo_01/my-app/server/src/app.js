/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-08 10:24:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-27 22:24:49
 */
const Koa = require('koa');

const compose = require('koa-compose'); // 方便中间件管理
const MD = require('./middlewares/index');

const config = require('../config'); // 加载配置文件
const utils = require('./common/utils');
const { PROGRAM_CODE } = require('./utils/responseCode');
const app = new Koa(); // 创建一个 app

app.context.utils = utils;

// 初始化中间件
app.use(compose(MD));

// 监听全局错误
app.on('error', (err, ctx) => {
  if (ctx) {
    // 这里有点问题，error 事件中无法返回 state = 200 的情况
    ctx.body = {
      code: PROGRAM_CODE,
      message: `程序运行时报错：${
        process.env.NODE_ENV === 'dev' ? err.message : '请联系管理员'
      }`,
    };

    // err.
  }
});

// 监听端口
app.listen(config.port, () => {
  console.log('服务启动成功');
});
