"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es7.promise.finally");

require("core-js/modules/es6.function.name");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-12-10 21:28:21
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-12-12 09:49:50
 */
// 测试 class
var className = /*#__PURE__*/function () {
  function className(name) {
    (0, _classCallCheck2["default"])(this, className);
    this.name = name;
  }

  (0, _createClass2["default"])(className, [{
    key: "getName",
    value: function getName() {
      console.log(this.name);
      return this.name;
    }
  }, {
    key: "setName",
    value: function setName(val) {
      console.log('设置属性');
      this.name = val;
    }
  }]);
  return className;
}(); // 使用 let const 等


var c = new className('shuli');

var fn = function fn() {
  console.log('箭头函数');
}; // "useBuiltIns": "usage" 参数后，Polyfill 会自动插入


Promise.resolve()["finally"]();