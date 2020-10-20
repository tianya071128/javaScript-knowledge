// 1. 定义函数的方式 - 函数表达式和函数声明
function add(x: number, y: number): number {
  return x + y;
}

const myAdd = function(x: number, y: number): number {
  return x + y;
};

// 2. 完整函数类型 - 函数类型包含两部分：参数类型和返回值类型
const myAdd1: (x: number, y: number) => number = function(
  x: number,
  y: number
): number {
  return x + y;
};
// 2.1 参数类型 - 只要参数类型是匹配的，那么就认为它是有效的函数类型，而不在乎参数名是否正确
const myAdd2: (baseValue: number, increment: number) => number = function(
  x: number,
  y: number
): number {
  return x + y;
};
// 2.2 返回值类型 - 是函数类型的必要部分，如果没有返回值，则可定义为 void
const myAdd3: (x: number) => void = function(x: number): void {
  console.log(x);
};

// 3. 类型推断 - 不必写完整类型的注解，可通过类型推断出类型 - 此为“按上下文归类”，是类型推论的一种
const myAdd4 = function(x: number, y: number): number {
  return x + y;
};

const myAdd5: (baseValue: number, increment: number) => number = function(
  x,
  y
) {
  return x + y;
};

// 4. 可选参数和默认参数
// 4.1 可选参数 - 可选参数必须跟在必须参数后面
function myAdd6(x: number, y?: number): number {
  return x + y;
}
console.log(myAdd6(2));
// 4.2 默认参数 - 默认参数也是可选参数 - 默认参数不需要放在必须参数的后面 - 默认参数的类型可通过默认值推断出来
function myAdd7(x: number, y = 5): number {
  return x + y;
}
console.log(myAdd7(3, 3));

// 5. 剩余参数 - 与 es6 的剩余参数概念类似
function buildName(firstName: string, ...restOfName: string[]): string {
  return firstName + " " + restOfName.join("");
}

// 6. 参数解构
function myAdd8({ one, two }: { one: number; two: number }): number {
  return one + two;
}
console.log(myAdd8({ one: 2, two: 3 }));

// 7. 重载 - 根据传入不同的参数而返回不同的数据类型
// function pickCard(x): any并不是重载列表的一部分，因此这里只有两个重载：一个是接收对象另一个接收数字。 以其它参数调用 pickCard会产生错误。
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number };
function pickCard(x): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}
