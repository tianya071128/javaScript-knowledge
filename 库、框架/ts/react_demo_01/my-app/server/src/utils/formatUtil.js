/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-10-16 17:04:51
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-21 22:19:40
 */
const { isDate } = require('./validator');

module.exports = {
  // 格式化日期 - 格式化成 yyyy-xx-xx xx:xx:xx
  formatDate(date, flag) {
    if (!date) {
      date = new Date();
    }

    if (!isDate(date)) {
      throw new TypeError('请传入 Date 类型');
    }

    const year = date.getFullYear();
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hours =
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const second =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return `${year}-${month}-${day}${
      flag ? '' : ` ${hours}:${minutes}:${second}`
    }`;
  },
};
