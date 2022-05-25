const log4js = require('log4js');
const { outDir, flag, level } = require('../../config').logConfig;

log4js.configure({
  appenders: { cheese: { type: 'file', filename: `${outDir}/receive.log` } },
  categories: { default: { appenders: ['cheese'], level: 'info' } },
  pm2: true,
});

const logger = log4js.getLogger();
logger.level = level;

module.exports = () => {
  return async (ctx, next) => {
    const { method, path, origin, query, body, headers, ip } = ctx.request; // 首先获取一些请求数据
    const data = {
      method,
      path,
      origin,
      query,
      body,
      ip,
      headers,
    };
    await next();
    if (flag) {
      // 配置是否打印日志
      const { status, params } = ctx;
      data.status = status; // 请求状态值
      data.params = params;
      data.result = ctx.body || 'no content'; // 返回值
      if (ctx.body?.code !== 200) {
        logger.error(JSON.stringify(data));
      } else {
        logger.info(JSON.stringify(data));
      }
    }
  };
};
