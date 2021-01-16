/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-01-16 11:39:23
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-01-16 11:53:14
 */
// !1. 泛型函数 - 示例

// 使用any类型会导致这个函数可以接收任何类型的arg参数，这样就丢失了一些信息：
// 传入的类型与返回的类型应该是相同的。如果我们传入一个数字，我们只知道任何类型的值都有可能被返回。
function identity(arg: any): any {
  return arg;
}

// 注解为 number，但是函数返回却是 string, 这样就会造成后续的错误
const str: number = identity("123"); // 这个 o 的类型注解就是一个 any 类型
str.toFixed(); // 类型注解为了 number，所以可以使用 toFixed 方法


// T 表示类型变量，是一种特殊的变量，只用于表示类型而不是值
// T 帮助我们捕获用户传入的类型（例如 number），之后就可以使用过这个类型。
// !这个函数叫做泛型，不同于使用 any，它不会丢失信息
function identity2<T>(arg: T): T {
  return arg;
}

// 使用泛型函数
// 1. 明确指定 T 是 string 类型，并做为一个参数传给函数
const output: string = identity2<string>("myString"); // 这样就可以推论出 output 值为 stirng
// 2. 利用类型推论 -- 即编译器自动确定 T 的类型
const output2 = identity2("myString"); // 编译器会推论出 output2 的类型为 string 类型