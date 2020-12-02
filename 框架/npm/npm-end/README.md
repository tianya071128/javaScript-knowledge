## 1. npm 常用命令

### 1.1 查找、安装、更新、卸载、发布操作模块

* 安装

  `npm install(i,add) <name>@<version> [-g|-global]/[-D|--save-dev|-S|--save]`

  > -g  | -global: 安装全局包
  >
  > -D | --save-dev：安装 devDependencies 开发依赖包
  >
  > -S | --save: 安装 dependencies 生产依赖包

* 更新

  `npm update(up, upgrade) <name>@<version> [-g|-global]/[-D|--save-dev|-S|--save]`

* 卸载

  `npm uninstall(r,un,rm,unlink,remove) <name>@<version>[-g|-global]/[-D|--save-dev|-S|--save]`

**注意点：**

* **cnpm 安装包不会生成 `package-lock.json` - 2020/11/30**

* **cnpm 安装一个包会生成两个包，一个 _<pageName\>， 另一个就是 <pageName\> , 内容没有区别**

* **npm 安装包是会生成 `package-lock.json`**




## 2. package.json 文件详解



## 3. npm 中的依赖包

### 3.1 依赖包分类

* dependencies - 业务依赖：其中的依赖项应该属于线上代码的一部分

* devDependencies - 开发依赖：只在项目开发时所需要

* peerDependencies - 同伴依赖：提示宿主环境去安装插件在`peerDependencies`中所指定依赖的包

  ```js
  // 例如 element-ui@2.6.3 中的 package.json 中
  "peerDependencies": {
      "vue": "^2.5.16" // 提示需要安装 vue 依赖，但不会在 npm install 时下载
  }
  ```

* bundledDependencies / bundleDependencies - 打包依赖： 跟`npm pack`打包命令有关

* optionalDependencies - 可选依赖： 这种依赖中的依赖项即使安装失败了，也不影响整个安装的过程。

### 3.2 依赖包版本号

采用了 `semver` 规范作为依赖版本管理方案，格式为：`主版本号.次版本号.修订号(x.y.z)`

* 主版本号（也称为大版本）：大版本的改动很可能是一次颠覆性的改动

* 次版本号（也称为小版本）：小版本的改动应当兼容同一个大版本内的`API`和用法，因此应该让开发者无感。

  > **如果大版本号是 0 的话，表示软件处于开发初始阶段，一切都可能随时被改变，可能每个小版本之间也会存在不兼容性。所以在选择依赖时，尽量避开大版本号是 0 的包。**

* 修订号（也称为补丁）：一般用于修复 bug 或者很细微的变更，也需要保持向前兼容

常见的几个版本格式如下：

* **"1.2.3"**

  表示精确版本号。任何其他版本号都不匹配。在一些比较重要的线上项目中，建议使用这种方式锁定版本。

* **"^1.2.3"**

  表示兼容补丁和小版本更新的版本号。官方的定义是“能够兼容除了最左侧的非 0 版本号之外的其他变化”(Allows changes that do not modify the left-most non-zero digit in the [major, minor, patch] tuple)。

  ```javascript
  "^1.2.3" 等价于 ">= 1.2.3 < 2.0.0"。即只要最左侧的 "1" 不变，其他都可以改变。所以 "1.2.4", "1.3.0" 都可以兼容。
  
  "^0.2.3" 等价于 ">= 0.2.3 < 0.3.0"。因为最左侧的是 "0"，那么只要第二位 "2" 不变，其他的都兼容，比如 "0.2.4" 和 "0.2.99"。
  
  "^0.0.3" 等价于 ">= 0.0.3 < 0.0.4"。大版本号和小版本号都为 "0" ，所以也就等价于精确的 "0.0.3"。
  ```

* **"~1.2.3"**

  表示只兼容补丁更新的版本号。关于 `~` 的定义分为两部分：如果列出了小版本号（第二位），则只兼容补丁（第三位）的修改；如果没有列出小版本号，则兼容第二和第三位的修改。我们分两种情况理解一下这个定义：

  ```
  "~1.2.3" 列出了小版本号 "2"，因此只兼容第三位的修改，等价于 ">= 1.2.3 < 1.3.0"。
  
  "~1.2" 也列出了小版本号 "2"，因此和上面一样兼容第三位的修改，等价于 ">= 1.2.0 < 1.3.0"。
  
  "~1" 没有列出小版本号，可以兼容第二第三位的修改，因此等价于 ">= 1.0.0 < 2.0.0"
  复制代码
  ```

  从这几个例子可以看出，`~` 是一个比`^`更加谨慎安全的写法，而且`~`并不对大版本号 0 或者 1 区别对待，所以 "~0.2.3" 与 "~1.2.3" 是相同的算法。当首位是 0 并且列出了第二位的时候，两者是等价的，例如 "~0.2.3" 和 "^0.2.3"。

