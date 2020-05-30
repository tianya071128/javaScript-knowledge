function remove(arr, item) {
  // 删除指定项
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      arr.splice(index, 1);
    }
  }
}

let uid = 0;

// dep 类
export default class Dep {
  constructor() {
    this.id = uid++;
    this.subs = []; // 所有依赖(也可称为观察这个对象的 Watcher)
  }

  addSub(sub) {
    // 增
    this.subs.push(sub);
  }

  removeSub(sub) {
    // 删
    remove(this.subs, sub);
  }

  depend() {
    // 触发添加依赖
    if (window.target) {
      window.target.addDep(this);
    }
  }

  notify() {
    // 触发依赖
    const subs = this.subs.slice();

    for (const item of subs) {
      item.update();
    }
  }
}
