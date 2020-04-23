/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-23 20:22:54
 * @LastEditTime: 2020-04-23 20:29:31
 */
module.exports = function(source) {
  console.log(source, this.query);

  return source.replace("dell", "dellLee");
};
