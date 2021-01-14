/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-01-14 20:48:35
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-01-14 23:23:18
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