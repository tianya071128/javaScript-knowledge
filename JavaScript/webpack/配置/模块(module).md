# 模块[module]

这些选项决定了如何处理项目中的不同类型的模块

```javascript
 module: {
    // 关于模块配置
    rules: [
      // 模块规则（配置 loader、解析器等选项）
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/demo-files")
        ],
        // 这里是匹配条件，每个选项都接收一个正则表达式或字符串
        // test 和 include 具有相同的作用，都是必须匹配选项
        // exclude 是必不匹配选项（优先于 test 和 include）
        // 最佳实践：
        // - 只在 test 和 文件名匹配 中使用正则表达式
        // - 在 include 和 exclude 中使用绝对路径数组
        // - 尽量避免 exclude，更倾向于使用 include
        issuer: { test, include, exclude },
        // issuer 条件（导入源）
        enforce: "pre",
        enforce: "post",
        // 标识应用这些规则，即使规则覆盖（高级选项）
        loader: "babel-loader",
        // 应该应用的 loader，它相对上下文解析
        // 为了更清晰，`-loader` 后缀在 webpack 2 中不再是可选的
        // 查看 webpack 1 升级指南。
        options: {
          presets: ["es2015"]
        },
        // loader 的可选项
      },
      {
        test: /\.html$/,
        use: [
          // 应用多个 loader 和选项
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              /* ... */
            }
          }
        ]
      },
      { oneOf: [ /* rules */ ] },
      // 只使用这些嵌套规则之一
      { rules: [ /* rules */ ] },
      // 使用所有这些嵌套规则（合并可用条件）
      { resource: { and: [ /* 条件 */ ] } },
      // 仅当所有条件都匹配时才匹配
      { resource: { or: [ /* 条件 */ ] } },
      { resource: [ /* 条件 */ ] },
      // 任意条件匹配时匹配（默认为数组）
      { resource: { not: /* 条件 */ } }
      // 条件不匹配时匹配
    ],
    /* 高级模块配置（点击展示） */
    noParse: [
      /special-library\.js$/
    ],
    // 不解析这里的模块
    unknownContextRequest: ".",
    unknownContextRecursive: true,
    unknownContextRegExp: /^\.\/.*$/,
    unknownContextCritical: true,
    exprContextRequest: ".",
    exprContextRegExp: /^\.\/.*$/,
    exprContextRecursive: true,
    exprContextCritical: true,
    wrappedContextRegExp: /.*/,
    wrappedContextRecursive: true,
    wrappedContextCritical: false,
    // specifies default behavior for dynamic requests
  },
```





## module.noParse

`RegExp` `[RegExp]` `function(resource)` `string` `[string]`

防止 webpack 解析那些任何与给定正则表达式相匹配的文件。**忽略的文件中不应该含有 import require define 的调用，或任何其他导入机制。忽略大型的 library 可以提高构建性能。**

```javascript
module.exports = {
    module: {
        noParse: /jquery|lodash/,
        noParse: (content) => /jquery|lodash/.test(content)
    }
}
```



## module.rules

`[Rule]`

**创建模块时，匹配请求的规则数组。这些规则能够修改模块的创建方式。这些规则能够对模块(module)应用loader，或者修改解析器(parser)。**

### Rule

`object`

**每个规则可以分为三部分：条件(condition)、结果(result)和嵌套规则(nested rule)。**

