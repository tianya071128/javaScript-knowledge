/** URL 可以从 url 模块中导出, 或者直接使用全局类 URL
 * new URL(input[, base]): 创建一个 url 类, 返回的对象与浏览器的类似, URL 对象的所有属性都被实现为类原型上的获取器和设置器，而不是对象本身的数据属性。因此, 使用 delete 关键字无法删除属性的
 *  * input <string>: 要解析的 url, 如果是相对的, 则需要提供 base 参数
 *  * base <string> | <URL> 如果 input 不是绝对的，则为要解析的基本网址。
 *  * 返回: url 类
 */
const myURL = new URL('/foo?test=123#bar', 'https://example.org/');
console.log(myURL); // URL 类

// url.hash: 获取或设置 url 的片段部分(hash 部分)
console.log(myURL.hash); // #bar

// url.host: 获取或设置 url 的主机部分
console.log(myURL.host); // example.org

// url.href: 获取或设置序列化的网址
console.log(myURL.href); // https://example.org/foo#bar

// url.search: 获取或设置序列化的查询参数部分 -- 最好使用 searchParams 类来操作
console.log(myURL.search); // ?test=123

// url.searchParams: 获取表示网址查询参数的 searchParams 对象, 通过操作 searchParams 对象, 也可更改这个网址实例
console.log(myURL.searchParams); // URLSearchParams { 'test' => '123' }

/**
 * URLSearchParams 类: 全局类, 用于操作网址的查询参数
 */
const params = new URLSearchParams(myURL.searchParams);

// urlSearchParams.append(name, value): 追加一个参数
params.append('foo', 'foo2');
console.log(params); // URLSearchParams { 'test' => '123', 'foo' => 'foo2' }

/**
 * urlSearchParams.delete(name): 删除参数
 * urlSearchParams.get(name): 获取第一个匹配的参数
 * urlSearchParams.getAll(name): 获取所有匹配的参数
 * urlSearchParams.set(name, value): 设置参数, 如果不存在, 则追加参数
 * urlSearchParams.sort(): 排序
 * urlSearchParams.forEach(): 遍历
 */
