# koa2

## koa-generator

koa 脚手架, 快速搭建 koa2 项目

### 1. 安装

```shell
npm install -g koa-generator
```

### 2.创建项目

```shell
koa2 projectName
```

### 3.安装包

```shell
npm install 

# 最好在安装 --update-binary
npm install --update-binary
```

### 4. 执行

`npm run dev`



## koa2 中间件

### 1. koa2 中间件

![koa2 中间件](../../image/01.png)

### 2. 自定义中间件

```javascript
function pv(ctx) {
  // ctx: 请求信息
  console.log("m1", ctx.path);
}

module.exports = function() {
  return async function(ctx, next) {
    // 先执行这一步, 对应上图 "洋葱模型" 的进入
    console.log("m1 start");
    pv(ctx);
    await next();
    // 响应完成后, 对应上图 "洋葱模型" 的进出
    console.log("m1 end");
  };
};

// 使用中间件
const m1 = require("./middleware/m1");
app.use(m1());
```

