// 初始化jQuery对象
import jQuery from "../core.js";
import document from "../var/document.js";
import rsingleTag from "./var/rsingleTag.js";

import "../traversing/findFilter.js";

// 对 根jQuery（文档）的中心引用
var rootjQuery,

	// 检查 HTML 字符串的简单方法
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function (selector, context, root) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if (!selector) {
			return this;
		}

		// 方法 init（）接受备用 rootjQuery
		// 所以 migrate 可以支持 jQuery.sub（gh-2101）
		root = root || rootjQuery;

		// 处理 HTML 字符串
		if (typeof selector === "string") {
			if (selector[0] === "<" &&
				selector[selector.length - 1] === ">" &&
				selector.length >= 3) {

				// 假设以<>开头和结尾的字符串是 HTML，并跳过 regex 检查
				match = [null, selector, null];

			} else {
				match = rquickExpr.exec(selector);
			}

			// 匹配 html 或确保没有为 id 指定上下文
			if (match && (match[1] || !context)) {

				// HANDLE: $(html) -> $(array)
				if (match[1]) {
					context = context instanceof jQuery ? context[0] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge(this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					));

					// HANDLE: $(html, props)
					if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
						for (match in context) {

							// Properties of context are called as methods if possible
							if (typeof this[match] === "function") {
								this[match](context[match]);

								// ...and otherwise set as attributes
							} else {
								this.attr(match, context[match]);
							}
						}
					}

					return this;

					// HANDLE: $(#id)
				} else {
					elem = document.getElementById(match[2]);

					if (elem) {

						// Inject the element directly into the jQuery object
						this[0] = elem;
						this.length = 1;
					}
					return this;
				}

				// HANDLE: $(expr, $(...))
			} else if (!context || context.jquery) {
				return (context || root).find(selector);

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor(context).find(selector);
			}

			// HANDLE: $(DOMElement)
			// 处理 DOM 元素
		} else if (selector.nodeType) {
			this[0] = selector;
			this.length = 1;
			return this;

			// HANDLE: $(function)
			// 文档就绪快捷方式
			// $(document).ready()的简写。 -- 允许你绑定一个在DOM文档载入完成后执行的函数。
		} else if (typeof selector === "function") {
			return root.ready !== undefined ?
				root.ready(selector) :

				// 如果没有就绪，则立即执行
				selector(jQuery);
		}

		return jQuery.makeArray(selector, this);
	};

// 为 init 函数提供 jQuery 原型，以便以后实例化
init.prototype = jQuery.fn;

// 初始化中心引用
rootjQuery = jQuery(document);

export default init;
