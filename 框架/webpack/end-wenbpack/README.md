## 常用插件总结

| 插件                                   | 描述                               |
| -------------------------------------- | ---------------------------------- |
| **html-webpack-plugin**                | 用于生成 html 模板                 |
| **mini-css-extract-plugin**            | 提取 css 文件，webpack4 插件       |
| **clean-webpack-plugin**               | 清空打包文件夹                     |
| **webpack-merge**                      | 合并 webpack 选项                  |
| **optimize-css-assets-webpack-plugin** | 压缩 CSS                           |
| **terser-webpack-plugin**              | 压缩 JS                            |
| **uglifyjs-webpack-plugin**            | 压缩 JS，已弃用                    |
| **webpack-bundle-analyzer**            | 打包分析                           |
| **webpack.DefinePlugin**               | webpack 内置插件，用于设置环境变量 |

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
| [contenthash] | 根据内容生成 hash                                            |



## 3. CSS 模块化

一般直接引用 css（或 less，sass）等，都是全局引入，这样会影响全局的

```javascript
import './less01.less';
```

而通过在 webpack.config.js 中的 css-loader 中开启 CSS 模块化，就可以将 CSS 的模块注册为局部 CSS 模块，让其 CSS 也具有模块功能

资料：https://www.webpackjs.com/loaders/css-loader/#modules



## 4. soure-map

soure-map: 单独生成 .map 文件，映射原始代码

inline: 以内联的形式嵌入打包后 js 文件（也就是也原本生成的 .map 文件以 base64 形式放在 js 文件中）- 更消耗性能

cheap: 仅定位至行，忽略列 - 减少性能消耗

eval: 将每个模块包装在一个`eval`函数中的代码

module: 包含`loader`的`sourcemap`

推荐：

开发环境：cheap-module-eval-source-map

线上环境：cheap-module-source-map



## 5. 模块热替换（HMR）

在新版 webpack 中，只需要在 devServer.hot 中配置即可开启 HMR

```javascript
module.exports = {
    devServer: {
    	hot: true, // 开启热更新
    	hotOnly: true // 当热更新失效时，不要去刷新页面
  	},
}
```

CSS 的热更新：

在 `style-loader` 已经内置了 CSS 的模块热替换

类似于 CSS， 在 Vue, React 框架中，也通过 loader 内置了 HMR 



## 6. optimization 优化项

### 6.1 splitChunks  - Code Splitting

1. **chunks：‘saync’ 的意思是，当通过 import() 分割出异步模块时，对这个异步模块中引入的模块也进行分割，而设置为 ‘initial’ 时，也就是说，对异步模块不进行进一步分割**

2. **chunks: 'initial' 就会对入口文件的模块进行分割，而通过 import() 分割的异步模块不进行进一步分割**

3. **cacheGroups选项是有默认分组的，对其定义也不会覆盖其默认分组**，可通过对其设为 false 取消`vendors: false`

   

示例：

```javascript
splitChunks: {
      chunks: "all", // 分割代码的模式 all(同步异步模块都分割模式) | initial(只分割同步的模块) | async(只分割出异步的模块)
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

### 6.2 提取引导模板 optimization.runtimeChunk

用于浏览器缓存 - **此时会将引导模板提取成一个单独 js 文件**

```javascript
optimization: {
   runtimeChunk: 'single',
},
```

[参考-缓存](https://webpack.docschina.org/guides/caching/#extracting-boilerplate)

### 6.3 改变模块标识符 optimization.moduleIds

用于浏览器缓存 - **默认情况下，每个 [`module.id`](https://webpack.docschina.org/api/module-variables/#moduleid-commonjs) 会默认地基于解析顺序(resolve order)进行增量。也就是说，当解析顺序发生变化，ID 也会随之改变。**

**配置 moduIds 就会改变模块标识符的算法**

```javascript
optimization: {
	moduleIds: 'hashed',
}
```

[参考-缓存](https://webpack.docschina.org/guides/caching/#module-identifiers)



## 7. MiniCssExtractPlugin 提取 css - **提取所有的 CSS 到一个文件中**

最好不用 - 先使用 MiniCssExtractPlugin 提取出 CSS，后利用 optimization.splitChunks  分组

https://webpack.docschina.org/plugins/mini-css-extract-plugin/#extracting-all-css-in-a-single-file

```javascript
optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true, // 忽略在 splitChunks 中定义的其他属性
        },
      },
    },
  },

```



