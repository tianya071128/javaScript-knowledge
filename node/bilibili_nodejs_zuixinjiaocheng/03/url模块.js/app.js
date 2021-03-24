/**
 * url 模块是用来处理和解析 url 的内置模块
 */
const logger = require('../../utils/logger');
const url = require('url');

// 定义一个解析 url
const urlString = 'https://www.baidu.com:433/path/index.html?id=2#tag';


/**
 * 使用 URL 类实现 url 功能 -- 因此，与传统的urlObjects不同，在 URL 对象的任何属性(例如 delete myURL.protocol， delete myURL.pathname等)上使用 delete 关键字没有任何效果，但仍返回 true。
 */
const myURL = new URL(urlString);
/** 解析成如下的数据结构, 以下大部分属性都是可设置的, 具体见文档
 * 
 *   href: 'https://www.baidu.com:433/path/index.html?id=2#tag',
 *   origin: 'https://www.baidu.com:433',
 *   protocol: 'https:',
 *   username: '',
 *   password: '',
 *   host: 'www.baidu.com:433',
 *   hostname: 'www.baidu.com',
 *   port: '433',
 *   pathname: '/path/index.html',
 *   search: '?id=2',
 *   searchParams: URLSearchParams { 'id' => '2' },
 *   hash: '#tag'
 */
logger.debug(myURL);

/**
 * 使用 URLSearchParams 类对 URL 查询部分的读写权限, 与 querystring 模块类似, 但是这个 API 是专门为 URL 查询字符串而设计的
 * 就是对 search 的读写能力
 */
const newSearchParams = new URLSearchParams(myURL.searchParams);
logger.debug(newSearchParams); // URLSearchParams { 'id' => '2' }

// 例如对 search 追加一个值
newSearchParams.append('a', 'c'); // 添加一个参数
myURL.search = newSearchParams; // 将添加后的 search 赋值给 myURL.search
logger.debug(newSearchParams.toString()); // id=2&a=c
logger.debug(myURL.href); // https://www.baidu.com:433/path/index.html?id=2&a=c#tag



/**
 * 这下面的方式已经弃用的方法
 */

// url.parse(url); // 将 url 解析成 urlObject 对象, 类似与 window.location
logger.debug(url.parse(urlString));
// url.format(urlObject); // 将 urlObject 解析成 url
// url.resolve(form, to); // 解析路径
logger.debug(url.resolve('http://www.baidu.com/a', '/b')) // http://www.baidu.com/b