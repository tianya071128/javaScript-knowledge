## 1. 常见的 plugins 

| 名称                     | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| CommonsChunkPlugin       | 将 chunks 相同的模块代码提取成公共 js                        |
| CleanWebpackPlugin       | 清理构建目录                                                 |
| ExtractTextWebpackPlugin | 将 CSS 从 bunlde 文件里提取成一个独立的 CSS 文件             |
| CopyWebpackPlugin        | 将文件或者文件夹拷贝到构建的输出目录                         |
| HtmlWebpackPlugin        | 创建 html 文件去承载输出的 bundle                            |
| UglifyjsWebpackPlugin    | 压缩 JS                                                      |
| ZipWebpackPlugin         | 将打包的资源生成一个 zip 包                                  |
| mini-css-extract-plugin  | 将 CSS 从 bunlde 文件里提取成一个独立的 CSS 文件<br />取代 ExtractTextWebpackPlugin |



## 2. 文件监听的原理分析

轮询判断文件的最后编辑时间是否变化

某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 aggregateTimeout

```javascript
module.exports = {
    // 默认 false，也就是不开启
    watch: true,
    // 只有开启监听模式时，watchOptions 才有意义
    watchOptions: {
        // 默认为空，不坚挺的文件或者文件夹，支持正则匹配
        ignored: /node_modules/,
        ...
    }
}
```



## 3. 代码压缩

* JS 压缩

  内置了  uglifyjs-webpack-plugin

* CSS 压缩

  使用 optimize-css-assets-webpack-plugin

* html 压缩

  html-webpack-plugin 设置压缩参数