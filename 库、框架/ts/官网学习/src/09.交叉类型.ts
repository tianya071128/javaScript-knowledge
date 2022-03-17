/**
 * 交叉类型: 主要用于组合现有的对象类型, 使用 & 运算符定义交叉类型
 */
interface Colorful {
  color: string;
}
type Circle = {
  radius: number;
};

type ColorfulCircle = Colorful & Circle; // 交叉类型可以是 interface 接口或 type 类型别名

// 或者使用匿名方式定义类型
function draw(circle: Colorful & Circle) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}

/**
 * 交叉类型的多个类型存在同名属性时，情况如下：
 */
// 1. 同名属性不兼容
{
  // 定义交叉类型时不会抛出错误，但是应该 name 属性不可能是同时是 string 和 number，所以 name 被推断为 never 类型，相当于一个无用类型
  type IntersectionTypeConfict = { id: number; name: string } & {
    age: number;
    name: number;
  };
  const mixedConflict: IntersectionTypeConfict = {
    id: 1,
    name: 2, // ts(2322) 错误，'number' 类型不能赋给 'never' 类型
    age: 2,
  };
}
// 2. 同名属性兼容
{
  // 此时 name 属性一个是字面量类型 2，一个是 number 类型，数字字面量类型是数字类型的子类型，所以会被推断为字面量类型 2
  type IntersectionTypeConfict = { id: number; name: 2 } & {
    age: number;
    name: number;
  };
  let mixedConflict: IntersectionTypeConfict = {
    id: 1,
    name: 2, // ok -- 只能赋值为 2
    // name: 22, // Error -- 不能将类型“22”分配给类型“2”。ts(2322)
    age: 2,
  };
}
// 3. 同名属性是非基本数据类型
{
  interface A {
    x: { d: true };
  }
  interface B {
    x: { e: string };
  }
  interface C {
    x: { f: number };
  }
  // 此时同名属性同样就进行深度交叉
  type ABC = A & B & C;
  let abc: ABC = {
    x: {
      d: true,
      e: '',
      f: 666,
    },
  };
}
