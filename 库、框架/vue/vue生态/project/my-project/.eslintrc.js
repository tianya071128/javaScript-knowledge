/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-13 23:15:18
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-16 00:09:31
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-debugger': 0,
  },
};
