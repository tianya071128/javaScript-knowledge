const { merge } = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const common = require("./webpack.common.js");
const webpack = require("webpack");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new UglifyJSPlugin(),
    // 注入环境变量
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
});
