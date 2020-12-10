/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-12-10 21:28:21
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-12-10 21:30:59
 */
// 测试 class
class className {
  constructor(name) {
    this.name = name;
  }

  getName() {
    console.log(this.name);
    return this.name;
  }

  setName(val) {
    console.log('设置属性');
    this.name = val;
  }
}

// 使用 let const 等
let c = new className('shuli');

const fn = () => {
  console.log('箭头函数');
}