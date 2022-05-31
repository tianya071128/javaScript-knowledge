/*
 * @Descripttion: 处理文件上传的
 * @Author: 温祖彪
 * @Date: 2021-09-11 22:11:28
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-14 09:47:26
 */
const formidable = require('formidable');

const { tempFilePath } = require('../../config');

// 返回一个中间件
module.exports = () => {
  return async function (ctx, next) {
    const form = formidable({
      keepExtensions: true, // 是否保留原始文件的扩展名
      multiples: true, // 多文件上传， 如果 formData 中 key 对应的文件为多个文件时，生效
      uploadDir: `${tempFilePath}`, // 放置文件上传的目录 - 不传则存在默认值
    });

    await new Promise((reslove, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          // 如果需要进行上传文件的筛选， 可以在这里实现，如果在这里筛选不合格，则删除这个文件即可
          ctx.request.body = fields; // 其他额外字段
          ctx.request.files = files; // 上传文件的信息
          reslove();
        }
      });
    });

    await next();
  };
};
