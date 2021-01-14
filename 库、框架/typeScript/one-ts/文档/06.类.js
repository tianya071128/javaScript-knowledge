var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-01-14 20:49:01
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-01-14 21:06:41
 */
// 1. 定义类
var Greeter = /** @class */ (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    ;
    Greeter.prototype.greet = function () {
        return 'Hello，' + this.greeting;
    };
    return Greeter;
}());
console.log(Greeter, new Greeter('biao'));
// 2. 继承 - 使用 extends 关键字
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog(message) {
        var _this = _super.call(this, message) || this;
        _this.age = 25;
        return _this;
    }
    ;
    Dog.prototype.greet = function () {
        return _super.prototype.greet.call(this); // 调用 基类 的方法
    };
    return Dog;
}(Greeter));
console.log((new Dog('biao')).greet());
// 3. 公共修饰符：public => 可以自由的访问程序里定义的成员
// 默认就是 public，也可以显式定义
var C = /** @class */ (function () {
    function C() {
    }
    C.prototype.move = function (a) { }; // 定义一个公共方法
    return C;
}());
// 4. 私有修饰符：private => 不能在声明它的类的外部访问，访问权限在类的内部
var C2 = /** @class */ (function () {
    function C2(theName) {
        this.name = theName;
    }
    return C2;
}());
new C2('wen').name;
