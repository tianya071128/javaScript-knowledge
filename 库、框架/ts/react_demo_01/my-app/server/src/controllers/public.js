/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-10-10 12:10:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-16 23:52:42
 */
const { getUsers } = require('../module/user');
const { PARAMS_CODE, ROUTINE_CODE } = require('../utils/responseCode');
const { create_token } = require('../utils/token');

module.exports = {
  // 登录逻辑
  async login(ctx) {
    let { username: user_id = '', password: user_pwd = '' } =
      ctx.request.body || {};

    // 验证参数
    if (!user_id || !user_pwd) {
      ctx.utils.assert(
        false,
        ctx.utils.throwError(PARAMS_CODE, '用户名或密码格式不正确!')
      );
      return;
    }

    // 从数据库中判断用户是否存在
    let res = getUsers(user_id, user_pwd);
    if (!res) {
      ctx.utils.assert(
        false,
        ctx.utils.throwError(ROUTINE_CODE, '用户名或者密码错误!')
      );
      return;
    }

    // 登录成功, 生成 token
    const token = create_token(user_id);

    ctx.body = {
      token,
      userInfo: res,
    };
  },
};
