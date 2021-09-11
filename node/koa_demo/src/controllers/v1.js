/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-08 11:10:24
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-11 22:29:44
 */
module.exports = {
  // 测试一下
  async testGET(ctx) {
    // ctx.query 中就保存着 query 查询参数
    ctx.body = ctx.query;
  },
  async testPOST(ctx) {
    console.log(ctx.request.body); // 可以通过 ctx.request.body 来获取请求体的数据
    ctx.body = ctx.request.body;
  },
  async testPostFormData(ctx) {
    ctx.body = ctx.request.body;
  }
};
