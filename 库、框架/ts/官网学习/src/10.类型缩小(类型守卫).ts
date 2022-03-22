/**
 * 类型缩小(类型守卫): TypeScript 遵循我们的程序可以采用的可能执行路径来分析给定位置的值的最具体的可能类型。它着眼于这些特殊检查（称为类型保护）和分配，将类型精炼为比声明的更具体的类型的过程称为缩小。
 *          简单理解, 也就是当变量类型为声明类型(具有多个类型可能性), 此时可以通过一些方式来缩小这个变量的类型范围, 用来给定位置的值更具体的可能类型
 *          记住, 就是通过一些检测手段, 将类型缩小为更具体的类型
 *
 * TypeScript 可以理解几种不同的结构来缩小范围. 如下:
 */

// 1. typeof 类型守卫 -- 使用 typeof 来缩小类型
function printAll(strs: string | string[] | null) {
  if (Array.isArray(strs)) {
    // 使用 Array.isArray 检查参数数组, 那么就会将类型缩小为 string[]
    strs.push('2');
  } else if (typeof strs === 'string') {
    // 类型缩小为 string
    strs + 'words';
  } else {
  }
}

// 2. 真值缩小: 就是利用在 if(条件)、&&、||、!、三元表达式等任何表达式中，就会判断表达式的真假
function printAll2(strs: string | string[] | null) {
  if (strs && typeof strs === 'object') {
    // 因为 typeof null 的结果也是 object, 所以我们在前面添加 && 表达式, 就可以排除掉 strs 为 null 的情况
    // 此时 strs 的类型就缩小为 string[]
    strs.push('2');
  } else if (typeof strs === 'string') {
    // 类型缩小为 string
    strs + 'words';
  } else {
  }
}

// 3. 等值缩小: 相等性检查, 如 ===、!==、== 和 != 来缩小类型。
function printAll3(strs: string | string[] | null, strs2: string | number) {
  if (strs != null && typeof strs === 'object') {
    // 使用 != 排除 strs 为 null 和 undefined 的情况
    // 此时 strs 的类型就缩小为 string[]
    strs.push('2');
  } else if (strs === strs2) {
    strs; // (parameter) strs: string -- 因为 strs 和 strs2 的类型只有 string 相同, 并且 === 要求类型相同, 所以 ts 就会判断 strs 为 string 类型
  }
}

// 4. in 操作符缩小: 使用 in 操作符, 用于确定一个对象是否具有带指定名称的属性.
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    // 只有 Fish 类型才具有 swim 属性, 所以这里类型就会被缩小为 Fish 类型
    return animal.swim();
  }

  // 因为在上面 return 了,也就排除了 Fish 类型, 此时只可能是 Bird 类型, 直接调用 fly 方法是安全的
  return animal.fly();
}

// 5.instanceof 操作符缩小: 与 in 操作符类似, 检查一个值是否是另一个值的“实例”。
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString()); // (parameter) x: Date -- 判断了 x 是否是 Date 实例
  } else {
    console.log(x.toUpperCase()); // (parameter) x: string
  }
}

// 6. 分配缩小: 当一个变量具有多种类型可能时, 当我们为任何变量赋值时，TypeScript 会查看赋值的右侧并适当地缩小左侧。
let a = Math.random() < 0.5 ? 10 : 'hello world!'; // 此时 a 会被推断为 string | number
a = 1; // 此时重新赋值为 1, 当后续使用这个变量时, 就会判定这个变量为 number -- 注意: 在这里还是 string | number
console.log(a); // let a: number

a = 'goodbye!'; // 同理, 赋值为 string
console.log(a); // let a: string

// a = true; // 不能将类型“boolean”分配给类型“string | number” -- 不能赋值为变量范围外的

// 7. 控制流分析: ts 能够进行代码分析, 当分析一个变量时，控制流可以一次又一次地分裂和重新合并，并且可以观察到该变量在每个点具有不同的类型
//               这种基于可达性的代码分析称为控制流分析，TypeScript 在遇到类型保护和赋值时使用这种流分析来缩小类型。
function example() {
  let x: string | number | boolean;

  x = Math.random() < 0.5;

  console.log(x); // let x: boolean; -- 此时, x 会被赋值为 boolean, 所以 x 此时类型为 boolean

  if (Math.random() < 0.5) {
    x = 'hello'; // 赋值为 string
    console.log(x); // let x: string; -- 此时 x 的类型为 string
  } else {
    x = 100; // 赋值为 number
    console.log(x); // let x: number; -- 此时 x 的类型为 number
  }

  return x; // let x: string | number; -- 在这里, 根据上面 if 语句, x 只有两种可能, 就是 string 或者 number, 所以此时类型为 string | number
}

// 8. 类型谓词: 上述都是使用 JS 现有的结构来缩小类型, ... https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

// 9. never 类型 和 穷尽性检查 ...
type Shape = number | string;

function getArea(shape: Shape) {
  switch (typeof shape) {
    case 'number':
      return Math.PI * shape ** 2;
    case 'string':
      return shape;
    default:
      // 只要联合类型还是 number | string，就不会走到这里来。
      // 如果向联合类型中添加新成员就会导致错误
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
