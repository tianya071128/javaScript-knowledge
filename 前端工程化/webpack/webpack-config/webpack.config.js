const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //将CSS代码提取为独立文件的插件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //CSS模块资源优化插件

module.exports = {
  // mode: "production",
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
        // include: path.resolve('src'), // 匹配特定条件。(与 test 基本一致)一般是提供一个字符串或者字符串数组，但这不是强制的。
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
              outputPath: "images/"
              // 配置自定义 public 发布目录
              // publicPath: "./"
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
            options: {
              importLoaders: 2
              // sourceMap: true // 启用/禁用 Sourcemap
            } // 指定css-loader处理前最多可以经过的loader个数
          },
          {
            loader: "postcss-loader" // 承载autoprefixer功能
          },
          {
            loader: "sass-loader" // SCSS加载器，webpack默认使用node-sass进行编译
          }
        ]
      }
    ]
  },
  /**
   * 插件 - 用于以各种方式自定义 webpack 构建过程。
   * webpack 附带了各种内置插件，以及其他插件
   */
  plugins: [
    new HtmlWebpackPlugin({
      title: "Output Management",
      template: path.resolve(__dirname, "public/index.html")
    }),
    // 为抽取出的独立的CSS文件设置配置参数, css 分离也会随着 chunk 分离而分离
    new MiniCssExtractPlugin({
      filename: "css/[name].css"
    })
  ],
  /**
   * 解析 - 设置模块如何被解析
   * 例如：import 'lodash' 时，能够对 webpack 查找 lodash 的方式进行配置
   */
  resolve: {
    /**
     * alias - 创建别名，即路径的的别名，确保模块引入变得更简单
     */
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      image: path.resolve(__dirname, "./src/assets/image/")
    },
    /**
     * extensions - 自动解析确定的扩展名, 能够使用户在引入模块时不带扩展
     * 默认值为：[".js", ".json"]
     */
    extensions: [".js", ".json", ".scss"],
    /**
     * mainFiles - 解析目录时要使用的文件名
     * 默认值为：['index']
     */
    mainFiles: ["index"],
    /**
     * mainFields - 当从 npm 包中导入模块时（例如，import * as D3 from "d3"），此选项将决定在 package.json 中使用哪个字段导入模块。
     * 默认值：根据 webpack 配置中指定的 target 不同，默认值也会有所不同
     */
    mainFields: ["browser", "module", "main"],
    /**
     * modules - 告诉 webpack 解析模块时应该搜索的目录，优先级从左到右
     * 默认值为：["node_modules"]
     */
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  /**
   * 详见文档
   */
  devtool: "source-map",
  /**
   * 开发环境 - 使用 webpack-dev-server
   */
  devServer: {
    /**
     * hot - 启用 webpack 的模块热替换特性：
     */
    hot: true,
    /**
     * hotOnly - 启用热模块替换，而不会在构建失败时将页面刷新作为后备
     */
    hotOnly: true,
    /**
     * https - 选择带有 HTTPS 的 HTTP/2 提供服务。默认使用 webpack 提供的签名证书，也可使用自己的签名证书
     */
    https: false,
    /**
     * port - 指定要监听的端口号
     */
    port: 3000,
    /**
     * publicPath - 类似于 output.pulicPath, 此路径下的打包文件可在浏览器中访问
     */
    publicPath: "/",
    /**
     * proxy - 本地代理
     */
    proxy: {},
    /**
     * quiet - 启用后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见
     */
    quiet: true,
    compress: true,

    index: "index.html" // 视为索引文件的文件名。
    // host: "0.0.0.0", // 指定使用一个 host，默认是 localhost。如果希望服务器外部可访问，可指定如下：0.0.0.0
    // lazy: false, // 惰性模式 - 启用时，dev-server 只有在请求时才编译包。这意味着 webpack 不会监视任何文件改动。
    // filename: "bundle.js", //filename - 在不使用惰性加载时没有效果。在惰性模式中，此选项可减少编译。 默认在惰性模式，每个请求结果都会产生全新的编译。使用 filename，可以只在某个文件被请求时编译。
    /**
     * DevServer服务器通过HTTP服务暴露出的文件分为两类：
     * 1. 暴露本地文件
     * 2. 暴露webpack构建出的结果，由于构建出的结果交给DevServer，所以你在使用DevServer时在本地找不到构建出的文件。
     */
    // contentBase: path.join(__dirname, "dist"),　－　告诉服务器从哪里提供内容，只有在想要提供静态文件时才需要
    // open: true // 启用服务后，自动打开浏览器
    // openPage: "different/page" // 启用服务后，指定打开浏览器时要浏览的页面。
  },
  /**
   * 外部扩展 - 提供了[从输出的 bundle 中排除依赖]的方法。
   * 此功能通常对 library 开发人员来说是最有用的，然而也会有各种各样的应用程序用到它。
   * 防止将某些 import　的包打包到 bundle 中，而是在运行时再去从外部获取这些扩展依赖
   */
  externals: {
    // 这样，jquery 库是不会被打包进 bundle 的
    jquery: "$"
  }
  // optimization: {
  //   //对生成的CSS文件进行代码压缩 mode='production'时生效
  //   minimizer: [new OptimizeCssAssetsPlugin()]
  // }
};
