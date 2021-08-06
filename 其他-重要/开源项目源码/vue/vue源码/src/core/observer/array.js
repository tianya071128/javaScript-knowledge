/*
 * @Descripttion: 
 * @Author: sueRimn
 * @Date: 2020-03-13 12:32:00
 * @LastEditTime: 2020-03-27 15:53:35
 */
/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events 拦截变异方法并发出事件
 */
methodsToPatch.forEach(function (method) {
  // cache original method 缓存原始方法
  const original = arrayProto[method]
  // 定义与数组变异方法同名的函数, 用来代理数组原型变异方法
  def(arrayMethods, method, function mutator(...args) {
    // 获取调用方法
    const result = original.apply(this, args)
    // this.__ob__ 引用的就是 new Observer() 的观察对象
    const ob = this.__ob__
    // 对 新增元素 同时添加响应式
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)

    // notify change
    // 当调用变异方法时, 执行依赖
    ob.dep.notify()
    return result
  })
})