* Rule 条件

  条件有两种输入值：

  1. resource: 请求文件的绝对路径。它已经根据 resolve 规则解析。
  2. issuer: 被请求资源（requested the resource）的模块文件的绝对路径。是导入时的位置。

  > **例如：**从 app.js 导入 ‘./style.css'，resource 是 /path/to/style.css。issuer 是 /path/to/app.js.

  在规则中，属性 [`test`](https://webpack.docschina.org/configuration/module#rule-test), [`include`](https://webpack.docschina.org/configuration/module#rule-include), [`exclude`](https://webpack.docschina.org/configuration/module#rule-exclude) 和 [`resource`](https://webpack.docschina.org/configuration/module#rule-resource) 对 resource 匹配，并且属性 [`issuer`](https://webpack.docschina.org/configuration/module#rule-issuer) 对 issuer 匹配。

* Rule 结果

  规则结果只在规则条件匹配时使用。

  规则有两种输入值：

  1. 应用的 loader：应用在resource 上的 loader 数组。
  2. Parser选项：用于为模块创建解析器的选项对象。

  这些属性会影响 loader：[`loader`](https://webpack.docschina.org/configuration/module#rule-loader), [`options`](https://webpack.docschina.org/configuration/module#rule-options-rule-query), [`use`](https://webpack.docschina.org/configuration/module#rule-use)。

  也兼容这些属性：[`query`](https://webpack.docschina.org/configuration/module#rule-options-rule-query), [`loaders`](https://webpack.docschina.org/configuration/module#rule-loaders)。

  [`enforce`](https://webpack.docschina.org/configuration/module#rule-enforce) 属性会影响 loader 种类。不论是普通的，前置的，后置的 loader。

  [`parser`](https://webpack.docschina.org/configuration/module#rule-parser) 属性会影响 parser 选项。

* 嵌套的 Rule

  可以使用属性 rules 和 oneOf 指定嵌套规则。

  这些规则用于在规则条件（rule condition）匹配时进行取值。



#### Rule.enforce

`string： pre | post`

指定 loader 种类。没有值表示是普通 loader。

**还有一个额外的种类“行内 loader”，loader 被应用在 import/require 行内。**

所有一个接一个地进入的 loader，都有两个阶段：

1. **pitching** 阶段：loader 上的 pitch 方法，按照 `后置(post)、行内(normal)、普通(inline)、前置(pre)` 的顺序调用。更多详细信息，请查看 [越过 loader(pitching loader)](https://webpack.docschina.org/api/loaders/#pitching-loader)。
2. **normal**阶段：loader 上的 常规方法，按照 `前置(pre)、行内(normal)、普通(inline)、后置(post)` 的顺序调用。模块源码的转换，发生在这个阶段。

所有普通 loader 可以通过在请求中加上 `!` 前缀来忽略（覆盖）。

所有普通和前置 loader 可以通过在请求中加上 `-!` 前缀来忽略（覆盖）。

所有普通，后置和前置 loader 可以通过在请求中加上 `!!` 前缀来忽略（覆盖）。

不应该使用行内 loader 和 `!` 前缀，因为它们是非标准的。它们可在由 loader 生成的代码中使用。



#### Rule.exclude

`Rule.exclude` 是 `Rule.resource.exclude` 的简写。如果你提供了 `Rule.exclude` 选项，就不能再提供 `Rule.resource`。详细请查看 [`Rule.resource`](https://webpack.docschina.org/configuration/module#rule-resource) 和 [`Condition.exclude`](https://webpack.docschina.org/configuration/module#条件)。



#### Rule.include

`Rule.include` 是 `Rule.resource.include` 的简写。如果你提供了 `Rule.include` 选项，就不能再提供 `Rule.resource`。详细请查看 [`Rule.resource`](https://webpack.docschina.org/configuration/module#rule-resource) 和 [`Condition.include`](https://webpack.docschina.org/configuration/module#条件)。



#### Rule.issuer

一个条件，用来与被发布的 request 对应的模块项匹配。在以下示例中，a.js request 的 发布者(issuer) 是 index.js 文件的路径。

```javascript
// index.js
import A from './a.js';
```

这个选项可以用来将 loader 应用到一个特定模块或一组模块的依赖中。



#### Rule.loader

`Rule.loader` 是 `Rule.use: [ { loader } ]` 的简写。详细请查看 [`Rule.use`](https://webpack.docschina.org/configuration/module#rule-use) 和 [`UseEntry.loader`](https://webpack.docschina.org/configuration/module#useentry)。



#### Rule.oneOf

规则数组，当规则匹配时，只使用第一个匹配规则。

```javascript
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.css$/,
                oneOf: [
                    {
                        resourceQuery: /inline/, // foo.css?inline
                        use: 'url-loader'
                    },
                    {
                        resourceQuery: /external/, // foo.css?external
                        use: 'file-loader'
                    }
                ]
            }
        ]
    }
}
```



#### Rule.options/Rule.query

`Rule.options` 和 `Rule.query` 是 `Rule.use: [ { options } ]` 的简写。详细请查看 [`Rule.use`](https://webpack.docschina.org/configuration/module#rule-use) 和 [`UseEntry.options`](https://webpack.docschina.org/configuration/module#useentry)。

> 由于需要支持 `Rule.options` 和 `UseEntry.options`，`Rule.use`，`Rule.query` 已废弃。



#### Rule.parser

解析选项对象。所有应用的解析选项都将合并。

解析器(parser)可以查阅这些选项，并相应地禁用或重新配置。大多数默认插件，会如下解释值：

* 将选项设置为 false，将禁用解析器。
* 将选项设置为 true，或不修改将其保留为 undefined，可以启用解析器。

然而，一些解析器(parser)插件可能不光只接收一个布尔值。例如，内部的 `NodeStuffPlugin` 差距，可以接收一个对象，而不是 `true`，来为特定的规则添加额外的选项。

```javascript
module.exports = {
    // ...
    module: {
        rules: [
            {
                //...
                parser: {
                    amd: false, // 禁用 AMD
          			commonjs: false, // 禁用 CommonJS
         			system: false, // 禁用 SystemJS
          			harmony: false, // 禁用 ES2015 Harmony import/export
          			requireInclude: false, // 禁用 require.include
          			requireEnsure: false, // 禁用 require.ensure
          			requireContext: false, // 禁用 require.context
          			browserify: false, // 禁用特殊处理的 browserify bundle
          			requireJs: false, // 禁用 requirejs.*
          			node: false, // 禁用 __dirname, __filename, module, require.extensions, require.main 等。
          			node: {...} // 在模块级别(module level)上重新配置 node 层(layer)
 
                }
            }
        ]
    }
}
```



#### 条件

条件可以是这些之一：

- 字符串：匹配输入必须以提供的字符串开始。是的。目录绝对路径或文件绝对路径。
- 正则表达式：test 输入值。
- 函数：调用输入的函数，必须返回一个真值(truthy value)以匹配。
- 条件数组：至少一个匹配条件。
- 对象：匹配所有属性。每个属性都有一个定义行为。

`{ test: Condition }`：匹配特定条件。一般是提供一个正则表达式或正则表达式的数组，但这不是强制的。

`{ include: Condition }`：匹配特定条件。一般是提供一个字符串或者字符串数组，但这不是强制的。

`{ exclude: Condition }`：排除特定条件。一般是提供一个字符串或字符串数组，但这不是强制的。

`{ and: [Condition] }`：必须匹配数组中的所有条件

`{ or: [Condition] }`：匹配数组中任何一个条件

`{ not: [Condition] }`：必须排除这个条件