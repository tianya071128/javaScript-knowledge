# 开发中 server[devServer]

描述 webpack-dev-server 行为的选项。

```javascript
  devServer: {
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    // ...
  },
```

`object`

通过来自 webpack-dev-server 的这些选项，能够用多种方式改变其行为。

## devServer.host

`string`

指定使用一个 host。默认是 localhost。如果希望服务器外部可访问，指定如下：

```javascript
module.exports = {
    //...
    devServer: {
        host: '0.0.0.0'
    }
}
```



## devServer.hot

`boolean`

启用 webpack 的 模块热替换 功能：

```javascript
module.
```

