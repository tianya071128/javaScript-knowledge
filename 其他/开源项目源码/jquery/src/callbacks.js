import jQuery from "./core.js";
import toType from "./core/toType.js";
import rnothtmlwhite from "./var/rnothtmlwhite.js";

// 将字符串格式的选项转换为对象格式的选项
function createOptions(options) {
	var object = {};
	jQuery.each(options.match(rnothtmlwhite) || [], function (_, flag) {
		object[flag] = true;
	});
	return object;
}

/*
 * 使用以下参数创建回调列表:
 *
 *	options: 一个可选的空格分隔选项列表，它将更改
 *			回调列表的行为或更传统的选项对象
 *
 * 默认情况下，回调列表的作用类似于事件回调列表，可以是
 * 多次 “fired”.
 *
 * 可能的选择:
 *
 *	once:			将确保回调列表只能触发一次（如延迟）
 *
 *	memory:			将跟踪以前的值并调用添加的任何回调
 *					在最新的“记忆”名单被立即解雇后
 *					values(如延迟)
 *
 *	unique:			将确保只能添加一次回调（列表中没有重复的）
 *
 *	stopOnFalse:	当回调返回 false 时中断调用
 *
 */
jQuery.Callbacks = function (options) {

	// 如果需要，将选项从字符串格式转换为对象格式
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions(options) :
		jQuery.extend({}, options);

	var // 标记以知道列表当前是否正在触发
		firing,

		// 不可忘记列表的最后一次激发值
		memory,

		// 标记以知道列表是否已被激发
		fired,

		// Flag to prevent firing
		locked,

		// 实际回调列表
		list = [],

		// 可重复列表的执行数据队列
		queue = [],

		// 当前触发回调的索引（根据需要通过添加/删除进行修改）
		firingIndex = -1,

		fire = function () {

			// 强制单发
			locked = locked || options.once;

			// 对所有挂起的执行执行执行回调,
			// 尊重 firingIndex 重写和运行时更改
			fired = firing = true;
			for (; queue.length; firingIndex = -1) {
				memory = queue.shift();
				while (++firingIndex < list.length) {

					// 运行回调并检查是否提前终止
					if (list[firingIndex].apply(memory[0], memory[1]) === false &&
						options.stopOnFalse) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if (!options.memory) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if (locked) {

				// Keep an empty list if we have data for future add calls
				if (memory) {
					list = [];

					// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// 向列表中添加回调或回调集合
			add: function () {
				if (list) {

					// 如果我们有过去跑步的记忆，我们应该在加上
					if (memory && !firing) {
						firingIndex = list.length - 1;
						queue.push(memory);
					}

					(function add(args) {
						jQuery.each(args, function (_, arg) {
							if (typeof arg === "function") {
								if (!options.unique || !self.has(arg)) {
									list.push(arg);
								}
							} else if (arg && arg.length && toType(arg) !== "string") {

								// Inspect recursively
								add(arg);
							}
						});
					})(arguments);

					if (memory && !firing) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function () {
				jQuery.each(arguments, function (_, arg) {
					var index;
					while ((index = jQuery.inArray(arg, list, index)) > -1) {
						list.splice(index, 1);

						// Handle firing indexes
						if (index <= firingIndex) {
							firingIndex--;
						}
					}
				});
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function (fn) {
				return fn ?
					jQuery.inArray(fn, list) > -1 :
					list.length > 0;
			},

			// 从列表中删除所有回调
			empty: function () {
				if (list) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function () {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function () {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function () {
				locked = queue = [];
				if (!memory && !firing) {
					list = memory = "";
				}
				return this;
			},
			locked: function () {
				return !!locked;
			},

			// 使用给定的上下文和参数调用所有回调
			fireWith: function (context, args) {
				if (!locked) {
					args = args || [];
					args = [context, args.slice ? args.slice() : args];
					queue.push(args);
					if (!firing) {
						fire();
					}
				}
				return this;
			},

			// 用给定的参数调用所有回调
			fire: function () {
				self.fireWith(this, arguments);
				return this;
			},

			// 要知道回调是否已至少调用一次
			fired: function () {
				return !!fired;
			}
		};

	return self;
};

export default jQuery;
