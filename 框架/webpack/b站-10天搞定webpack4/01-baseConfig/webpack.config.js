const path = require("path");
// 生成 html
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 提取出 css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// css 压缩
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
// js 压缩
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
// 清除 dist 文件夹
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development", // 模式
  entry: "./src/index.js", // 入口
  output: {
    filename: "bundle.[hash:4].js", // 打包后的文件名
    path: path.resolve(__dirname, "dist") // 路径必须是一个绝对路径
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html"
    }),
    // 提取出 css
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css"
    }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    // 在 mode 为 'production' 模式下才生效
    minimizer: [
      // 针对 js 进行压缩，在 'production' 模式下，会自动生效的，但是如果设置了 optimization.minimizer，则会覆盖 webpack 提供的默认设置，因此在这里需要指定 JS 压缩
      new UglifyjsWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      // 针对 CSS 进行压缩
      new OptimizeCssAssetsWebpackPlugin({})
    ]
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: "eslint-loader",
      //     options: {
      //       enforce: "pre"
      //     }
      //   }
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader", // es6+ 转化为 es5
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-transform-runtime"
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 5 * 1024,
            outputPath: "/img/"
          }
        }
      }
    ]
  }
};
