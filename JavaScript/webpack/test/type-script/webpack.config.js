/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-21 17:14:25
 * @LastEditTime: 2020-04-21 17:24:36
 */
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: "build.js",
    path: path.resolve(__dirname, "dist")
  }
};