> 详细的文档可以参见[语义化版本(semver)](https://semver.org/lang/zh-CN/)。



## 4. npm scripts 脚本

定义在 scripts 字段中，用阿里自定义脚本命令

> `npm run` 是 `npm run-script` 的缩写，一般都使用前者，但是后者可以更好的反应这个命令的本质

* 多命令执行 - 串行执行 - `&&`

  > 前一个任务执行成功后才能执行下一个任务，**只要有一个命令执行失败，则整个脚本终止**
  >
  > `npm run script1 && npm run run script2`

* 多命令执行 - 并行执行 - `&`

  > 多个命令同时的平行执行
  >
  > `npm run script1 && npm run script2`

* & 和 && 是 `Bash` 的内置功能。此外，还可以使用第三方的任务管理器模块：[script-runner](https://github.com/paulpflug/script-runner)、[npm-run-all](https://github.com/mysticatea/npm-run-all)、[redrun](https://github.com/mysticatea/npm-run-all)。

* env 环境变量

  在执行 `npm run` 脚本时，`npm`会设置一些特殊的 `env` 环境变量（**可通过 `process.env` 访问**）。

  **其中 `package.json` 中的所有字段，都会被设置为 `npm_package_` 开头的环境变量**

  ```javascript
  {
    "name": "sh",
    "version": "1.1.1",
    "description": "shenhao",
    "main": "index.js",
    "repository": {
      "type": "git",
      "url": "git+ssh://git@gitlab.com/xxxx/sh.git"
    }
  }
  ```

  可以通过`process.env.npm_package_name` 可以获取到`package.json`中`name`字段的值`sh`，也可以通过`process.env.npm_package_repository_type`获取到嵌套属性`type`的值`git`。

  同时，`npm`相关的所有配置也会被设置为以`npm_config_`开头的环境变量。

* 指令钩子

  在执行`npm scripts`命令（无论是自定义还是内置）时，都经历了`pre`和`post`两个钩子，在这两个钩子中可以定义某个命令执行前后的命令。

  比如在执行`npm run serve`命令时，会依次执行`npm run preserve`、`npm run serve`、`npm run postserve`，所以可以在这两个钩子中自定义一些动作：

  ```
  "scripts": {
    "preserve": "xxxxx",
    "serve": "vue-cli-service serve",
    "postserve": "xxxxxx"
  }
  复制代码
  ```

  当然，如果没有指定`preserve`、`postserve`，会默默的跳过。如果想要指定钩子，必须严格按照`pre`和`post`前缀来添加。

  上面提到过一个环境变量`process.env.npm_lifecycle_event`可以配合钩子来一起使用：

  ```
  const event = process.env.npm_lifecycle_event
  
  if (event === 'preserve') {
      console.log('Running the preserve task!')
  } else if (_event === 'serve') {
      console.log('Running the serve task!')
  }
  ```



## 5. package-lock.json 

npm5+ 新增功能，`package-lock.json` 文件和 `node_module` 目录结果是一致的，即项目目录下存在`package-lock.json` 可以让每次安装生成的依赖目录结构保持相同。

* 在开发应用项目时，应该使用 `package-lock.json` 提交至版本仓库中，从而使团队成员安装的依赖版本一致
* 在开发库时，一般不使用 `package-lock.json` 锁死版本，**是因为库项目一般是被其他项目依赖的，在不写死的情况下，就可以复用主项目已经加载过的包，而一旦库依赖的是精确的版本号那么可能会造成包的冗余。**

```javascript
"dependencies": {
  "sass-loader": {
    "version": "7.1.0", // 包唯一的版本号
    "resolved": "http://registry.npm.taobao.org/sass-loader/download/sass-loader-7.1.0.tgz", // 安装源
    "integrity": "sha1-Fv1ROMuLQkv4p1lSihly1yqtBp0=", // 表明包完整性的 hash 值（验证包是否已失效）
    "dev": true, // 如果为 true，则此依赖关系仅是顶级模块的开发依赖关系或者是一个传递依赖关系
    "requires": { // 依赖包所需要的所有依赖项，对应依赖包package.json里dependencies中的依赖项
      "clone-deep": "^2.0.1",
      "loader-utils": "^1.0.1",
      "lodash.tail": "^4.1.1",
      "neo-async": "^2.5.0",
      "pify": "^3.0.0",
      "semver": "^5.5.0"
    },
    "dependencies": { // sass-loader 依赖包 node_modules 中依赖的包
      "pify": {
        "version": "3.0.0",
        "resolved": "http://registry.npm.taobao.org/pify/download/pify-3.0.0.tgz",
        "integrity": "sha1-5aSs0sEB/fPZpNB/DbxNtJ3SgXY=",
        "dev": true
      }
    }
  }
}
```