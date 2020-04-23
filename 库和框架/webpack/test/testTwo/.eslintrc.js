/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-23 14:55:03
 * @LastEditTime: 2020-04-23 15:01:39
 */
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {},
  extends: "eslint:recommended"
};
