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
module.exports = {
    //...
    devServer: {
        hot: true
    }
}
```

> *注意，必须有* [`webpack.HotModuleReplacementPlugin`](https://webpack.docschina.org/plugins/hot-module-replacement-plugin/) *才能完全启用 HMR。如果* `webpack` *或* `webpack-dev-server` *是通过* `--hot` *选项启动的，那么这个插件会被自动添加，所以你可能不需要把它添加到* `webpack.config.js` *中。关于更多信息，请查看* [HMR 概念](https://webpack.docschina.org/concepts/hot-module-replacement/) *页面。*



## devServer.hotOnly

`boolean`

启用热模块替换，而不会在构建失败时将页面刷新。(**也就是说，即使热模块替换失败，也不会将页面刷新[默认是会自动刷新页面的]**)

```javascript
module.exports = {
    //...
    devServer: {
        hotOnly: true
    }
}
```



## devServer.https

`boolean` `object`

默认情况下，dev-server 通过 HTTP 提供服务。也可以选择带有 HTTPS 的 HTTP/2 提供服务：

```javascript
module.exports = {
    //...
    devServer: {
        // 使用了自签名证书
        https: true
        // 提供自己的证书
        https: {
        	key: fs.readFileSync('/path/to/server.key'),
      		cert: fs.readFileSync('/path/to/server.crt'),
      		ca: fs.readFileSync('/path/to/ca.pem')
    	}
    }
}
```



## devServer.open

`boolean` `string`

告诉 dev-server 在服务器启动后打开浏览器

```javascript
module.exports = {
    //...
    devServer: {
        // 打开默认浏览器
        open: true，
        // 指定其他浏览器
        open: 'Google Chrome
    }
}
```



## devServer.openPage

`string`

指定打开浏览器时的导航页面

```javascript
module.exports = {
    //...
    devServer: {
        openPage: '/different/page'
    }
}
```



## devServer.port

`number`

指定要监听的端口号：

```javascript
module.exports = {
    //...
    devServer: {
        port: 8080
    }
}
```



## devServer.proxy

`object` `[object, function]`

如果有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求，那么代理某些 URL 会很有用。

**dev-server 使用了非常强大的 http-proxy-middleware 包。**

例如：在 localhost:3000 上有后端服务的话，可以这样启用代理：

[更多设置查看文档](https://webpack.docschina.org/configuration/dev-server/#devserver-proxy)

```javascript
module.exports = {
    //...
    devServer: {
        proxy: {     
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite: {
                    // 请求到 /api/users 现在会被代理到请求 http://localhost:3000/users
                    '^/api': '',
                    // 重写路径不仅可以重写 /api，还可以重写其他路径
                    // 请求 /api/users/header.json代理到 http://localhost:3000/users/demo.json
                    'header.json': 'demo.json'
                }
            }
        }
    }
}
```



## devServer.overlay

```
boolean` `object: { boolean errors, boolean warnings }
```

当出现编译器错误或警告时，在浏览器中显示全屏覆盖层。默认禁用。

```javascript
module.exports = {
  //...
  devServer: {
    overlay: true
  }
};
```

