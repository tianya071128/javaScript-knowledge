## vue-cli3 配置

### 功能

* 配置多环境变量
  
  * 只有以 VUE_APP 开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中，但是在配置文件中，还是可以访问到所有的 环境变量
  
* 添加别名 alias

* 配置 externals 引入 cdn 资源 => 感觉挺有用的

  > 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去外部获取这些扩展依赖
  
* 生产环境去掉 console.log 

  > 注意：**vue.config.js 若是有插件没有 install, 则会将 vue.config.js 默认无效**。碰到的情况，不知道原因！

* 开启 gizp 压缩 => good，压缩挺大的

  使用 `compression-webpack-plugin` `brotli-webpack-plugin` `@gfx/zopfli` 插件

  **压缩文件也需要后端配合才能使用**

* css相关：为 sass 提供全局样式，以及全局变量

  > 暂时没有配置

* 添加打包分析

### 参考资料

* [vue-cli3 配置项](https://github.com/staven630/vue-cli4-config/tree/vue-cli3)