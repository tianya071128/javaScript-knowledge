/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-10-10 12:10:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-16 23:52:42
 */
const User = require('../module/user');
const { PARAMS_CODE, ROUTINE_CODE } = require('../utils/responseCode');
const { create_token } = require('../utils/token');

// 'A' 超级管理员 | 'B' 管理员 | 'C' 游客

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
    let res = await User.findOne({ user_id });
    if (res && res.user_pwd !== user_pwd) {
      // 存在账号，验证账号密码
      ctx.utils.assert(
        false,
        ctx.utils.throwError(ROUTINE_CODE, '用户名或者密码错误!')
      );
      return;
    }

    // 生成 token
    const token = create_token(user_id);

    if (!res) {
      // 如果没有该账号，那么创建一个
      await new User({
        user_id,
        user_pwd,
        token,
        user_type: 'C',
      }).save();
    }
    res = await User.findOne({ user_id }, '-__v -_id -user_pwd');
    ctx.body = {
      token,
      userInfo: res,
    };
  },
};
