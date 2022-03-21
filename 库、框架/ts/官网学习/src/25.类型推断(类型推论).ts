/**
 * 在没有明确指出类型的地方, 类型推断会尝试推断出类型
 * 这种推断发生在初始化变量和成员, 设置默认参数值和决定函数返回值时
 */
let x = 3; // 变量 x 的类型被推断为数字
let x2 = [0, 1, null]; // 变量 x2 的类型被推断为 (number | null)[]

/**
 * 上下文归类：按上下文归类会发生在表达式的类型与所处的位置相关时
 *
 *  简单理解，有些函数可以根据上下文来推断出参数和返回值类型，但如果函数位置的上下文位置不对就无法进行推断
 */
// window.onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null; 类型定义，此时就可以类型推断出
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button); //<- OK
  console.log(mouseEvent.kangaroo); //<- Error!
};
// 但是如果这个函数不在上下文归类的位置上，那么这个函数的参数类型将隐式的成为any类型
const handler = function (uiEvent /** 参数“uiEvent”隐式具有“any”类型。 */) {
  console.log(uiEvent.button); //<- OK
};
window.onmousedown = handler;

// 也可发生在回调函数中
{
  const arr = [2, 3, 4];

  arr.forEach(
    (
      item /** (parameter) item: number */,
      index /** (parameter) index: number */
    ) => {}
  );
}

/**
 * let 和 const 分析
 */
{
  // 当使用 const 定义不可变更常量时，类型推断为字面量类型，这是合理的，因为这些变量无法改变
  const str = 'this is string'; // str: 'this is string'
  const num = 1; // num: 1
  // 当使用 let 定义变量时，类型推断为字面量类型的父类型，比如 str 的类型是 'this is string' 类型（这里表示一个字符串字面量类型）的父类型 string，num 的类型是 1 类型的父类型 number。
  let str2 = 'this is string'; // str: string
  let num2 = 1; // num: number

  // 而当使用 const 定义复杂数据类型时，类型推断会推断为数组类型，因为 const 复杂类型也会可以添加值的
  const arr = [1, 2, 3]; // number[]
  // 此时可以通过 as const 断言为只读数据，类型推断就会收窄
  const arr2 = [1, 2, 3] as const; // readonly [1, 2, 3]
}
