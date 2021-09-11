/*
 * @Descripttion: 处理文件上传的
 * @Author: 温祖彪
 * @Date: 2021-09-11 22:11:28
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-11 23:34:49
 */
const formidable = require('formidable');

const { tempFilePath } = require('../../config');

// 返回一个中间件
module.exports = () => {
  return async function (ctx, next) {
    const form = formidable({
      keepExtensions: true, // 是否保留原始文件的扩展名
      multiples: true, // 多文件上传， 如果 formData 中 key 对应的文件为多个文件时，生效
      uploadDir: `${tempFilePath}`, // 放置文件上传的目录
      filter: function ({ name, originalFilename, mimetype }) { // 过滤器, 如果上传文件不满足条件, 那么就报错
        // keep only images
        console.log(mimetype);
        return mimetype && mimetype.includes("image");
      }

    });

    // eslint-disable-next-line promise/param-names
    await new Promise((reslove, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) {
          // console.log(err);
          reject(err);
        } else {
          // console.log(fields, files);
          ctx.request.body = fields; // 其他额外字段
          ctx.request.files = files; // 上传文件的信息
          reslove();
        }
      });
      form.on('fileBegin', (name, file) => {
        console.log(name, file);
      });
    });

    await next();
  };
};

