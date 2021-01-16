/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-01-14 20:48:35
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-01-16 10:00:06
 */
// !1. 定义 class
class Person {
  name: string; // 声明一个属性，默认为 public

  constructor(n: string) {
    this.name = n;
  }
}

// !2. 实现继承 - extends 和 super 关键字
class Person2 extends Person {
  name02: string;
  constructor(n: string) {
    super(n);
    this.name02 = '2';
  }
}

console.log(new Person2('wen'));

// !3. 修饰符
/**
 * !public(公共的) 默认的修饰符，在类里面、派生类、实例都可以访问
 * !protected(受保护的) 在类里面、派生类可以访问，实例不可以访问
 * !private(私有的) 只允许在类里面访问，派生类和实例都不可以访问
 */
class Person3 {
  public publicAttr: string = '公共属性';
  protected protectedAttr: string = '受保护的属性';
  private privateAttr: string = '私有属性';
}

// !4.静态属性和静态方法
class Person4 {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
  static print() { // 静态方法
    console.log('静态方法会继承吗？'); // 静态方法也会继承
  }
}

class Person5 extends Person4 {
}
console.log(Person5.print());

// !5. 抽象类 - abstract 关键字定义抽象类和抽象方法
// !抽象类是无法被实例的，并且子类必须自定义抽象方法和属性 - 与接口不同，抽象类可以包含成员的实现细节
abstract class Person6 {
  abstract eat(name: string): string; // 抽象方法不能有具体实现
}

class Person7 extends Person6 {
  eat(name: string) {
    return name;
  }
}

