/*
 * @Descripttion: 
 * @Author: 温祖彪
 * @Date: 2021-09-12 11:31:01
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-12 12:00:14
 */
const error = () => {
  return async (ctx, next) => {
    try {
      // 利用中间件原理，当路由处理完成后，已经处理了响应
      await next();
      if (ctx.status === 200) { // 如果状态为 200, 表示成功态
        ctx.res.success();
      }
    } catch (err) {
      if (err.code) { // 如果是业务代码出错，那么就可以抛出一个错误，在这里捕获， 统一处理
        // 自己主动抛出的错误
        ctx.res.fail({ code: err.code, msg: err.message });
      } else {
        // 程序运行时的错误
        ctx.app.emit('error', err, ctx);
      }
    }
  };
};

module.exports = error;

