const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

["push", "pop", "shift", "unshift", "splict", "sort", "reverse"].forEach(
  function(method) {
    // 缓存原始方法
    const original = arrayProto[method];
    Object.defineProperty(arrayMethods, method, {
      value: function mutator(...args) {
        const ob = this.__ob__; // 获取该数组的 Observer 实例，引用该数组的 Dep
        ob.dep.notify(); // 此时通知依赖(Watcher)数据变动

        // 将新增的数组元素转化为响应式
        let inserted;
        switch (method) {
          case "push":
          case "unshift":
            inserted = args;
            break;
          case "splice":
            inserted = args.slice(2);
            break;
        }
        if (inserted) ob.observeArray(inserted); // 借用 observeArray 将数组元素设置为响应式

        return original.apply(this, args);
      },
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
);

export { arrayMethods };
