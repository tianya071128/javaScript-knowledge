# 外部扩展[externals]

**防止**将某些 `import` 的包(package)**打包**到 bundle 中，而是在运行时(runtime)再去从外部获取这些*扩展依赖(external dependencies)*。

**也就是说，指定的模块不要打包进 bundle ，而是在全局环境中寻找相应的变量**

`string` `object` `function` `regex`

```javascript
  externals: ["react", /^@angular\//],
  externals: "react", // string（精确匹配）
  externals: /^[a-z\-]+($|\/)/, // 正则
  externals: { // 对象
    angular: "this angular", // this["angular"]
    react: { // UMD
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React"
    }
  },
  externals: (request) => { /* ... */ return "commonjs " + request }
  // 不要遵循/打包这些模块，而是在运行时从环境中请求他们
```

例如：从 CDN 引入 jQuery, 而不是把它打包：

**表示应该排除 import $ from 'jquery' 中的 jquery 模块。为了替换这个模块，jQuery 的值被用来检索一个全局的 jQuery 变量。换句话说，当设置为一个字符串时，它将被视为`全局的`（定义在上面和下面）。**

```html
// index.html 模板中手动引入 CDN
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous">
</script>
```

```javascript
// webpack.config.js
module.exports = {
  //...
  externals: {
    jquery: 'jQuery'
  }
};

// 使用文件
import $ from 'jquery';

$('.my-element').animate(/* ... */);
```



