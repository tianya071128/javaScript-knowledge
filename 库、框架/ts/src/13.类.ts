/**
 * 为 ES 的 class 添加了类型注释和其他语法, 表达类和其他类型之间的关系
 */

/**
 * 1. 实例属性: 字段声明在类上创建公共可写属性
 * 2. 只读属性: 以 readonly 修饰符为前缀, 可以防止对构造器之外的字段进行赋值 -- 注意, 可以在构造器(constructor)中赋值
 * 3. 构造器(constructor): 与函数签名类似, 只是有一些区别
 *      - 构造函数不能有类型参数 —— 它们属于外部类声明, 相当于泛型类
 *      - 构造函数不能有返回类型注释 —— 返回的总是类实例类型
 * 4. 方法: 类上的函数也称为方法 --> 可以使用所有与函数和构造函数相同的类型注释
 * 5. 访问器(Getters/Setters): 使用 get/set 修饰符进行定义
 *      - 如果get存在但不存在set，则属性自动推断 readonly
 *      - 如果不指定 setter 参数的类型，则从 getter 的返回类型推断
 *      - Getter 和 setter 必须具有相同的成员可见性
 * 6. 索引签名: 与对象类型的索引签名相同, 存在字符串签名和数字签名 --> [name: (string | number)]: Type
 */
class Derived {
  /**
   * 严格模式下 - 属性“x”没有初始化表达式，且未在构造器中明确赋值。
   * 此时有如下两个方式解决:
   *  1. 在定义实例属性时直接赋值
   *  2. 在 constructor 初始化方法中初始化 -- 注意: TypeScript 不会分析您从构造器调用的方法来检测初始化，因为派生类可能会覆盖这些方法并且无法初始化成员 - 也就是不能在 constructor 方法以外的地方初始化
   */
  x: number = 1;
  /**
   * 只读属性: 只允许在构造器(constructor)中重新赋值
   */
  readonly y: string = 'world';

  /**
   * 构造器: 与函数签名类似, 可以带有类型注释、默认值
   */
  constructor(x: number, y: number = 0) {
    this.y = 'hello'; // 只读属性在 constructor 构造器中可以重新赋值, 但是其他地方不可以
  }

  /**
   * 方法: 与函数类型注释一样, 也可以使用类型参数
   */
  scale<T>(n: string, y: T): T {
    return y;
  }

  /**
   * 访问器(Getters/Setters): 使用 get/set 修饰符进行定义
   */
  _length = 0;
  get length(): number /** 返回类型也可以类型推断出来 */ {
    return this._length;
  }
  set length(val /** 可以由 getter 的返回类型推断出来 */) {
    this._length = val;
  }

  /**
   * 索引签名: [name: (string | number)]: Type
   */
  [prop: string]: boolean | ((s: string) => boolean) | any; // 当定义了索引签名后, 其他属性都要受到这个索引签名的约束, 所以我们就控制一下为 any, 让所有类型都通过
  autograph = true;
}

/**
 * 类继承: JavaScript 中的类可以从基类继承, 在 ts 中, 有两种形式继承
 *  - 1. implements: 用来检查类是否满足特定的 interface --> 也就是类型检查, 而不是 JS 语言层面的继承 --> 语法:  class ClassName implements 接口1, 接口2... {}
 *        --> 注意: implements 只是用来检查类是否兼容特定的类型, 根本不会改变类的类型或其方法
 *  - 2.
 */

// demo1: implements 继承
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log('ping!');
  }

  pong() {
    console.log('pong!');
  }
}
