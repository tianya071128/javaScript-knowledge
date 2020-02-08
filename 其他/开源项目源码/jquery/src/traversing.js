import jQuery from "./core.js";
import getProto from "./var/getProto.js";
import indexOf from "./var/indexOf.js";
import dir from "./traversing/var/dir.js";
import siblings from "./traversing/var/siblings.js";
import rneedsContext from "./traversing/var/rneedsContext.js";
import nodeName from "./core/nodeName.js";

import "./core/init.js";
import "./traversing/findFilter.js";
import "./selector.js";

var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// 从唯一集开始时保证生成唯一集的方法
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	// 	返回拥有一个或多个元素在其内的所有元素
	has: function (target) {
		var targets = jQuery(target, this),
			l = targets.length;

		return this.filter(function () {
			var i = 0;
			for (; i < l; i++) {
				if (jQuery.contains(this, targets[i])) {
					return true;
				}
			}
		});
	},

	// 返回被选元素的第一个祖先元素
	closest: function (selectors, context) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery(selectors);

		// 位置选择器从不匹配，因为没有选择上下文
		if (!rneedsContext.test(selectors)) {
			for (; i < l; i++) {
				for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {

					// Always skip document fragments
					if (cur.nodeType < 11 && (targets ?
						targets.index(cur) > -1 :

						// Don't pass non-elements to jQuery#find
						cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors))) {

						matched.push(cur);
						break;
					}
				}
			}
		}

		return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
	},

	// 搜索匹配的元素，并返回相应元素的索引值，从0开始计数。
	index: function (elem) {

		// 如果不给 .index() 方法传递参数，那么返回值就是这个jQuery对象集合中第一个元素相对于其同辈元素的位置。
		if (!elem) {
			return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
		}

		// 选择器中的索引
		if (typeof elem === "string") {
			return indexOf.call(jQuery(elem), this[0]);
		}

		// 定位所需元素的位置
		return indexOf.call(this,

			// 如果它接收到 jQuery 对象，则使用第一个元素
			elem.jquery ? elem[0] : elem
		);
	},

	// 把与表达式匹配的元素添加到jQuery对象中。这个函数可以用于连接分别与两个表达式匹配的元素结果集。
	add: function (selector, context) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge(this.get(), jQuery(selector, context))
			)
		);
	},
	// 把之前的元素集添加到当前集合中
	addBack: function (selector) {
		return this.add(selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling(cur, dir) {
	while ((cur = cur[dir]) && cur.nodeType !== 1) { }
	return cur;
}

jQuery.each({
	parent: function (elem) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function (elem) {
		return dir(elem, "parentNode");
	},
	parentsUntil: function (elem, _i, until) {
		return dir(elem, "parentNode", until);
	},
	next: function (elem) {
		return sibling(elem, "nextSibling");
	},
	prev: function (elem) {
		return sibling(elem, "previousSibling");
	},
	nextAll: function (elem) {
		return dir(elem, "nextSibling");
	},
	prevAll: function (elem) {
		return dir(elem, "previousSibling");
	},
	nextUntil: function (elem, _i, until) {
		return dir(elem, "nextSibling", until);
	},
	prevUntil: function (elem, _i, until) {
		return dir(elem, "previousSibling", until);
	},
	siblings: function (elem) {
		return siblings((elem.parentNode || {}).firstChild, elem);
	},
	children: function (elem) {
		return siblings(elem.firstChild);
	},
	contents: function (elem) {
		if (elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto(elem.contentDocument)) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11+
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if (nodeName(elem, "template")) {
			elem = elem.content || elem;
		}

		return jQuery.merge([], elem.childNodes);
	}
}, function (name, fn) {
	jQuery.fn[name] = function (until, selector) {
		var matched = jQuery.map(this, fn, until);

		if (name.slice(-5) !== "Until") {
			selector = until;
		}

		if (selector && typeof selector === "string") {
			matched = jQuery.filter(selector, matched);
		}

		if (this.length > 1) {

			// Remove duplicates
			if (!guaranteedUnique[name]) {
				jQuery.uniqueSort(matched);
			}

			// Reverse order for parents* and prev-derivatives
			if (rparentsprev.test(name)) {
				matched.reverse();
			}
		}

		return this.pushStack(matched);
	};
});

export default jQuery;
