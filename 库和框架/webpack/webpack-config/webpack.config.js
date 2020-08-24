const path = require("path");

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
     * 默认使用 [id].js 或从 output.filename 中腿短出的值([name] 会被预先替换为 [id] 或 [id])
     */
    chunkFilename: "js/[name].[hash:4].chunk.js"
  }
};
