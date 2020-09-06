## 1. 抽离 CSS 文件

使用 mini-css-extract-plugin 插件实现

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    rules: [
        {
        	test: /\.css$/,
            // loader 顺序：从右到左
            // 当 css-loader 处理好后，就将处理结果交给 MiniCssExtractPlugin.loader
        	use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      	}
    ],
    plugins: [
        // 在这里，将抽离的 css 的打包至 css 文件
        new MiniCssExtractPlugin({
      		filename: "css/[name].[hash:8].css"
    	})
    ]
}
```



## 2. 压缩 css

借助 optimize-css-assets-webpack-plugin 插件

```javascript
// webpack
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    mode: 'production',
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
}
```

