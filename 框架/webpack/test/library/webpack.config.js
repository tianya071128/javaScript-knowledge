/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-21 14:32:06
 * @LastEditTime: 2020-04-21 14:53:31
 */
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "libray.js",
    library: "library",
    libraryTarget: "umd"
  }
};
