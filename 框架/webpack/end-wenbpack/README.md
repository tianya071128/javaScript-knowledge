## 常用插件总结

| 插件                                   | 描述                         |
| -------------------------------------- | ---------------------------- |
| **html-webpack-plugin**                | 用于生成 html 模板           |
| **mini-css-extract-plugin**            | 提取 css 文件，webpack4 插件 |
| **clean-webpack-plugin**               | 清空打包文件夹               |
| **webpack-merge**                      | 合并 webpack 选项            |
| **optimize-css-assets-webpack-plugin** | 压缩 CSS                     |

> 1. extract-text-webpack-plugin: 提取 css 文件。webpack4 之前所用，在 webpack4 逐渐弃用



## 常用 loader 总结

| loader              | 描述                                                    |
| ------------------- | ------------------------------------------------------- |
| style-loader        | 将 css 以 style 标签嵌入至 link                         |
| css-loader          | 解析 css 模块                                           |
| less-loader         | 解析 less 模块                                          |
| sass-loader         | 解析 sass 模块                                          |
| postcss-loader      | 使用 postcss 插件，例如使用 autoprefixer 添加 CSS3 前缀 |
| url-loader          | 解析资源                                                |
| html-withimg-loader | 在 html 中引用图片                                      |
| babel-loader        | 转义 ES6                                                |



## 1. 多入口文件

多入口文件有两种模式：

* 一种是没有关系的但是要打包到一起去的，可以写一个数组，实现多个文件打包
* 另一种就是每一个文件都单独打包成一个文件的

```javascript
let path = require('path');

module.exports = {
    // 1.写成数组的方式就可以打出多入口文件，不过这里打包后的文件都合成了一个
    // entry: ['./src/index.js', './src/login.js'],
    // 2.真正实现多入口和多出口需要写成对象的方式
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        // 1. filename: 'bundle.js',
        // 2. [name]就可以将出口文件名和入口文件名一一对应
        filename: '[name].js',      // 打包后会生成index.js和login.js文件
        path: path.resolve('dist')
    }
}
```



## 2. 指纹策略

| **模板**      | **描述**                                                     |
| ------------- | ------------------------------------------------------------ |
| [name]        | 模块名称                                                     |
| [id]          | 模块标识符(module identifier)                                |
| [hash]        | `hash` 和每次 `build`有关，没有任何改变的情况下，每次编译出来的 `hash`都是一样的，但当你改变了任何一点东西，它的`hash`就会发生改变。 |
| [chunkhash]   | `chunkhash`是根据具体每一个模块文件自己的的内容包括它的依赖计算所得的`hash`，所以某个文件的改动只会影响它本身的`hash`，不会影响其它文件。 |
| [contenthash] | 它的出现主要是为了解决，让`css`文件不受`js`文件的影响。<br /><br />这个时候我们就可以使用`contenthash`了，保证即使`css`文件所处的模块里有任何内容的改变，只要 css 文件内容不变，那么它的`hash`就不会发生变化。 |



## 3. optimization 优化项

### 3.1 splitChunks  - Code Splitting

示例：

```javascript
splitChunks: {
      chunks: "all", // 分割代码的模式 all(同步异步都分割模式) | initial(只分割同步引入的模块) | async(只分割出异步引入的模块)
      cacheGroups: {
        // 分组
        libs: {
          name: "chunk-libs", // 打包 chunk 的名称
          test: /[\\/]node_modules[\\/]/, // 匹配规则
          priority: 10, // 优先级
          chunks: "initial" // 只打包初始时依赖的第三方
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
```

