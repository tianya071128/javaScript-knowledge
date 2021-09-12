/*
 * @Descripttion:  处理请求
 * @Author: 温祖彪
 * @Date: 2021-09-12 11:28:21
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-12 11:32:08
 */
const response = () => {
  return async (ctx, next) => {
    // 添加一个错误处理函数 - 业务错误
    ctx.res.fail = ({ code, data, msg }) => {
      ctx.body = {
        code,
        data,
        msg,
      };
    };

    // 成功态处理函数
    ctx.res.success = msg => {
      ctx.body = {
        code: 200,
        data: ctx.body,
        msg: msg || 'success',
      };
    };

    await next();
  };
};

module.exports = response;
