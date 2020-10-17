/**
 * 类型注解：即明确定义变量的类型
 */
const str: string = "2";

/**
 * 类型推断（类型推论）：在没有类型注解的情况下，ts 会自动尝试去推断变量的类型
 */
const countInference = 123; // => ts 会推断出变量类型为 number

// 如果 one 和 two 不类型注解的话，函数返回值就不能够推断出类型
function getTotal(one: number, two: number) {
  return one + two;
}
// 此时 total 的值就会被推断为 number，但是
const total = getTotal(1, 2);

// 此时也可以类型推断
const XiaoJieJie = {
  name: "刘英",
  age: 18
};

/**
 * 工作使用问题
 * 1. 如果 TS 能够自动分析变量类型， 我们就什么也不需要做了
 * 2. 如果 TS 无法分析变量类型的话， 我们就需要使用类型注解
 */
// 在写 TypeScript 代码的一个重要宗旨就是每个变量，每个对象的属性类型都应该是固定的，
// 如果你推断就让它推断，推断不出来的时候你要进行注释。
