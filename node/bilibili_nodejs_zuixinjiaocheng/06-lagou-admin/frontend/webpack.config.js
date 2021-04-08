/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-04-08 23:23:06
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-09 00:11:38
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  // devtool: '',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'app.js'
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    port: 8080
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html')
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'public/*.ico',
        to: path.join(__dirname, './dist/'),
      }]
    })
  ]
}