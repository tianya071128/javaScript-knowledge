/**
 * 自定义中间件
 */
function pv(ctx) {
  // ctx: 请求信息
  console.log("自定义中间件", ctx.path);
}

module.exports = function() {
  return async function(ctx, next) {
    pv(ctx);
    await next();
  };
};
