/*
 * @Descripttion: 
 * @Author: sueRimn
 * @Date: 2020-01-07 09:05:13
 * @LastEditTime : 2020-01-11 14:25:54
 */
import arr from "./arr.js";

// ES6 中提供了 flat 方法, 为没有 flat 方法的提供回退
export default arr.flat ? function (array) {
	return arr.flat.call(array);
} : function (array) {
	// 这里没有展开, 而是直接连接
	return arr.concat.apply([], array);
};
