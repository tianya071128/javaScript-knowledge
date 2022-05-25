// const CheckCode = require('../db').CheckCode
const jwt = require('jsonwebtoken');
const { TOKEN_ENCODE_STR } = require('../../config'); // 加载配置文件
const { NO_LOGIN_CODE } = require('../utils/responseCode');

module.exports = {
  // 生成登录 token
  create_token(user_id) {
    return jwt.sign({ user_id }, TOKEN_ENCODE_STR, {
      expiresIn: 5 * 60 * 1000,
      // expiresIn: 24 * 60 * 60 * 1000,
    }); // 有效期 1 天
  },
  // 验证登录 token 是否正确
  async check_token(ctx, next) {
    let token = ctx.get('Authorization'); // 返回请求 Authorization 头
    if (token === '') {
      // 直接抛出错误
      ctx.utils.assert(
        false,
        ctx.utils.throwError(NO_LOGIN_CODE, '你还没有登录，快去登录吧!')
      );
      return;
    }
    try {
      // 验证 token 是否过期
      let { user_id = '' } = await jwt.verify(token, TOKEN_ENCODE_STR); // 从 jwt 中解析出 user_id, 表示用户账号

      // 获取到账号信息
      const userInfo = {};
      // 保存用户的_id，便于操作
      ctx.userInfo = userInfo; // 保存用户信息
    } catch (e) {
      // 如果 Authorization 请求头字段无效的话, 就会造成解析 jwt 失败
      ctx.utils.assert(
        false,
        ctx.utils.throwError(NO_LOGIN_CODE, '登录已过期,请重新登录!')
      );
      return;
    }
    // 其他情况表示验证通过
    await next();
  },
};
