const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //将CSS代码提取为独立文件的插件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //CSS模块资源优化插件

module.exports = {
  mode: "development",
  /**
   * 入口 - 起点或是应用程序的起点入口。
   */
  // entry: "./src/index.js" // 传入字符串时，chunk 的名称则为 chunk
  // entry: ["./src/index.js", "./src/assets/entry/entry1.js"] // 当为数组形式，则会将数组入口导出到一个 chunk 上。并且当配合 output.library 时，那么只会暴露数组中的最后一个模块
  // entry: () => "./src/index.js" // 函数形式，返回上面三种形式之一。可以用来实现动态入口
  entry: { app: "./index.js" }, // 推荐 - 对象形式，则会打包为多个 chunk，chunk 的 name 为对象的 key。
  /**
   * 上下文 - string 类型，webpack 的主目录，entry 和 module.rules.loader 选项是相对于此目录解析的
   */
  context: path.resolve(__dirname, "src"),
  /**
   * 输出 - 控制 webpack 如何向硬盘写入编译文件。可以存在多个 入口 起点，但只指定一个 输出 配置
   */
  output: {
    /**
     * filename - 决定了每个输出 bundle 的名称。当通过多个入口起点（entry point)、代码拆分（code splitting) 或各种插件（plugin）创建多个 bundle，应该赋予每个 bundle 一个唯一的名称...
     * [name]: 模块名称 | [hash]：模块标识符的 hash | [chunkhash]：chunk 内容的 hash | [id]：模块标识符
     * [hash] 和 [chunkhash] 的长度可以使用 [hash:16]（默认为20）来指定。
     * 注意：此选项不会影响那些[按需加载 chunk] 的输出文件。对于这些文件，需使用 output.chunkFilename 选项来控制输出。通过 loader 创建的文件也不受影响。在这种情况下，必须尝试 loader 特定的可用选项。
     */
    filename: "js/[name].[hash:4].bundle.js",
    /**
     * path - 目标输出目录
     */
    // path: "/dist",
    path: path.resolve(__dirname, "dist"),
    /**
     * chunkFilename - 决定了非入口(non-entry) chunk 文件的名称。
     * 默认使用 [id].js 或从 output.filename 中推断出的值([name] 会被预先替换为 [id] 或 [id])
     */
    chunkFilename: "js/[name].[hash:4].chunk.js",
    /**
     * publicPath - 指定在浏览器中所引用的 url
     * webpack-dev-server 也会默认从 publicPath 为基准，使用它来决定在哪个目录下启用服务，来访问 webpack 输出的文件。
     */
    publicPath: "./",
    /**
     * sourceMapFilename - 只在 devtool 启用了 SourceMap 选项时才使用。配置 source map 的命名方式。默认为 [file.mp]
     * 可以使用 filename 选项中的 [name] [id] [hash] 等替换符号。
     * 建议只使用 [file] 占位符，因为其他占位符在非 chunk 文件(non-chunk files)生成的 SourceMap 时不起作用。
     */
    sourceMapFilename: "[file].map"
  },
  /**
   * 模块 - 决定了如何处理项目中的不同类型的模块
   */
  module: {
    /**
     * rules - 匹配请求的规则数组，这些规则能够修改模块的创建方式。这些规则能够对模块(module)应用 loader，或者修改解析器(parser)。
     * rule：每个规则可以分为三部分 - 条件(condition), 结果(result)和嵌套规则（nested rule）\
     *
     * Rule 条件：条件有两种输入值 - 当使用多个条件时，所有条件都匹配。
     *  - resource：请求文件的绝对路径。它已经根据 resolve 规则解析。 => 属性 test, include, exclude 和 resource 对 resource 匹配
     *  - issuer：被请求资源的模块文件的绝对路径。 => 属性 issuer 对 issuer 匹配
     *  - 从 app.js 导入 './style.css'，resource 是 /path/to/style.css. issuer 是 /path/to/app.js。
     *
     * Rule 结果：规则有两种输入值 - 规则结果只在规则条件匹配时使用。
     *  - 应用的 loader：应用在 resource 上的 loader 数组
     *  - Parser 选项：用于为模块创建解析器的选项对象
     *
     * 嵌套的 Rule：可以使用属性 rules 和 oneOf 指定嵌套规则
     */
    rules: [
      // 每项对应一个模块的解析
      {
        /**
         * 条件可以是这些之一：
         *  - 字符串：匹配输入必须以提供的字符串开始
         *  - 正则表达式：test 输入值
         *  - 函数：调用输入的函数，必须返回一个真值以匹配
         *  - 条件数组：至少一个匹配条件
         *  - 对象：匹配所有属性。每个属性都有一个定义行为。
         */
        test: /\.(png|svg|jpg|gif)$/, // 匹配特定条件。一般是提供一个正则表达式或正则表达式的数组，但这不是强制的。
        // include: /\.(png|svg|jpg|gif)$/, // 匹配特定条件。(与 test 一致)一般是提供一个字符串或者字符串数组，但这不是强制的。
        // exclude: /exclude\.(png|svg|jpg|gif)$/, // 排除特定条件。一般是提供一个字符串或字符串数组，但这不是强制的。
        // and: [Condition]：必须匹配数组中的所有条件
        // or: [Condition]：匹配数组中任何一个条件
        // not: [Condition]：必须排除这个条件

        /**
         * resource - 上面选项配置就是 resource 的简写
         */
        // resource:{
        //   test:/\.css$/,
        //   include: path.resolve(__dirname, 'src/css'),
        //   exclude: path.resolve(__dirname, 'node_modules'),
        // },

        use: [
          {
            loader: "file-loader",
            options: {
              // 为你的文件配置自定义文件名模板
              name: "[name].[hash:8].[ext]",
              // 配置输出目录
              outputPath: "images/",
              // 配置自定义 public 发布目录 -- 默认值为 publicPath 选项
              publicPath: "./"
            }
          }
        ]
      },
      // scss 处理
      {
        test: /\.scss$/,
        exclude: /node_modules/, //排除node_modules文件夹
        use: [
          // 当 loader 为多个时，优先级是后定义的先执行
          // 每个loader 只负责自己需要负责的事情：将输入信息进行处理，并输出为下一个 loader 可识别的格式。
          {
            loader: MiniCssExtractPlugin.loader //建议生产环境采用此方式解耦CSS文件与js文件
          },
          {
            loader: "css-loader", // CSS加载器
            options: { importLoaders: 2 } // 指定css-loader处理前最多可以经过的loader个数
          },
          {
            loader: "postcss-loader" //承载autoprefixer功能
          },
          {
            loader: "sass-loader" //SCSS加载器，webpack默认使用node-sass进行编译
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Output Management"
    }),
    // 为抽取出的独立的CSS文件设置配置参数, css 分离也会随着 chunk 分离而分离
    new MiniCssExtractPlugin({
      filename: "css/[name].css"
    })
  ],
  optimization: {
    //对生成的CSS文件进行代码压缩 mode='production'时生效
    minimizer: [new OptimizeCssAssetsPlugin()]
  }
};
