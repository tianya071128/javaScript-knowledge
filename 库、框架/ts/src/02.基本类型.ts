// 字符串
let str: string = 'hello ts';

// 数字
let num: number = 20;

// 布尔
let bool = true;

/**
 * 数组:
 *  1. type[]
 *  2. Array<type>: 泛型, 后续详细介绍
 *  type: 表示一种类型
 */
let arr: number[] = [
  1, 2, 3 /** '4' -- 这样会报错(不能将类型“string”分配给类型“number”。) */,
];

let arr2: Array<string> = ['1', '2', '3'];

/**
 * 特殊类型: any -- 不进行类型检查的特殊机制 -- 最好少使用
 *   当不指定类型时, 并且 ts 无法进行类型推断时, 会默认为 any 类型. 使用 noImplicitAny 配置可以当发生这中行为时标识为错误
 */
let any1: any = [1, false, '1']; // 显示指定为 any 类型
let any2 = [1, false, '1']; // ts 会类型推断出该类型
