/**
 * ts 的类型系统不止定义的类型(boolean、string、number、any等等), 还允许从其他类型中来表达类型, 根据现有类型或值来表达新类型的方法。
 */

/**
 * 1. 泛型: 带参数的类型 -- 见 ./12.泛型.ts
 */

/**
 * 2. Keyof 类型运算符 - 使用 keyof 运算符创建新类型: 用于获取某种类型的所有键，其返回类型是联合类型。
 */
type Point7 = { x: number; y: number };
type P = keyof Point7; // 此时类型 P 相当于联合类型 "x" | "y"
const p: P = 'x';

// 当类型具有 string 或 number 索引签名, keyof 则返回这些类型
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish; // type A = number

// 当具有 string 索引签名时, 此时 keyof 获取到的是 string | number --> 这是因为 JavaScript 对象键始终强制转换为字符串，因此 obj[0] 始终与 obj["0"] 相同.
type Mapish = { [k: string]: boolean };
type M = keyof Mapish; // type M = string | number

/**
 * 3. Typeof 类型运算符 - 使用typeof运算符创建新类型: 用来获取一个变量声明或对象的类型
 *
 *    --> 在 JS 中已经存在一个 typeof 运算符, 是在 JS 表达式上下文中使用的
 *    --> 而在 TS 中的 typeof 运算符, 是在 TS 的类型上下文中使用它来引用变量或属性的类型
 */
interface Person2 {
  name: string;
  age: number;
}

const sem: Person2 = { name: 'semlinker', age: 33 };
type Sem = typeof sem; // -> Person2

function toArray(x: number): Array<number> {
  return [x];
}

type Func = typeof toArray; // -> (x: number) => number[]
