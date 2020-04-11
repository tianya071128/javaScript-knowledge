/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-11 17:47:02
 * @LastEditTime: 2020-04-11 20:21:41
 */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js"
  },
  output: {
    filename: "[name].[contenthash].js",
    // 非入口 chunk(non-entry chunk) 的名称
    chunkFilename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Caching"
    })
  ]
};
