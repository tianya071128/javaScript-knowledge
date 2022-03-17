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
  // 非空断言还可以用来解决[Error-在赋值前使用了变量]
  let num: number;
  let Num: Number;
  Num = num; // Error -- 在赋值前使用了变量“num”。ts(2454)
  Num = num!; // OK
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
 * void：从某种程度上说，void 类型像与 any 类型相反，表示没有任何类型
 */
{
  // 通常在一个函数没有返回值时，定义为 void：
  function noop(): void {}
  // 声明一个 void 类型的变量没有作用，只能为其赋予 undefined 和 null（只在--strictNullChecks未指定时）
  let a: void = undefined;

  /**
   * 一个具有 void 返回类型的上下文函数类型(type vf = () => void), 在实现时, 可以返回其他的值, 但会被忽略
   * 而一个字面的函数定义有一个 void 的返回类型时, 该函数必须不返回任何东西
   */
  // 定义类型形式:
  type vf = () => void;
  const noop3: vf = () => {
    return true; // 返回 true，但是会被忽略类型
  };
  const v1 = noop3(); // 即使返回了 true，但是 v1 的类型还是 void，此时无法对 v1 做其他操作
  // 这样就是字面的函数定义: 此时函数必须不返回任何东西
  function noop2(): void {
    return true; // error - 不能将类型“boolean”分配给类型“void”。
  }
}

/**
 * never：表示的是哪些永不存在的值的类型
 */
{
  /**
   * 值永不存在的两种情况：
   *    1. 函数执行抛出了 [异常]，那么这个函数永远不存在返回值（因为抛出异常会直接中断程序运行，这使得程序运行不到返回值那一步，即具有不可达的终点，也就永不存在返回了）；
   *    2. 函数中执行无限循环的代码（死循环），使得程序永远无法运行到函数返回值那一步，永不存在返回。
   */
  // 异常
  function err(msg: string): never {
    throw new Error(msg); // OK
  }
  // 死循环
  function loopForever(): never {
    while (true) {} // OK
  }

  // never 类型同 null(只在--strictNullChecks未指定时) 和 undefined(只在--strictNullChecks未指定时) 一样，也是任何类型的子类型，也可以赋值给任何类型
  try {
    let ne: never = (() => {
      throw new Error('异常');
    })();
    let n: number = ne; // never 类型的值可以赋值给 number 类型
  } catch {}

  // 注意：使用 never 可以避免出现新增了联合类型没有对应的实现，目的就是写出类型绝对安全的代码。
  type Foo = string | number | boolean;

  function controlFlowAnalysisWithNever(foo: Foo) {
    if (typeof foo === 'string') {
      // 这里 foo 被收窄为 string 类型
    } else if (typeof foo === 'number') {
      // 这里 foo 被收窄为 number 类型
    } else {
      // foo 在这里是 never -- 穷举所有可能性，当 Foo 新增了类型后，就会抛出错误
      const check: never = foo;
    }
  }
}

/**
 * Number、String、Boolean、Symbol：原始类型的包装对象，原始类型(number、string...)兼容你对应的对象类型，反过来包装对象不兼容原始类型
 */
{
  let num: number;
  let Num: Number;
  Num = num!; // ok
  num = Num; // ts(2322)报错
}

/**
 * Function: 描述了诸如 bind、call、apply和其他存在于 JS 中所有函数值的属性。它还有一个特殊的属性，即 Function 类型的值总是可以被调用,这些调用返回 any
 */
// 注意: 通常不要使用这一类型, 如果您需要接受任意函数但不打算调用它，则该类型() => void通常更安全。
function doSomething22(f: Function) {
  return f(1, 2, 3);
}

/**
 * object、Object、{}
 *  - Object：代表所有拥有 toString、hasOwnProperty 方法的类型，所以所有原始类型、非原始类型都可以赋给 Object。在严格模式下，null 和 undefined 类型也不能赋给 Object。
 *  - object：代表的是所有非原始类型，不能把 number、string、boolean、symbol等 原始类型赋值给 object。在严格模式下，null 和 undefined 类型也不能赋给 object。
 *  - {}：和大 Object 一样，也是表示原始类型和非原始类型的集合，并且在严格模式下，null 和 undefined 也不能赋给 {}
 *
 * 综上结论：{}、大 Object 是比小 object 更宽泛的类型（least specific），{} 和大 Object 可以互相代替，用来表示原始类型（null、undefined 除外）和非原始类型；而小 object 则表示非原始类型。
 * 参考：https://juejin.cn/post/7018805943710253086#heading-36
 */
