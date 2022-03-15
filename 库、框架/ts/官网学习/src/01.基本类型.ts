export type module = number; // 使其变成模块，独立作用域
/**
 * 原始数据类型：对应 JS 的基本类型 -- 布尔值、数值、字符串 以及 ES6 中的新类型 Symbol 和 ES10 中的新类型 BigInt。
 */
{
  // 字符串
  let str: string = 'hello ts';
  // 数字
  let num: number = 20;
  // 布尔
  let bool = true;
  // Symbol
  let s: symbol = Symbol('name');
  // BigInt
  let b: bigint = BigInt(100);
  let b2: bigint = 100n;
}

/**
 * undefined 和 null
 */
{
  let u: undefined = undefined;
  let n: null = null;
  /**
   * 默认情况下，null 和 undefined 是所有的子类型。也就是说可以把 null 和 undefined 赋值给其他类型的变量
   * 但是，当指定了 strictNullChecks 为 true 时，会更严格对待，null和undefined只能赋值给any和它们各自的类型（有一个例外是undefined还可以赋值给void类型）。
   */
  let u2: number = undefined; // 当 strictNullChecks 标识为 false 时，此时不会报错 -- 当标识为 true 时(或 strict 标识为 true)，会抛出错误(不能将类型“undefined”分配给类型“number”。ts(2322))
  /**
   * 非空断言运算符（后缀!）
   *  - 在任何表达式之后写!实际上是一个类型断言(注意这是 ts 的特性，编译后会被删除)
   *  - 这种判断是基于用户提供给 ts 的,而不是 ts 推断出的
   */
  function liveDangerously(x?: number | null) {
    // No error
    console.log(x!.toFixed()); // x! -- 表示 x 变量不会是一个 undefined 或 null
    // Math.PI * shape.radius! ** 2; -- 只需要在表达式后加 ! 表示这个表达式的结果不是 undefined 或 null 即可
  }
}

/**
 * any: 不进行类型检查的特殊机制 -- 最好少使用
 */
{
  /**
   * 当不清楚类型的情况下(可能来自于动态内容或用户输入或第三方库)，此时可以指定 any 类型对这些值不进行类型检查
   * 此时变量就像 JS 中一样灵活
   */
  let notSure: any = 4;
  notSure = 'maybe a string instead'; // 像 JS 一样高，变量可以赋予任何类型的值
  notSure.ifItExists(); // 做任何操作都是通过的
  /**
   * 当不指定类型时, 并且 ts 无法进行类型推断时, 会默认为 any 类型
   * 可以指定 noImplicitAny 配置可以当发生这种行为时标识为错误
   */
  function test(a) {} // 参数“a”隐式具有“any”类型。ts(7006)
  /**
   * 使用场景：当只知道一部分数据的类型时，any 类型会比较有用
   */
  interface APIReturn {
    prop1: string;
    [prop: string]: any; // 如果通过接口返回的数据，可能会有多个属性，此时定义一个索引签名
  }
  let list: any[] = [1, true, 'free']; // 数组中可以存在未知类型的值
}

/**
 * unkonwn：代表任何值. 类似于any类型，但更安全，因为对未知 unknown 值做任何事情都是不合法的
 */
{
  /**
   * unknown 与 any 一样，所有类型都可以分配给 unknown
   */
  let notSure: unknown = 4;
  notSure = 'maybe a string instead'; // 重新分配为 string，合法的

  /**
   * 对 unkonwn 的值进行操作都是不合法的
   */
  notSure.split('/'); // Error(对象的类型为 "unknown"。ts(2571)) -- 不能进行操作

  /**
   * 对 unknown 类型操作可以通过类型缩小，或类型断言来进行操作
   */
  // 直接使用
  notSure.toLowerCase(); // Error
  // typeof -- 类型缩小为 string 类型
  if (typeof notSure === 'string') {
    notSure.toLowerCase(); // OK
  }
  // 类型断言 -- 断言为 string 类型
  (notSure as string).toLowerCase(); // OK
}

/**
 * any 和 unkonwn 的区别
 */
{
  // 1. 任何类型的值都可以赋值给 any，any 类型的值也可以赋值给任何类型 -- 但是 unkonwn 是任何类型的值都可以赋值给它，但它只能赋值给 unknown 和 any
  let notSure: unknown = 4;
  let uncertain: any = notSure; // OK -- unknown 可以赋值给 any

  let notSure2: any = 4;
  let uncertain2: unknown = notSure2; // OK -- any 的值也可以赋值给 unknown

  let notSure3: unknown = 4;
  let uncertain3: number = notSure3; // Error -- unknown 的值只能赋值给 unknown 和 any

  // 2. 对 any 类型做任何操作都是合法的 -- 但是对 unknown 值做任何事情都是不合法的
  uncertain.b(); // OK -- 对 any 的操作合法
  notSure.b(); // Error -- 不能对 unknown 的值直接进行操作
}

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
