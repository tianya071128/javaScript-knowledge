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

// 处理深度监听
const seenObjects = new Set();
function traverse(val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}
function _traverse(val, seen) {
  let i, keys;
  const isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    // val 不是数组或对象，又或者已经被冻结
    return;
  }

  if (val.__ob__) {
    // 深度监听时，防止收集重复依赖
    const depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }

  if (isA) {
    i = val.length;
    while (i--) _traverse(val[i], seen);
  } else {
    keys = Object.keys(val);
    i = keys.length;
    // val[keys[i]] 会触发属性的 getter，从而触发收集依赖
    while (i--) _traverse(val[keys[i]], seen);
  }
}

export default class Watcher {
  constructor(vm, expOrFn, cd) {
    this.vm = vm; // 绑定所属组件
    this.deps = []; // 收集所有 dep
    this.depIds = new Set();
    if (optins) {
      this.deep = !!options.deep; // 深度监听
    } else {
      this.deep = false;
    }

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
    // 深度监听子属性
    if (this.deep) {
      traverse(value);
    }

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
