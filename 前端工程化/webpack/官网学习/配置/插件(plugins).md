# 插件[plugins]

plugins 选项用于以各种方式自定义 webpack 构建过程。**webpack 附带了各种内置插件，可以通过 webpack.[plugin-name] 访问这些插件。**

```javascript
plugins: [
    // ...
],
```



## plugins

`[Plugin]`

一组 webpack 插件。例如，DefinePlugin 允许创建可在编译时配置的全局常量。这对需要再开发环境构建和生产环境构建之间产生不同行为来说非常有用。

```javascript
module.exports = {
    // ...
    plugins: [
        new webpack.DefinePlugin({
            // Definitions...
        })
    ]
}
```

使用多个插件：

```javascript
var webpack = require('webpack');
// 导入非 webpack 自带默认插件
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');

// 在配置中添加插件
module.exports = {
    //...
    plugins: [
        new ExtractTextPlugin({
            filename: 'build.min.css',
            allChunks: true,
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    	// 编译时(compile time)插件
    	new webpack.DefinePlugin({
      		'process.env.NODE_ENV': '"production"',
    	}),
    	// webpack-dev-server 强化插件
    	new DashboardPlugin(),
    	new webpack.HotModuleReplacementPlugin(),
    ]
}
```

