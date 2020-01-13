/*
 * @Descripttion: 
 * @Author: sueRimn
 * @Date: 2020-01-07 09:05:13
 * @LastEditTime : 2020-01-13 14:45:58
 */
// rsingleTag 匹配由一个没有属性的HTML元素组成的字符串
// 并捕获元素的名称
export default (/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i); 
