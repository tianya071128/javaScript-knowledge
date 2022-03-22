export type module = number; // 使其变成模块，独立作用域
/**
 * 类型别名：用来给一个类型起个新名字 -- 仅仅是给类型取了一个新的名字，并不是创建了一个新的类型
 */
{
  type Point = {
    x: number;
    y: number;
  };
  let point: Point = {
    x: 1,
    y: 2,
  };
  // 可以使用类型别名来为任何类型命名，而不仅仅是对象类型。
  type ID = number | string;
  let id: ID = 1;
}

/**
 * 类型别名和接口的区别：
 *  类型别名和接口非常相似，在很多情况下您可以在它们之间自由选择。几乎所有的特性 interface 都可以在中使用 type，
 *  主要区别在于不能重新打开类型来添加新属性，而接口总是可扩展的
 */

// 扩展区别
{
  // --> 1.1 扩展接口: 与 class 类似, 通过 extends 关键字继承父接口
  interface Point3 {
    name: string;
  }
  interface Point2 {
    x: number;
    y: number;
  }
  // 以 , 分隔, 从多种类型扩展
  interface Point4 extends Point3, Point2 {
    age: number;
  }

  let obj4: Point4 = {
    name: 'shuli',
    age: 1.4,
    x: 1,
    y: 2,
  };

  // --> 1.2 扩展类型: 通过 & 运算符定义交叉类型 - 详见 ./09.交叉类型.ts
  type Point5 = {
    name: string;
  };
  type Point6 = Point5 & {
    age: number;
  };

  let obj5: Point6 = {
    name: 'shuli',
    age: 1.4,
  };
}

// 2. 添加新字段，类型别名无法添加新字段
{
  // --> 2.1 接口添加新字段: 直接定义同名接口, 此时会智能进行合并
  interface MyWindow {
    count: number;
  }
  interface MyWindow {
    title: string;
  }
  const w: MyWindow = {
    count: 100,
    title: 'hello ts',
  };

  // --> 2.2 类型别名添加新字段: 类型别名无法添加新字段
}
