/*
 * @Descripttion: 
 * @Author: sueRimn
 * @Date: 2020-01-07 09:05:13
 * @LastEditTime : 2020-01-13 14:17:46
 */
import jQuery from "../core.js";
import document from "../var/document.js";
import sort from "../var/sort.js";

var hasDuplicate;

// 文件顺序排序
function sortOrder(a, b) {

	// 重复删除标志
	if (a === b) {
		hasDuplicate = true;
		return 0;
	}

	// 如果只有一个输入具有相同的文档位置，则排序方法存在性
	var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
	if (compare) {
		return compare;
	}

	// Calculate position if both inputs belong to the same document
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	compare = (a.ownerDocument || a) == (b.ownerDocument || b) ?
		a.compareDocumentPosition(b) :

		// Otherwise we know they are disconnected
		1;

	// Disconnected nodes
	if (compare & 1) {

		// Choose the first element that is related to the document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if (a == document || a.ownerDocument == document &&
			jQuery.contains(document, a)) {
			return -1;
		}

		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if (b == document || b.ownerDocument == document &&
			jQuery.contains(document, b)) {
			return 1;
		}

		// Maintain original order
		return 0;
	}

	return compare & 4 ? -1 : 1;
}

/**
 * 文档排序和删除重复项 -- 对DOM元素数组进行排序，并移除重复的元素
 * @param {ArrayLike} results
 */
jQuery.uniqueSort = function (results) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	hasDuplicate = false;

	sort.call(results, sortOrder);

	if (hasDuplicate) {
		while ((elem = results[i++])) {
			if (elem === results[i]) {
				j = duplicates.push(i);
			}
		}
		while (j--) {
			results.splice(duplicates[j], 1);
		}
	}

	return results;
};
