/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-10-10 11:12:22
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-16 17:16:04
 */

const typeValidatorFn = (type) => {
  return function (test) {
    return (
      Object.prototype.toString.call(test).toLocaleLowerCase() ===
      `[object ${type.toLocaleLowerCase()}]`
    );
  };
};

const typeValidatorList = ['number', 'boolean', 'string', 'date'].reduce(
  (total, type) => {
    return {
      ...total,
      [`is${type.slice(0, 1).toUpperCase() + type.slice(1)}`]: typeValidatorFn(
        type
      ),
    };
  },
  {}
);

module.exports = {
  ...typeValidatorList,
  // 验证用户名
  validUser(test) {
    return /^\w{1,15}$/.test(test);
  },
  // 验证密码
  validPwd(test) {
    return /^\w{1,20}$/.test(test);
  },
  // 验证数据类型
};
