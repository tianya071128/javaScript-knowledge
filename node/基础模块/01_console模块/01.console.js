/**
 * console 分为两种:
 * 1. 导出 console 类, 使用需要 require 导入, 可以写入到任何 node 流
 * 2. 全局 console 实例, 无需 require 导入, 它的输出写入到 process.stdout 和 process.stderr
 */

/**
 * 1. Console 类
 *    new Console(stdout, [, stderr, [, ignoreErrors]])
 *    new Console(options)
 *    options: 
 *      * stdout: 可写流, 用于打印日志或信息输出的可写流
 *      * stderr: 可写流, 用于警告或警告输出
 *      * ignoreErrors: 写入底层流时忽略错误, 默认为 true
 *      * ...
 */
const { Console } = require('console');
const output = require('fs').createWriteStream('./log/stdout.log'); // 可写流
const errorOutput = require('fs').createWriteStream('./log/stderr.log'); // 可写流
// 自定义的简单记录器
const logger = new Console(output, errorOutput);
// 像控制台一样使用它
logger.log('count: 5');
logger.error('error');
