const { mkdir, writeFile, readdir, rmdir, stat, unlink } =
  require('fs').promises;
const path = require('path');

/**
 * fsPromise.mkdir(path[, options]): 创建文件目录
 * 1. 传入的路径前面的文件目录都存在, 否则报错
 * 2. 当 path 是已存在的目录时，调用 fsPromises.mkdir() 仅在 recursive(配置项) 为 false(默认值) 时才导致拒绝。
 */
async function add(...args) {
  try {
    await mkdir(...args);
    console.log('成功');
  } catch (e) {
    console.log('失败', e);
  }
}

// add('./file2');

/**
 * fsPromise.readdir(path[, options]): 读取目录
 * 当读取不存在的目录, 报错
 */
async function read(...args) {
  try {
    // await writeFile('./file2/test', 'test');
    const data = await readdir(...args);
    console.log('成功', data);
  } catch (e) {
    console.log('失败', e);
  }
}

// read('./file');

/**
 * fsPromise.rmdir(path[, options]): 删除目录
 * 1. 需要保证 path 是一个目录
 * 2. 被删除的目录下面是一个空目录, 即不能存在文件和文件夹
 */
async function deleteDir(...args) {
  try {
    const data = await rmdir(...args);
    console.log('成功', data);
  } catch (e) {
    console.log('失败', e);
  }
}

// deleteDir('./file2');

// 递归实现一下删除操作
async function hasFile(path) {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch (e) {
    console.log(`判断 ${path} 类型失败`);
    throw e; // 错误传递下去, 不要执行下面的语句了
  }
}

async function init(pathStr) {
  const type = await hasFile(pathStr);
  if (type) {
    // 是文件, 直接删除
    await unlink(pathStr);
  } else {
    // 如果是目录, 则遍历目录, 直到删除完毕, 最后在清除这个目录
    const list = await readdir(pathStr);
    await Promise.all(
      list.map(async (item) => {
        await init(path.join(pathStr, item)); // 递归处理
      })
    );
    // 删除目录
    await rmdir(pathStr);
  }
}

try {
  init('./file2');
} catch (e) {
  console.log('错误信息', e);
}
