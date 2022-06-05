/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-10-10 12:10:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-16 23:52:42
 */
const RouterInfo = require('../module/routerInfo');
const { getuuid } = require('../utils');

// 'A' 超级管理员 | 'B' 管理员 | 'C' 游客

module.exports = {
  // 获取路由
  async getRouterInfoController(ctx) {
    const res = await RouterInfo.findOne({
      user_type: ctx.userInfo?.user_type,
    });
    ctx.body = res?.router_info;
  },
  // 编辑路由
  async resolveRouterInfoController(ctx) {
    const res = await RouterInfo.findOne({
      user_type: 'A',
    });
    const { id, parentID } = ctx.request.body;
    if (!id && !parentID) {
      // 则是新增顶级路由
      res.router_info.push({
        id: getuuid(),
        ...ctx.request.body,
      });
      await res.save();
    }
    ctx.body = {
      message: 'ok',
    };
  },
};
