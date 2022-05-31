const { PARAMS_CODE } = require('../utils/responseCode');

const typeMap = {
  'string.pattern.base': '参数格式错误',
  'any.required': '参数为必填项',
};

function getErrorInfo(validResult) {
  const str = [];
  const keyCache = {}; // 一个键只需要验证一次(因为一个键如果命中了多个错误, 会抛出多个错误)
  for (const {
    type, // 错误类型
    context: { key }, // 从 context 中提取出 key 错误的 key
  } of validResult.details) {
    if (!keyCache[key]) {
      str.push(`${key} ${typeMap[type] || '参数错误'}`);
      keyCache[key] = true;
    }
  }
  return str.join(',');
}

// 参数校验中间件
module.exports = (paramSchema) => {
  return async function (ctx, next) {
    let body = ctx.request.body; // 请求体参数
    try {
      if (typeof body === 'string' && body.length) body = JSON.parse(body);
    } catch (error) {}
    const paramMap = {
      router: ctx.request.params,
      query: ctx.request.query,
      body,
    };

    if (!paramSchema) return next();

    const schemaKeys = Object.getOwnPropertyNames(paramSchema);
    if (!schemaKeys.length) return next();

    // eslint-disable-next-line array-callback-return
    schemaKeys.some((item) => {
      const validObj = paramMap[item];

      // joi 模块校验方法 -- validate
      const validResult = paramSchema[item].validate(validObj, {
        allowUnknown: true, // 允许对象包含被忽略的未知键。 -- 不需要验证的键
        // convert: false, // 是否尝试将值转换为所需的类型（例如将字符串转换为数字）
        abortEarly: false, // 找出所有的错误
      });

      if (validResult.error) {
        ctx.utils.throwError(PARAMS_CODE, getErrorInfo(validResult.error));
      }
    });
    await next();
  };
};
