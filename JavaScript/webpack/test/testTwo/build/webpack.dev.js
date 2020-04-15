/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-13 10:40:11
 * @LastEditTime: 2020-04-15 17:20:02
 */
const webpack = require("webpack");
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

const devConfig = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    // contentBase
    // 默认打开浏览器
    open: false,
    // 开启 HMR
    hot: true,
    hotOnly: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};

module.exports = merge(commonConfig, devConfig);
