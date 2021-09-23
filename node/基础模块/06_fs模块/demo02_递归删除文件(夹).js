/*
 * @Descripttion: 递归删除文件或文件夹
 * @Author: 温祖彪
 * @Date: 2021-09-23 10:24:12
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-23 10:30:49
 */
const { readdir, rmdir, stat, unlink } = require('fs').promises;
const path = require('path');

// 判断路径为文件或文件夹
async function hasFile(path) {
  try {
    const stats = await stat(path); // 获取 path 类型
    return stats.isFile(); // 返回是否为文件
  } catch (e) {
    console.log(`判断 ${path} 类型失败`);
    throw e; // 错误传递下去, 不要执行下面的语句了
  }
}

// 删除文件或文件夹
async function deleteFile(pathStr) {
  const type = await hasFile(pathStr);
  if (type) {
    // 是文件, 直接删除
    await unlink(pathStr);
  } else {
    // 如果是目录, 则遍历目录, 直到删除完毕, 最后在清除这个目录
    const list = await readdir(pathStr);
    await Promise.all(
      list.map(async (item) => {
        await deleteFile(path.join(pathStr, item)); // 递归处理
      })
    );
    // 删除目录
    await rmdir(pathStr);
  }
}

try {
  deleteFile('./file2');
} catch (e) {
  console.log('错误信息', e);
}