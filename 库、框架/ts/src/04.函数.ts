/**
 * 函数
 */

// 参数类型, 一般而言需要明确函数参数的类型, 否则的话会被默认推断为 any -- 如果设置了 noImplicitAny 或 strict 开启了严格模式, 那么就会发出错误(参数“name”隐式具有“any”类型。)
function greet1(name: string) {
  console.log('Hello, ' + name.toUpperCase() + '!!');

  return 26;
}

// 返回类型注解, 通常可以不需要返回类型注解, 因为会根据 return 语句推断函数的返回类型
function greet2(name: string): number {
  console.log('Hello, ' + name.toUpperCase() + '!!');

  return 26;
}
