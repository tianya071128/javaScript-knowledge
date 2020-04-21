/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-15 17:08:55
 * @LastEditTime: 2020-04-21 11:10:37
 */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const merge = require("webpack-merge");
const devConfig = require("./webpack.dev.js");
const prodConfig = require("./webpack.prod.js");

const commonConfig = {
  entry: {
    main: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          // loader 的配置项
          options: {
            // 打包文件名称
            // [name]: 图片原本的名字 | [hash]: 文件 hash 值 | [ext]：文件后缀
            name: "[name]_[hash].[ext]",
            // 导出文件夹
            outputPath: "images/",
            limit: 2400
          }
        }
      },
      {
        test: /\.(eot|ttf|svg)$/,
        loader: "file-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 定义模板文件
      template: "./index.html",
      title: "webpack"
    }),
    new CleanWebpackPlugin()
  ],
  // 优化配置项
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: "vendors"
        }
      }
    }
  }
};

module.exports = env => {
  if (env && env.production) {
    return merge(commonConfig, prodConfig);
  } else {
    return merge(commonConfig, devConfig);
  }
};
