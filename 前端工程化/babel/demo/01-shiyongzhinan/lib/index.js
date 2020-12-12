"use strict";

require("@babel/polyfill");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 测试 class
var className = /*#__PURE__*/function () {
  function className(name) {
    _classCallCheck(this, className);

    this.name = name;
  }

  _createClass(className, [{
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