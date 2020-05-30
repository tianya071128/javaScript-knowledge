import Watcher from "./Watcher";

function Vue() {}

Vue.prototype.$watch = function(expOrFn, cb, options) {
  const vm = this;
  options = options || {};
  const watcher = new Watcher(vm, expOrFn, cb, options);

  if (options.immediate) {
    // 立即执行
    cb.call(vm, watcher.value);
  }

  return function unwatchFn() {
    watcher.teardown();
  };
};
