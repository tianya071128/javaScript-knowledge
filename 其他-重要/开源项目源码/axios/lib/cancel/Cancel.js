/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2019-12-25 20:59:25
 * @LastEditTime: 2019-12-25 23:04:49
 */
"use strict";

/**
 * `Cancel` 是取消操作时抛出的对象。
 *
 * @class
 * @param {string=} message 信息.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return "Cancel" + (this.message ? ": " + this.message : "");
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;
