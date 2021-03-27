/**
 * querystring 模块提供用于解析和格式化 URL 查询字符串的实用工具
 */
const querystring = require('querystring');
const logger = require('../../utils/logger');

/** 
 * querystring.parse(str[, sep[, eq[, options]]]) - 将 URL 查询字符串解析键值对的集合
 * str <string> 要解析的 URL 查询字符串。
 * sep <string> 用于在查询字符串中分隔键值对的子字符串。默认值: '&'。
 * eq <string> 用于在查询字符串中分隔键和值的子字符串。默认值: '='。
 * options <Object>
 *  decodeURIComponent <Function> 当解码查询字符串中的百分比编码字符时使用的函数。默认值: querystring.unescape()。
 *  maxKeys <number> 指定要解析的键的最大数量。指定 0 可移除键的计数限制。默认值: 1000。
 */
logger.debug(querystring.parse('foo=bar&abc=xyz&abc=123')); // { foo: 'bar', abc: [ 'xyz', '123' ] } -- [Object: null prototype] 这是一个无原型的对象

// 默认情况下, 会使用 querystring.unescape() 进行解码, 如果需要使用其他方法, 则需要传递其他解码方法
// querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null, { decodeURIComponent: gbkDecodeURIComponent }); -- 假设 gbkDecodeURIComponent 函数已存在。

/**
 * querystring.stringify(obj[, sep[, eq[, options]]]) -- 通过遍历对象的自身属性从给定的 obj 生成 URL 查询字符串。
 * obj <Object> 要序列化为 URL 查询字符串的对象。
 * sep <string> 用于在查询字符串中分隔键值对的子字符串。默认值: '&'。
 * eq <string> 用于在查询字符串中分隔键和值的子字符串。默认值: '='。
 * options
 *   encodeURIComponent <Function> 当将查询字符串中不安全的 URL 字符转换为百分比编码时使用的函数。默认值: querystring.escape()。
 */
 logger.debug(querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' })) // foo=bar&baz=qux&baz=quux&corge=
