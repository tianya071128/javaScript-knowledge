/*
 * @Descripttion: 
 * @Author: sueRimn
 * @Date: 2020-01-07 09:05:13
 * @LastEditTime : 2020-01-13 14:09:15
 */
import jQuery from "../core.js";

// 注意：元素本身不包含
// 判断另一个DOM元素是否是指定DOM元素的后代
jQuery.contains = function (a, b) {
	var adown = a.nodeType === 9 ? a.documentElement : a,
		bup = b && b.parentNode;

	return a === bup || !!(bup && bup.nodeType === 1 && (

		// 支持：IE 9-11+
		// IE在 SVG 上没有 “contains”。
		adown.contains ?
			adown.contains(bup) :
			a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
	));
};
