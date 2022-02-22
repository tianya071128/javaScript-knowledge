/**
 * 字符串
 */
let str: string = 'hello ts';

/**
 * 数字
 */
let num: number = 20;

/**
 * 布尔
 */
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
 * undefined or null
 */
let u: undefined = undefined;
let n: null = null;
// 非空断言运算符（后缀!） -- 在任何表达式之后写!实际上是一个类型断言(注意这是 ts 的特性)
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed()); // x! -- 表示 x 变量不会是一个 undefined 或 null, 这种判断是基于用户提供给 ts 的,而不是 ts 推断出的
  // Math.PI * shape.radius! ** 2; -- 只需要在表达式后加 ! 表示这个表达式的结果不是 undefined 或 null 即可
}

/**
 * 特殊类型: any -- 不进行类型检查的特殊机制 -- 最好少使用
 *   当不指定类型时, 并且 ts 无法进行类型推断时, 会默认为 any 类型. 使用 noImplicitAny 配置可以当发生这中行为时标识为错误
 */
let any1: any = [1, false, '1']; // 显示指定为 any 类型
let any2 = [1, false, '1']; // ts 会类型推断出该类型

/**
 * 特殊类型: 在函数上下文中经常出现, 在其他地方也可以使用
 */

// 1. void: 不返回值的函数的返回值 -- 注意: 在 js 中, 不返回任何值的函数将隐式返回 undefined. 但是在 ts 中, void 和 undefined 并不是一回事
function noop() {
  return; // 只要函数没有任何 return 语句，或者没有从这些返回语句返回任何显式值，就会被推断为 void 类型
}
// 一个具有 void 返回类型的上下文函数类型(type vf = () => void), 在实现时, 可以返回其他的值, 但会被忽略
// 而一个字面的函数定义有一个 void 的返回类型时, 该函数必须不返回任何东西.
// 定义类型形式:
type vf = () => void;
const noop3: vf = () => {
  return true; // 这样就可以了
};
const v1 = noop3(); // const v1: void -- 类型推断为 void 类型, 做其他操作就会报错了
// 这样就是字面的函数定义: 此时函数必须不返回任何东西
function noop2(): void {
  return true; // error - 不能将类型“boolean”分配给类型“void”。
}

// 2. object: 是指上任何不是原始值（string、number、bigint、boolean、symbol、null或undefined）的值
const objTest: object = {}; // 最好不要使用 object 类型, 不明确

// 3. unknown: 代表任何值. 类似于any类型，但更安全，因为对未知 unknown 值做任何事情都是不合法的
const unknown1: unknown = '123';
unknown.b(); // error -- unknown 不能做任何操作
const any3: any = '123';
any3.b(); // OK --  any 类型任何操作都是合法的
// 在定义函数返回未知类型值时使用 -- 下面示例中, 返回值可能是任意类型, 此时应该由调用位置来决定类型
function safeParse(s: string): unknown {
  return JSON.parse(s);
}

const obj222 = safeParse('123') as string; // 可以通过类型断言来断言该类型

// 4. never: 表示永远不会被观察到的值 -- 在返回类型中，这意味着函数抛出异常或终止程序的执行。
function fail(msg: string): never {
  throw new Error(msg);
}
// never 也在缩小联合类型时表示不可能到达的地方
function fn222(x: string | number) {
  if (typeof x === 'string') {
    // do something
  } else if (typeof x === 'number') {
    // do something else
  } else {
    x; // has type 'never'! 这里, 不会被到达
  }
}

// 5. Function: 描述了诸如 bind、call、apply和其他存在于 JS 中所有函数值的属性。它还有一个特殊的属性，即 Function 类型的值总是可以被调用,这些调用返回 any
//              注意: 通常不要使用这一类型, 如果您需要接受任意函数但不打算调用它，则该类型() => void通常更安全。
function doSomething22(f: Function) {
  return f(1, 2, 3);
}

/**
 * 不太常用的原语: bigint(es2020) - 非常大的整数、symbol(es6)
 */
let oneHundred: bigint = BigInt(100);
let twoHundred: bigint = 100n; // 语法与 BigInt 等同

let firstName = Symbol('name');
let secondName = Symbol('name');
