/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-01-14 20:49:01
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-01-14 23:28:37
 */
// !1. 定义类
class Greeter {
  greeting: string = 'biao'; // 定义属性并且可以赋予默认值, 然后在 constructor 或 其他地方 中才能进行赋值
  constructor(message: string) {
    this.greeting = message;
  };
  greet(): string { // 定义方法
    return 'Hello，' + this.greeting;
  }
}
console.log(Greeter, new Greeter('biao'));

// !2. 继承 - 使用 extends 关键字
class Dog extends Greeter {
  age: number;
  constructor(message: string) {
    super(message); // 必须先调用 super 函数
    this.age = 25;
  };

  greet(): string { // 重写基类的方法
    return super.greet(); // 调用 基类 的方法
  }
}
console.log((new Dog('biao')).greet());

// !3. 公共修饰符：public => 可以自由的访问程序里定义的成员
// !默认就是 public，也可以显式定义
class C {
  public name: string; // 定义一个公共属性
  public move(a: string): void { } // 定义一个公共方法
}

// !4. 私有修饰符：private => 不能在声明它的类的外部访问，访问权限在类的内部
class C2 {
  private name: string;
  constructor(theName: string) { this.name = theName; }
}

class C3 extends C2 {
  constructor(name: string) {
    super(name);
  }
  public getName() {
    // console.log(this.name); error 在派生类中也无法访问私有属性(方法)
  }
}

// new C2('wen').name; // *error 在 ts 中会提示报错信息，但其实在编译为 js 的时候，无法提供 private 私有属性的，这个只是 ts 添加的功能，js 原生并不支持

// !5. 受保护修饰符：protected => 与 private 修饰符类型，但有一点不同就是在派生类中也可以访问
class C4 {
  protected name: string;
  constructor(theName: string) { this.name = theName; }
}

class C5 extends C4 {
  constructor(name: string) {
    super(name);
  }
  public getName() {
    console.log(this.name); // 与 private 不同，protected 在派生类中可以使用
  }
}
// new C5('wen').name // error， 在外部同样无法访问

// !注意点：构造函数也可以被标注 protected，这样意味着不能再包含它的类外被实例化，但是能被继承
// !可以用来当作抽象类？
class Person {
  protected constructor() { }
}

// Employee 能够继承 Person
class Employee extends Person {
  constructor() {
    super()
  }
}

let howard = new Employee();
// let john = new Person("John"); // 错误: 'Person' 的构造函数是被保护的.

// !注意点2：当构造函数被标注为 private 时, 意味着这个 类 无法被继承，也无法被实例，其实相当为没有作用了
class C6 {
  private constructor() { }
}
// new C6(); // error 无法被实例化

// !6. readonly 修饰符：只读属性 => 必须在声明时或构造函数里被初始化
class C7 {
  readonly name: string = '2'; // 在 声明 时初始化
  readonly num: number; // 在 构造函数 中初始化
  constructor(num: number) {
    this.num = num;
  }
}

// !7. 参数属性 => 通过给构造函数参数前面添加一个访问限定符来声明，这样就会声明并初始化一个属性
class C8 {
  constructor(readonly name: string) { } // 这样 name 就会声明并初始化，而且是一个只读属性
}

// !8.存取器 => 也就是定义一个访问器属性，getters/setters 
class C9 {
  private _name: string;
  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
  }
}

// !9. 静态属性：static 关键字定义，是存在类身上的属性，需要通过 类 来访问
class C10 {
  static age: number = 2;
  constructor() {
    console.log(C10.age);
  }
}

// !10 抽象类：做为其他派生类的基类使用。一般不会直接被实例化。 => abstract 关键字定义抽象类和在抽象类内部定义抽象方法
// !与接口不同，抽象类可以包含成员的实现细节
// !抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。 
// !抽象方法的语法与接口方法相似。 两者都是定义方法签名但不包含方法体。
// !然而，抽象方法必须包含 abstract关键字并且可以包含访问修饰符。
abstract class Department {

  constructor(public name: string) {
  }

  printName(): void {
    console.log('Department name: ' + this.name);
  }

  abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {

  constructor() {
    super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
  }

  printMeeting(): void {
    console.log('The Accounting Department meets each Monday at 10am.');
  }

  generateReports(): void {
    console.log('Generating accounting reports...');
  }
}

let department: Department; // 允许创建一个对抽象类型的引用
// department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
// department.generateReports(); // 错误: 方法在声明的抽象类中不存在


// !11.类当做接口使用 - 类定义会创建两个东西：类的实例类型和一个构造函数。
class Point {
  x: number;
  y: number;
}

interface Point3d extends Point {
  z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
