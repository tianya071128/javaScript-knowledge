const koa = require("koa");
const app = new koa();

app.use(async ctx => {
  if (ctx.url === "/" && ctx.method === "GET") {
    // 显示表单页面
    const html = `
      <h1>POST</h1>
      <form method="POST" action="/">
        <p>userName</p>
        <input name="userName" /><br/>
        <p>age</p>
        <input name="age" /><br/>
        <button type="submit">submit</button>
      </form>
    `;
    ctx.body = html;
  } else if (ctx.url == "/" && ctx.method === "POST") {
    const postdata = await parsePostData(ctx);
    ctx.body = postdata;
  } else {
    ctx.body = "<h1>404!</h1>";
  }
});

// 解析 post 参数
function parsePostData(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = "";
      // ctx.req: node 原生 req 对象
      ctx.req.addListener("data", data => {
        postdata += data;
      });

      ctx.req.on("end", () => {
        resolve(postdata);
      });
    } catch (e) {
      reject(e);
    }
  });
}

app.listen(3000, () => {
  console.log("server runing...");
});
