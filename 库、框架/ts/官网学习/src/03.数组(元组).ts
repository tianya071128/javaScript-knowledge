/**
 * 数组: 数组类型有多种定义方式，比较灵活
 */
{
  // 1. type[] 形式 --> type 可以是类型别名或联合类型 --> 实际上，这种不过 Array<type> 形式的简写
  let arr: number[] = [
    1, 2, 3 /** '4' -- 这样会报错(不能将类型“string”分配给类型“number”。) */,
  ];

  // 2. Array<type> 泛型形式
  let arr2: Array<string> = ['1', '2', '3']; // 注意: Array 本身就是一个泛型类型(可以跳转到 Array 的定义)

  // 3. 接口形式 - 一般不使用这个形式，但可以用来表示类数组
  interface NumberArray {
    [index: number]: number; // 表示数值索引，值为 number
  }
  let fibonacci: NumberArray = [1, 1, 2, 3, 5];
  interface Arguments {
    [index: number]: number;
    length: number;
    callee: Function;
  }
  function sum() {
    let args: Arguments = arguments; // 使用接口可以用来定义类数组
  }
}

/**
 * ReadonlyArray 类型：用于描述不应更改的数组
 *
 *  注意：这是 TS 增强的类型，并不是 ES 的语法，所以无法使用 new 构建
 */
{
  const roArray: ReadonlyArray<string> = ['red', 'green', 'blue'];
  roArray.push('test'); // 类型“readonly string[]”上不存在属性“push”。
  // or readonly Type[] 简写方式
  const roArray2: readonly string[] = ['red', 'green', 'blue'];
}

/**
 * 元祖类型：是另一种类型Array，它确切地知道它包含多少个元素，以及它在特定位置包含哪些类型。
 */
{
  const tuple: [string, number] = ['1', 2];
  // 1. 元祖的可选属性
  const tuple2: [string, number, number?] = ['1', 2, 2];
  tuple2.length; // (property) length: 2 | 3
  // 2. 元祖的剩余元素
  type StringNumberBooleans = [string, number, ...boolean[]];
  type StringBooleansNumber = [string, ...boolean[], number];
  // 3. 只读元祖类型
  const tuple3: readonly [string, number] = ['1', 2];
  tuple3[0] = '2'; // 无法分配到 "0" ，因为它是只读属性。
}
