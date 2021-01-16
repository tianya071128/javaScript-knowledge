/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-01-16 10:04:32
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-01-16 11:02:40
 */
// !1. 接口定义 - interface 定义
interface I {
  name: string;
  eat?(str: string): void;
}
const a: I = {
  name: '1234'
}

// !2. 可选属性 - ? 定义
// !3. 只读属性 - readonly 定义
interface I2 {
  name: string;
  age?: number;
  readonly sex: string;
}

// !4. 函数类型接口
interface I3 {
  (key: string, value: string): string;
}

const fn: I3 = (key, value) => {
  return key + value;
}


// !5. 可索引接口：数组、对象的约束(不常用)
interface UserArray {
  [index: number]: string; // 定义数组约束
}
const arr: UserArray = ['1', 's'];

// !6. 类类型接口：对类的约束
// !接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。
// !因为当一个类实现了一个接口时，只对其实例部分进行类型检查 -- private 和 protected 属性或方法只可以在类内部使用，不会影响实例属性
interface Animal {
  name: string;
  eat(str: string): void;
}

class Dog2 implements Animal {
  constructor(public name: string) { };
  eat() {
    // return ;
  }
}

// !7. 接口继承
interface I4 extends I2, I {
  age: number;
}

const fn2: I4 = {
  age: 20,
  name: 'wen',
  sex: '男'
}


