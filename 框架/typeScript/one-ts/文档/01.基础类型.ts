// 1. 布尔值 - 与 js 中的 boolean 一样
const isDone: boolean = false;

// 2. 数字 - 与 js 中的 number　一样，并没有细分浮点数，整数
const decLiteral: number = 2;

// 3. 字符串 - 与 js 中的 string 一样，支持单引号和双引号以及模板字符串、
const sentence: string = `${decLiteral}222`;

// 4. Null 和 Undefined - 与 js 中的类似，它们的本身的类型用处不是很大
const u: undefined = undefined;
const n: null = null;

// 5. 数组 - 有两种方式可以定义数组
// 5.1 - 在元素类型后面接上 [], 表示由此类型元素组成的一个数组：
const list: number[] = [1, 2, 3];
// 5.2 - 使用数组泛型，Array<元素类型>
const list2: Array<number> = [1, 2, 3];

// 6. Object -
const obj: {
  name: string;
  age: number;
} = {
  name: "红",
  age: 20
};

// 7. void - 与 any 类型相反，表示没有任何类型。
// 7.1 常用于函数没有返回值的情况
function warnUser(): void {
  console.log("This is my warning message");
}
// 7.2 声明一个 void 类型的变量是没有多大用处的，因为只能赋予 unll 和 undefined
const unusable: void = undefined;

console.log(isDone, decLiteral, sentence, u, n, list, list2, obj);
