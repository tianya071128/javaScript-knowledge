/**
 * 字面量类型是一个集体类型中更为具体的一种“子类型”，目前有三种字面量类型：字符串、数字和布尔值
 */
{
  // 定义单个字面量值
  let specifiedStr: 'this is string' = 'this is string';
  let specifiedNum: 1 = 1;
  let specifiedBoolean: true = true;
  let str: string = specifiedStr; // 字符串字面量类型是字符串的子类型，所以可以赋值给字符串类型
}

/**
 * 定义单个的字面量类型并没有多大用处，它真正的应用场景是可以把多个字面量类型组合成一个联合类型（后面会讲解），用来描述拥有明确成员的实用的集合。
 */
{
  type Direction = 'up' | 'down';

  function move(dir: Direction) {
    // ...
  }
  move('up'); // ok
  move('right'); // ts(2345) 类型“"right"”的参数不能赋给类型“Direction”的参数。
}
