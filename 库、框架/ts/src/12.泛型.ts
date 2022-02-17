/**
 * 泛型: 设计泛型的关键目的是在成员之间提供有意义的约束，这些成员可以是：类的实例成员、类的方法、函数参数和函数返回值。
 *       也就是一种带参数的类型
 * 参考: https://juejin.cn/post/6844904184894980104
 */

/**
 * 泛型函数: 可以在定义函数时定义类型参数, 就像传递参数一样，我们传递了我们想要用于特定函数调用的类型, 这些类型参数, 可以用在函数参数和函数返回值上.
 *          当调用这个泛型函数时, 可以像参数一样传递类型. -- https://www.typescriptlang.org/docs/handbook/2/functions.html#generic-functions
 */
function fanxinFn<T1, T2>(arg1: T1, arg2: T2): T1 {
  return arg1;
}

// 调用方式1: 将所有参数(包括类型参数)传递给函数:
let output = fanxinFn<string, number>('myString', 132); // 此时由我们决定: T1 为 string, T2 为 number
// 调用方式2: 使用类型参数推断 - 让 ts 编译器自动推断类型参数
let output2 = fanxinFn('myString', 132); // 此时编译器会类型推断: T1 为 string, T2 为 number

/**
 * 泛型接口(类型别名也类似定义): 也可以定义一个泛型接口 -- https://www.typescriptlang.org/docs/handbook/2/objects.html#generic-object-types
 */
// 这样的泛型接口中的 类型<Type> 是应用在整个接口中的, 那么在下面使用的时候必须先传递类型进来
interface FanXin<Type> {
  prop: Type;
}

let myIdentity: FanXin<number> = { prop: 123 }; // 必须传递一个类型参数给接口使用, 否则会抛出错误(泛型类型“FanXin<Type>”需要 1 个类型参数。)

/**
 * 泛型约束: 能够对类型参数进行约束
 */
// 1. 确保属性的存在
interface Length {
  length: number;
}

// 此时类型参数 T 就需要满足 Length 接口
function identity<T extends Length>(arg: T): T {
  console.log(arg.length); // 可以获取length属性
  return arg;
}
