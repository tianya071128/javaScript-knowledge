/**
 * ts 的类型系统不止定义的类型(boolean、string、number、any等等), 还允许从其他类型中来表达类型, 根据现有类型或值来表达新类型的方法。
 */

/**
 * 1. 泛型: 带参数的类型 -- 见 ./12.泛型.ts
 */

/**
 * 2. Keyof 类型运算符 - 使用 keyof 运算符创建新类型: 用于获取某种类型的所有键，其返回类型是联合类型。
 */
{
  type Point7 = { x: number; y: number };
  type P = keyof Point7; // 此时类型 P 相当于联合类型 "x" | "y"
  const p: P = 'x';

  // 当类型具有 string 或 number 索引签名, keyof 则返回这些类型
  type Arrayish = { [n: number]: unknown };
  type A = keyof Arrayish; // type A = number

  // 当具有 string 索引签名时, 此时 keyof 获取到的是 string | number --> 这是因为 JavaScript 对象键始终强制转换为字符串，因此 obj[0] 始终与 obj["0"] 相同.
  type Mapish = { [k: string]: boolean };
  type M = keyof Mapish; // type M = string | number
}

/**
 * 3. Typeof 类型运算符 - 使用typeof运算符创建新类型: 用来获取一个变量声明或对象的类型
 *
 *    --> 在 JS 中已经存在一个 typeof 运算符, 是在 JS 表达式上下文中使用的
 *    --> 而在 TS 中的 typeof 运算符, 是在 TS 的类型上下文中使用它来引用变量或属性的类型
 */
{
  interface Person2 {
    name: string;
    age: number;
  }

  const sem: Person2 = { name: 'semlinker', age: 33 };
  type Sem = typeof sem; // -> Person2

  function toArray(x: number, y: number): Array<number> {
    return [x];
  }

  type Func = Parameters<typeof toArray>; // -> [x: number, y: number] -->
}

/**
 * 4. 索引访问类型 - 使用Type['a']语法访问类型的子集: 类似于对象属性读取
 */
{
  // demo1
  type Person3 = { age: number; name: string; alive: boolean };
  type Age = Person3['age']; // type Age = number
  type I1 = Person3['age' | 'name']; // type I1 = string | number
  type I2 = Person3[keyof Person3]; // type I2 = string | number | boolean
  type AliveOrName = 'alive' | 'name';
  type I3 = Person3[AliveOrName]; // type I3 = string | boolean
  type I4 = Person['alve']; // 尝试索引不存在的属性, 会抛出错误 - 类型“Person”上不存在属性“alve”。

  // demo2: 用于获取数组元素的类型
  const MyArray = [
    { name: 'Alice', age: 15 },
    { name: 'Bob', age: 23 },
    { name: 'Eve', age: 38 },
  ];
  type Person4 = typeof MyArray[number]; // 读取出数组元素的类型 --> type Person4 = { name: string; age: number;}
  type Age2 = typeof MyArray[number]['age']; // 读取出数组元素类型继续读取类型子集 --> type Age2 = number
}

/**
 * 5. 条件类型 - 有时需要根据输入做出类型判断，条件类型有助于描述输入和输出类型之间的关系
 *
 *      语法：T extends U ? X : Y
 */
{
  type NameOrId<T extends number | string> = T extends number ? number : string;
  function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
    throw 'unimplemented';
  }
  let a = createLabel('typescript'); // string
  let b = createLabel(2.8); // number
  let c = createLabel(Math.random() ? 'hello' : 42); // number | string --> 参数可能是 number | string，需要运行时才能确定参数类型

  // infer：在条件类型中提取新类型，例如这个 TS 提供的工具类型
  type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
}

/**
 * 6. 映射类型：根据传入的类型创建出新的类型，建立在索引签名的语法之上，用来遍历键以创建类型
 */
{
  type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean; // keyof Type -- 获取 Type 所有的键   --> in 表示遍历 (keyof Type) 键
  };
}

/**
 * 模板文字类型：建立在字符串文字类型之上，并且能够通过联合扩展成许多字符串。
 *  语法与 JS 的模板字符串一样，但是 TS 是用来创建模板字符串的
 */
{
  type World = 'world';

  type Greeting = `hello ${World}`;
}
