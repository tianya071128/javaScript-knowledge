const { mkdir, readdir, rmdir } = require('fs').promises;

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