/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-09 21:28:58
 * @LastEditTime: 2020-04-09 22:24:42
 */
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  // 输出
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
