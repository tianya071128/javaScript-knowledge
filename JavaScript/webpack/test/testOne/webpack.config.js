/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-11 17:47:02
 * @LastEditTime: 2020-04-21 10:28:35
 */
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js"
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: "lodash"
    })
  ],
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  }
};
