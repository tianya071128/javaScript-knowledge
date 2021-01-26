/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

exports.__esModule = true;

/** 只支持同步插件，顺序执行插件。插件内部执行出错，则直接退出 */
exports.SyncHook = require("./SyncHook");

function anonymous(newSpeed) {
	"use strict";
	var _context;
	var _x = this._x;
	var _fn0 = _x[0];
	_fn0(newSpeed);
	var _fn1 = _x[1];
	_fn1(newSpeed);
	var _fn2 = _x[2];
	_fn2(newSpeed);
}

/** 只支持同步调用插件，当插件返回不为 undefined 时，终止插件执行流程，并将其返回值返回 */
exports.SyncBailHook = require("./SyncBailHook");

function anonymous(newSpeed) {
	"use strict";
	var _context;
	var _x = this._x;
	var _fn0 = _x[0];
	var _result0 = _fn0(newSpeed);
	if (_result0 !== undefined) {
		return _result0;
	} else {
		var _fn1 = _x[1];
		var _result1 = _fn1(newSpeed);
		if (_result1 !== undefined) {
			return _result1;
		} else {
			var _fn2 = _x[2];
			var _result2 = _fn2(newSpeed);
			if (_result2 !== undefined) {
				return _result2;
			} else {
			}
		}
	}
}

/** 接受至少一个参数，上一个注册的回调返回值（如果返回 undefined 则不处理）会作为下一个注册的回调的参数。 */
exports.SyncWaterfallHook = require("./SyncWaterfallHook");

function anonymous(newSpeed) {
	"use strict";
	var _context;
	var _x = this._x;
	var _fn0 = _x[0];
	var _result0 = _fn0(newSpeed);
	if (_result0 !== undefined) {
		newSpeed = _result0;
	}
	var _fn1 = _x[1];
	var _result1 = _fn1(newSpeed);
	if (_result1 !== undefined) {
		newSpeed = _result1;
	}
	var _fn2 = _x[2];
	var _result2 = _fn2(newSpeed);
	if (_result2 !== undefined) {
		newSpeed = _result2;
	}
	return newSpeed;
}


/** 有点类似 SyncBailHook，不强制传递参数，但是在执行过程中回调返回非 undefined 时继续再次执行当前的回调。 */
exports.SyncLoopHook = require("./SyncLoopHook");

function anonymous(newSpeed) {
	"use strict";
	var _context;
	var _x = this._x;
	var _loop;
	do {
		_loop = false;
		var _fn0 = _x[0];
		var _result0 = _fn0(newSpeed);
		if (_result0 !== undefined) {
			_loop = true;
		} else {
			var _fn1 = _x[1];
			var _result1 = _fn1(newSpeed);
			if (_result1 !== undefined) {
				_loop = true;
			} else {
				var _fn2 = _x[2];
				var _result2 = _fn2(newSpeed);
				if (_result2 !== undefined) {
					_loop = true;
				} else {
					if (!_loop) {
					}
				}
			}
		}
	} while (_loop);
}

/** 不允许 call 同步执行插件，并行执行的异步钩子，当注册的所有异步回调都并行执行完毕之后再执行 callAsync 或者 promise 中的函数。 */
exports.AsyncParallelHook = require("./AsyncParallelHook");

function anonymous(newSpeed) {
	"use strict";
	var _context;
	var _x = this._x;
	return new Promise((function (_resolve, _reject) {
		var _sync = true;
		function _error(_err) {
			if (_sync)
				_resolve(Promise.resolve().then((function () { throw _err; })));
			else
				_reject(_err);
		};
		do {
			var _counter = 3;
			var _done = (function () {
				_resolve();
			});
			if (_counter <= 0) break;
			var _fn0 = _x[0];
			var _hasError0 = false;
			try {
				_fn0(newSpeed); // 注册的同步回调，直接调用
			} catch (_err) {
				_hasError0 = true;
				if (_counter > 0) {
					_error(_err);
					_counter = 0;
				}
			}
			if (!_hasError0) {
				if (--_counter === 0) _done();
			}
			if (_counter <= 0) break;
			var _fn1 = _x[1];
			_fn1(newSpeed, (function (_err1) { // 通过 tapAsync 注册的 callback 异步插件
				if (_err1) {
					if (_counter > 0) {
						_error(_err1);
						_counter = 0;
					}
				} else {
					if (--_counter === 0) _done();
				}
			}));
			if (_counter <= 0) break;
			var _fn2 = _x[2];
			var _hasResult2 = false;
			var _promise2 = _fn2(newSpeed); // 通过 tapPromise 注册的 promise 异步插件
			if (!_promise2 || !_promise2.then)
				throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise2 + ')');
			_promise2.then((function (_result2) {
				_hasResult2 = true;
				if (--_counter === 0) _done();
			}), function (_err2) {
				if (_hasResult2) throw _err2;
				if (_counter > 0) {
					_error(_err2);
					_counter = 0;
				}
			});
		} while (false);
		_sync = false;
	}));

}

/** 执行过程中注册的回调返回非 undefined 时就会直接执行 callAsync 或者 promise 中的函数（由于并行执行的原因，注册的其他回调依然会执行）。 */
exports.AsyncParallelBailHook = require("./AsyncParallelBailHook");

/** 顺序的执行注册的回调，除此之外注册与触发的用法都是相同的。 */
exports.AsyncSeriesHook = require("./AsyncSeriesHook");

function anonymous(newSpeed, _callback) {
	"use strict";
	var _context;
	var _x = this._x;
	function _next1() {
		var _fn2 = _x[2];
		var _hasResult2 = false;
		var _promise2 = _fn2(newSpeed);
		if (!_promise2 || !_promise2.then)
			throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise2 + ')');
		_promise2.then((function (_result2) {
			_hasResult2 = true;
			_callback();
		}), function (_err2) {
			if (_hasResult2) throw _err2;
			_callback(_err2);
		});
	}
	function _next0() {
		var _fn1 = _x[1];
		_fn1(newSpeed, (function (_err1) {
			if (_err1) {
				_callback(_err1);
			} else {
				_next1();
			}
		}));
	}
	var _fn0 = _x[0];
	var _hasResult0 = false;
	var _promise0 = _fn0(newSpeed);
	if (!_promise0 || !_promise0.then)
		throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise0 + ')');
	_promise0.then((function (_result0) {
		_hasResult0 = true;
		_next0();
	}), function (_err0) {
		if (_hasResult0) throw _err0;
		_callback(_err0);
	});

}

/** 执行过程中注册的回调返回非 undefined 时就会直接执行 callAsync 或者 promise 中的函数，并且注册的后续回调都不会执行。 */
exports.AsyncSeriesBailHook = require("./AsyncSeriesBailHook");

/**  */
exports.AsyncSeriesLoopHook = require("./AsyncSeriesLoopHook"); 

/** 与 SyncWaterfallHook 类似，上一个注册的异步回调执行之后的返回值会传递给下一个注册的回调。 */
exports.AsyncSeriesWaterfallHook = require("./AsyncSeriesWaterfallHook");
exports.HookMap = require("./HookMap");
exports.MultiHook = require("./MultiHook");
