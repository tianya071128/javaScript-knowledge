// 联合类型是由两种或多种其他类型组成的类型，表示可能是这些类型中的任何一种的值。
function printId(id: number | string) {
  // console.log(id.toUpperCase()); // 因为 number 不具有 toUpperCase 方法, 所以这里会报错, 此时可以缩小联合，就像在没有类型注释的 JavaScript 中一样。
  typeof id === 'string' && console.log(id.toUpperCase()); // 首先判断类型
}

let arr3: (string | number)[] = [1, 2, '3'];

// arr3.push(false); // 抛出错误: 类型“boolean”的参数不能赋给类型“string | number”的参数。
