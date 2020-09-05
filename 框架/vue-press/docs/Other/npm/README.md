# NPM日常命令总结

npm 是随同NodeJS一起安装的包管理工具，目前已经超过600000包（代码模块），世界各地的程序员可以在这个社区中分享自己编写的模块包。

## 创建一个项目

```bash
npm init
```

提示你将会创建一个`package.json`, 然后需要你输入项目名称、版本号、作者等信息，你可以回车填入默认值。或者使用命令`npm init -y` 创建一个默认的`package.json`文件。

## npm查看源切换源

`npm config get registry` 查看当前npm源

默认的源是国外的 `http://registry.npmjs.org` 下载速度很慢（原因大家都懂得），这时候我们一般会切换到国内的淘宝镜像。

### 使用淘宝镜像

```bash
npm config set registry https://registry.npm.taobao.org
```

有人喜欢使用cnpm：`npm install -g cnpm --registry=https://registry.npm.taobao.org`

## 获取安装包信息

```bash
npm view xxx` 或者 `npm v xxx
```



## 安装项目依赖库

### 项目依赖模块

我们从开源社区、公司代码仓库克隆下来的项目是没有`node_modules`文件夹的，但是会会告诉我们项目中使用的第三方依赖库`package.json`。

`npm install` 或者简写 `npm i` 安装项目中使用的依赖模块。

### 按需安装依赖模块

#### 开发环境添加依赖模块

```
npm install xxx --save-dev
```

或者简写

`npm i xxx -D`

安装成功后，就会在`package.json`中注册：

```json
  "devDependencies": {
    "xxx": "^4.0.2"
  }
```

#### 生产环境添加依赖模块

```bash
npm install xxx --save-prod
```

或者简写

 `npm i gulp -p`

安装成功后，就会在`package.json`中注册：

```json
  "dependencies": {
    "xxx": "^4.17.1"
  },
```

#### 全局安装

```bash
npm install -g xxx
```

#### 安装模块指定版本

```bash
npm install -g typescript@3.8.3
```

## 卸载模块

- `npm uninstall xxx`
- `npm rm xxx`

以上命令均可删除`node_modules`文件中安装的模块，同时会删除在`package.json`中的注册声明。

特殊情况下，你只想删除`node_modules`文件中安装的模块，但保留在`package.json`中的注册声明，那你可以这样干：

```bash
npm rm xxx --no-save
```

## 查看项目依赖

```bash
npm ls
```

会把项目的依赖模块列举出来，并且各个模块之间的依赖关系也会显示出来。

如果你只想看本项目的依赖模块：

```bash
npm ls --depth=0
```