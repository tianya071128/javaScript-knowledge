/**
 * 函数:
 *  1. 参数类型: 一般而言需要明确函数参数的类型, 否则的话会被默认推断为 any -- 如果设置了 noImplicitAny 或 strict 开启了严格模式, 那么就会发出错误(参数“name”隐式具有“any”类型。)
 *  2. 返回类型: 通常可以不需要返回类型注解, 因为会根据 return 语句推断函数的返回类型
 *  3. 可选参数: 使用 ? 标识参数为可选参数 ==> (parameter?: type)
 *              --> 注意: 可选参数会默认添加一个 undefined 类型, 例如 (parameter) someArg2: number | undefined
 *              --> 注意: 可选参数与默认参数不可以同时定义(并且只允许在函数或构造函数实现中使用参数初始化表达式)
 *                        例如 function fn2(someArg?: number = 100) {} // error: 参数不能包含问号和初始化表达式。
 *              --> 注意: 为回调编写函数类型时，切勿编写可选参数，除非您打算在不传递该参数的情况下调用该函数
 *
 *  4. this 声明: 第一个 this 不会被当成形参
 *  5. rest 参数(形参展开运算符): 使用 (...parameter: type), 这个 type 必须是 Array<T> 或 T[] 或 元组类型
 */
{
  // demo
  function fnDemo(
    a: string /** 参数类型注释 */,
    b?: number /** 可选参数 */,
    ...m: number[] /** rest 参数 */
  ): number {
    return 1;
  }

  // this 声明 - demo
  function ceshi(this: { ceshi: number }, x: number) {
    const fn = () => {
      console.log(this.ceshi);
    };
    fn();
  }
  ceshi.bind({ ceshi: 123 })(1);
  ceshi.call({ ceshi: 456 }, 2);

  // 实参展开运算符 - demo
  const args = [8, 5];
  // 因为 Math.atan2 定义为接收两个参数, 而 args 类型定义为 number[], 可能会存在多个参数
  const angle = Math.atan2(...args); // error -- 扩张参数必须具有元组类型或传递给 rest 参数。

  const args2 = [8, 5] as const; // 类型断言一下, 此时类型为 readonly [8, 5], 只存在两个项就可以解决这个问题 -- 这种情况的最佳解决方案取决于您的代码, 不限于这一种方式
  const angle2 = Math.atan2(...args2);
}

/**
 * 函数类型表达式: 用于表示函数类型, 语法类似于箭头函数形式, 为:  (parameter: type, ...)  => type(没有返回值为 void)
 */
{
  type fnType = (a: string) => void;
  // type fn = (a) => void; // 如果未指定参数类型，则它是隐式的 any, 在开启了 noImplicitAny 严格模式的话,会抛出错误
  let fn: fnType = function (asa: string) {}; // 定义的参数名称和实际的参数名称可以不一致
}

/**
 * 使用 类型别名(type) 或 接口 定义一个函数:
 * 1. 调用签名: 在 JS 中函数也是一个对象, 也可以拥有属性, 所以在对象类型中编写调用签名 ==> (parameter: type, ...): type
 * 2. 构造签名: 该函数可以使用 new 操作符调用 ==> new (parameter: type, ...): type
 */
{
  type DescribableFunction = {
    description: string; // 函数属性
    (someArg: number, someArg2?: number): boolean; // 调用签名: 表示这个函数参数和返回值类型
    new (s: string): any; // 可以与调用签名同时使用, 此时一些函数既可以直接调用, 也可以 new 调用
  };
  function doSomething(fn: DescribableFunction) {
    console.log(fn.description + ' returned ' + fn(6));
  }
}

/**
 * 泛型函数: 当函数输入的类型与输出的类型相关 -- https://www.typescriptlang.org/docs/handbook/2/functions.html#generic-functions
 */

/**
 * 函数重载: JS 中可以根据参数数量不同实现不同的功能, 在 ts 中, 可以编写重载签名来指定一个可以以不同方式调用的函数
 */
{
  function makeDate(timestamp: number): Date; // 重载签名 -- 重载签名是用来定义该函数的实现方式
  function makeDate(m: number, d: number, y: number): Date; // 重载签名
  /**
   * 实现签名 -- 是用来实现函数的代码, 需要与重载签名相兼容
   *            注意: 实现签名的参数需要与重载签名相兼容, 例如这个例子中, 实现签名的第一个参数为 number, 如果定义了第二个参数就需要定义第二个参数, 并且应该是可选参数
   *                  但是可以添加更多参数或不添加参数, 例如: function makeDate() {} 或 function makeDate(mOrTimestamp: number, d?: number, y?: number, z?: string): Date {} 都是合法的
   */
  function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
    if (d !== undefined && y !== undefined) {
      return new Date(y, mOrTimestamp, d);
    } else {
      return new Date(mOrTimestamp);
    }
  }

  // 在上面示例中, 有两个重载签名, 那么函数调用需要与定义的重载类型相同, 也就是要不一个参数, 要不三个参数
  const d1 = makeDate(1);
  const d2 = makeDate(5, 6, 7);
  // const d3 = makeDate(5, 9); // 抛出错误: 没有需要 2 参数的重载，但存在需要 1 或 3 参数的重载。

  // 注意: 尽可能使用联合类型的参数而不是重载!!! -- https://www.typescriptlang.org/docs/handbook/2/functions.html#writing-good-overloads
}
