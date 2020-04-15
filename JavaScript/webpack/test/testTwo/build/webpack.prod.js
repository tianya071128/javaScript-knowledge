/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-13 10:40:11
 * @LastEditTime: 2020-04-15 17:20:31
 */
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

const prodConfig = {
  mode: "production",
  devtool: "cheap-module-source-map"
};

module.exports = merge(commonConfig, prodConfig);
