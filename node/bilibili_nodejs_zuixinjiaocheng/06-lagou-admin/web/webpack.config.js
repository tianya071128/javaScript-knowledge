/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-04-10 20:48:40
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-11 17:48:07
 */
/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-04-08 23:23:06
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-10 20:39:26
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  // devtool: '',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'js/[name].[hash:6].js'
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.art$/,
        use: {
          loader: "art-template-loader"
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html')
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'public/*.ico',
        to: path.join(__dirname, './dist/favicon.ico'),
      }]
    }),
    new CleanWebpackPlugin()
  ]
}