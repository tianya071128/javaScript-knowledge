## 常用插件总结

| 插件                        | 描述                         |
| --------------------------- | ---------------------------- |
| **html-webpack-plugin**     | 用于生成 html 模板           |
| **mini-css-extract-plugin** | 提取 css 文件，webpack4 插件 |
| **clean-webpack-plugin**    | 清空打包文件夹               |
|                             |                              |
|                             |                              |

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

