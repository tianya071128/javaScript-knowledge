/**
 * 自定义中间件
 */
function pv(ctx) {
  // ctx: 请求信息
  console.log("m2", ctx.path);
}

module.exports = function() {
  return async function(ctx, next) {
    console.log("m2 start");
    pv(ctx);
    await next();
    console.log("m2 end");
  };
};
