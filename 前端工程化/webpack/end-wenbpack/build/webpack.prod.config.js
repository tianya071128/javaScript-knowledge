const path = require("path");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config");
// 将CSS代码提取为独立文件的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 清空打包文件夹
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 压缩 CSS
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 压缩 JS
const TerserJSPlugin = require("terser-webpack-plugin");

module.exports = merge(baseWebpackConfig, {
  mode: "production", // production
  output: {
    filename: "js/[name].[contenthash:6].js", // 打包后的文件名称
    path: path.resolve(__dirname, "../dist") // 打包后的目录，必须是绝对路径
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 解析 css
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      },
      {
        test: /\.less$/, // 解析 less
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:6].css"
    }), //为抽取出的独立的CSS文件设置配置参数
    new CleanWebpackPlugin()
  ],
  // 在 mode：production 中的优化项
  optimization: {
    moduleIds: "hashed", // 模块标识符
    runtimeChunk: "single", // 提取引导模板
    minimizer: [
      // new TerserJSPlugin({}), // 压缩 JS
      new OptimizeCssAssetsPlugin() // 压缩 CSS
    ],
    splitChunks: {
      chunks: "all", // 分割代码的模式 all(同步异步都分割模式) | initial(只分割同步引入的模块) | async(只分割出异步引入的模块)
      cacheGroups: {
        styles: {
          // 将所有的 CSS 到一个文件中 - 存在副作用的，例如 import() 异步模块中引入的样式会覆盖一开始的样式，但是可能需要懒加载这个异步模块时才需要加载这个样式文件
          // 而通过将所有 CSS 都加载到一个文件中，就会出现意料之外的事情
          name: "styles",
          test: /\.(css|less)$/,
          chunks: "all",
          enforce: true
        },
        // 分组
        libs: {
          name: "chunk-libs", // 打包 chunk 的名称
          test: /[\\/]node_modules[\\/]/, // 匹配规则
          priority: 10, // 优先级
          chunks: "initial"
        },
        elementUI: {
          name: "chunk-elementUI", // 单独将 elementUI 拆包
          priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
          test: /[\\/]node_modules[\\/]element-ui[\\/]/
        },
        commons: {
          name: "chunk-commons",
          test: path.resolve(__dirname, "../src/components"), // 可自定义拓展你的规则
          minChunks: 2, // 最小共用次数
          priority: 5,
          reuseExistingChunk: true // 模块嵌套引入时，判断是否复用已经被打包的模块
        }
      }
    }
  }
});
