/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-23 21:14:34
 * @LastEditTime: 2020-04-23 21:20:45
 */
const path = require("path");
const CopyRightWebpackPlugin = require("./plugins/copyright-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  plugins: [
    new CopyRightWebpackPlugin({
      name: "baba"
    })
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  }
};
