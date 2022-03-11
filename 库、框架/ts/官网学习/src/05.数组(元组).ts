/**
 * 数组: 数组类型有多种定义方式，比较灵活
 */
// 1. type[] 形式 --> type 可以是类型别名或联合类型
let arr: number[] = [
  1, 2, 3 /** '4' -- 这样会报错(不能将类型“string”分配给类型“number”。) */,
];

// 2. Array<type> 泛型形式
let arr2: Array<string> = ['1', '2', '3'];

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
