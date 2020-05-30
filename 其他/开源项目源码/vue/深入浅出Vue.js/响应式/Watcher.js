const bailRE = new RegExp(`[^\w.]`);
export function parsePath(path) {
  // 解析字符串读取属性操作， a.b.c 形式
  if (bailRE.test(path)) {
    return;
  }
  const segments = path.split(".");
  return function(obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      // 在这里触发数据属性的 get 拦截器函数, 收集依赖
      obj = obj[segments[i]];
    }
    return obj;
  };
}

export default class Watcher {
  constructor(vm, expOrFn, cd) {
    this.vm = vm; // 绑定所属组件
    this.deps = []; // 收集所有 dep
    this.depIds = new Set();

    if (typeof expOrFn === "function") {
      this.getter = expOrFn; // 支持函数
    } else {
      this.getter = parsePath(expOrFn); // 执行 this.getter()， 就可以触发收集依赖
    }
    this.cd = cd; // 变化后回调
    this.value = this.getter();
  }

  get() {
    // 执行依赖函数，触发收集依赖
    window.target = this;
    let value = this.getter.call(this.vm, this.vm);
    window.target = undefined;
    return value;
  }

  update() {
    // 触发依赖
    const oldValue = this.value;
    this.value = this.get(); // 再次收集依赖
    this.cb.call(this.vm, this.value, oldValue);
  }

  addDep(dep) {
    // 在这里判断是否会重复收集依赖
    const id = dep.id;
    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      this.deps.push(dep);
      // 触发 dep 收集依赖
      dep.addSub(this);
    }
  }

  /**
   * 从所有依赖项的 Dep 列表中将自己移除
   */
  teardown() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
  }
}
