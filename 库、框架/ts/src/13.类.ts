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
 * 7. 成员可见性:
 *      - 7.1 public: 公开的, 默认值. 任何对象在任何地方都可以访问
 *      - 7.2 protected: 受保护的. 能在当前类或者子类中进行访问
 *      - 7.3 private: 私有的. 只能在当前类中进行访问
 * 8. 静态成员: 通过类对象本身访问, 使用 static 修饰符
 *      - 静态成员也可以使用 public、protected、 private 定义成员可见性
 *      - 静态成员同样也会被继承
 *      - 因为这些静态成员是通过类对象本身访问的， 所以函数本身具有的属性不能被定义为静态成员：name, length, call, bind 等等
 * 9. this 参数： 在函数或方法定义中，第一个形参 this 在 TS 中表示 this 的类型，会在编译期间被删除 --> fn(this: type) {}
 *      - 但是这种方式保证 this 参数正确性只是在 TS 编译期间会静态分析，而 JS 运行时还是无法保证
 *      - 要保证 JS 运行时，方法的 this 指向也是类实例，可以使用箭头函数的方式，但是会有一些问题，见：https://www.typescriptlang.org/docs/handbook/2/classes.html#arrow-functions
 * 10. 参数属性： 用于将构造函数参数转换为具有相同名称和值的类属性。通过在构造函数参数前面加上可见性修饰符 public、private、protected 或 readonly 来创建
 *      - constructor(
 *           public readonly x: number,
 *           protected y: number,
 *           private z: number
 *         ) {
 *           // No body necessary
 *         }
 * 11. 类表达式：与类声明非常相似。唯一真正的区别是类表达式不需要名称
 *       - const someClass = class<Type> { ... }
 */
{
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
    /**
     * 参数属性：可以使用成员可见性修饰符转换为对应的类属性
     */
    constructor(
      x: number,
      y: number = 0,
      public readonly a: number, // 只读属性
      protected b: number, // 受保护的属性
      private c: number // 私有属性
    ) {
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

    /**
     * 成员可见性:
     *  - public: 公开的, 默认值. 任何对象在任何地方都可以访问
     *  - protected: 受保护的. 能在当前类或者子类中进行访问
     *            注意: 可以在派生类(子类)中可以暴露基类中受保护的成员
     *  - private: 私有的. 只能在当前类中进行访问
     */
    // public - 公开的, 默认值, 也可不加 public 修饰符
    public greet() {
      console.log('hi!');
    }
    // protected - 只能在当前类中或子类中进行访问
    protected getName() {
      return 'hello';
    }
    // private - 只能在当前类中进行访问
    private z = 0;
    // private - 运行跨实例的私有访问
    private sameAs(other: Derived) {
      // No error 没有错误
      return other.z === this.z;
    }

    /**
     * 静态成员: 使用 static 修饰符
     */
    static y = 5;
    // 静态成员同样可以使用成员可见性修饰符
    private static getY() {
      return Derived.y; // 访问静态成员需要类对象
    }

    /**
     * this 参数：定义 this 的类型，用于在 TS 类型检查，防止 this 指向不同
     */
    getName2(this: Derived) {
      return this.name;
    }
  }
  const d = new Derived(1, 2);
  // d.getName(); // 访问受保护的属性在类外部是不被允许的 - error: 属性“getName”受保护，只能在类“Derived”及其子类中访问。
  d.z; // 访问私有属性是不被允许的 - error: 属性“z”为私有属性，只能在类“Derived”中访问。
  d['z']; // 但是允许使用括号语法访问, 这种可称为软私有

  class DerivedSun extends Derived {
    // 在派生类(子类)中可以暴露基类中受保护的成员
    // 此时这个属性被派生类暴露为公共的
    getName() {
      return super.getName();
    }

    // z = 5; // 派生类中无法重写私有属性, 会抛出错误: 类“DerivedSun”错误扩展基类“Derived”, 属性“z”在类型“Derived”中是私有属性，但在类型“DerivedSun”中不是。
    myGreeting = DerivedSun.y; // 静态成员也会被继承
  }
}

/**
 * 类继承: JavaScript 中的类可以从基类继承, 在 ts 中, 有两种形式继承
 *  - 1. implements: 用来检查类是否满足特定的 interface --> 也就是类型检查, 而不是 JS 语言层面的继承 --> 语法:  class ClassName implements 接口1, 接口2... {}
 *        --> 注意: implements 只是用来检查类是否兼容特定的类型, 根本不会改变类的类型或其方法
 *  - 2. extends: 派生类具有其基类的所有属性和方法，并且还定义了其他成员
 *        --> 注意: 可以使用super.语法来访问基类方法
 *        --> 注意: 重写方法时要遵循: 派生类始终是其基类的子类型
 */
{
  // demo1: implements 继承
  interface Pingable {
    ping(): void;
    check(name: string): boolean;
  }
  class Sonar implements Pingable {
    ping() {
      console.log('ping!');
    }

    // 具体实现只需要保持兼容继承的接口即可
    check(name: string | number): any {
      return '';
    }

    // implements 只是需要兼容 Pingable 接口, 但不需要完全受限于 Pingable 接口
    // 也就是添加其他属性或方法都是被允许的
    pong() {
      console.log('pong!');
    }
  }

  // demo2: extends 继承
  class Base {
    greet() {
      console.log('Hello World');
    }
  }
  class Derived2 extends Base {
    // 重写方法时要遵循: 派生类始终是其基类的子类型
    // greet(name: string): void { // 这样写是抛出错误: 类型“Derived2”中的属性“greet”不可分配给基类型“Base”中的同一属性。不能将类型“(name: string) => void”分配给类型“() => void”。
    greet(name?: string): void {
      if (name === undefined) {
        super.greet();
      } else {
        console.log(`Hello, ${name.toUpperCase()}`);
      }
    }
  }
}

/**
 * 泛型类: 类很像接口, 也可以是泛型的. 当使用 new 实例化泛型类时，其类型参数的推断方式与函数调用中的方式相同
 *       --> 注意: 静态成员不能引用类类型参数。
 */
{
  class Box<Type> {
    contents: Type; // 在这里还无法感知 Type 的类型, 所以无法初始化值, 此时可以在 constructor 构造器中初始化

    constructor(value: Type) {
      this.contents = value;
    }

    static defaultValue: Type; // error - 静态成员不能引用类类型参数。
  }
  // 调用方法和函数相同, 可以显示定义类型参数, 或由 ts 类型推断出来
  const b = new Box<number>(100); // Type: number
  const b2 = new Box(100); // 推断 Type 为 number
}

/**
 * 抽象类和成员：抽象方法或抽象字段是尚未提供实现的方法。这些成员必须存在于抽象类中，不能直接实例化。
 *              抽象类的作用是作为实现所有抽象成员的子类的基类。
 *              与之对应的，当一个类没有任何抽象成员时，就说它是具体的。
 */
abstract class Base {
  abstract getName(): string; // 抽象成员不需要具体实现，具体实现由子类实现

  // 抽象类中也可以定义具体成员的，同样遵循类继承的规则，会被子类继承
  printName() {
    console.log(this.getName);
  }
}

// const b = new Base(); // 抽象类不能被实例化：error - 无法创建抽象类的实例。
class Derived3 extends Base {
  // 子类继承抽象类时，需要实现抽象类中的抽象成员
  getName(): string {
    return 'world';
  }
}
const b = new Derived3();
b.getName();
b.printName();
