/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-01-14 20:03:38
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-01-14 20:36:45
 */
// !函数声明
function fn(a: string, b: string): string {
  return a + b;
}

// !函数表达式
let fn2: (a: string, b: string) => string = function (a: string, b: string): string {
  return a + b;
}

// !可选参数
function fn3(name: string, age?: number): string {
  return name + age;
}

// !默认参数
function fn4(a: string, b: string = '2'): string {
  return a + b;
}

// !剩余参数
const fn5 = function (a: string, ...list: string[]): void { }

// !函数重载
function fn6(name: string): string;
function fn6(age: number): number;
function fn6(str: any): any {
  return 'str';
}

fn6('true');

const fn7 = function (a: number | { a: 2 }[]): number | string[] | void {
  if (typeof a === 'number') {
    return 1;
  } else if (Array.isArray(a)) {
    return ['1'];
  }
}

