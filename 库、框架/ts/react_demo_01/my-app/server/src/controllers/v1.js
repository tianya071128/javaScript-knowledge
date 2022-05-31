/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-10-10 12:10:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-16 23:52:42
 */
// const User = require('../module/user');
// const { PARAMS_CODE, ROUTINE_CODE } = require('../utils/responseCode');
// const { create_token } = require('../utils/token');
// const { omitProp } = require('../utils');

const RouterInfo = require('../module/routerInfo');

// 'A' 超级管理员 | 'B' 管理员 | 'C' 游客

module.exports = {
  // 登录逻辑
  async getRouterInfoController(ctx) {
    const res = await RouterInfo.findOne({
      user_type: ctx.userInfo?.user_type,
    });
    ctx.body = res?.router_info;
  },
};
