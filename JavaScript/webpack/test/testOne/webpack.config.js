/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-11 17:47:02
 * @LastEditTime: 2020-04-11 17:57:01
 */
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js"
  },
  output: {
    filename: "[name].bundle.js",
    // 非入口 chunk(non-entry chunk) 的名称
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
