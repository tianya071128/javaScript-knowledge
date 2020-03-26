/*
 * @Descripttion: 
 * @Author: sueRimn
 * @Date: 2020-03-13 12:32:00
 * @LastEditTime: 2020-03-26 18:06:02
 */
/* not type checking this file because flow doesn't play well with Proxy */
/* 不检查此文件的类型，因为 flow 不能很好地处理代理 */

import config from 'core/config'
import { warn, makeMap, isNative } from '../util/index'

// 声明 initProxy 变量
let initProxy

if (process.env.NODE_ENV !== 'production') {
  const allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  )

  const warnNonPresent = (target, key) => {
    warn(
      `Property or method "${key}" is not defined on the instance but ` +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    )
  }

  const warnReservedPrefix = (target, key) => {
    warn(
      `Property "${key}" must be accessed with "$data.${key}" because ` +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    )
  }

  const hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy)

  if (hasProxy) {
    const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact')
    config.keyCodes = new Proxy(config.keyCodes, {
      set(target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`)
          return false
        } else {
          target[key] = value
          return true
        }
      }
    })
  }

  const hasHandler = {
    has(target, key) {
      // has 常量是真实经过 in 运算符得来的结果
      const has = key in target
      // 如果 key 在 allowedGlobals 之内，或者 key 是以下划线 _ 开头的字符串，则为真
      const isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data))
      // 如果 has 和 isAllowed 都为假，使用 warnNonPresent 函数打印错误
      if (!has && !isAllowed) {
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }
      return has || !isAllowed
    }
  }

  const getHandler = {
    get(target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }
      return target[key]
    }
  }

  // 为 initProxy 赋值
  initProxy = function initProxy(vm) {
    // 判断宿主环境是否支持 js 原生的 Proxy 特性
    if (hasProxy) {
      // determine which proxy handler to use 确定要使用的代理处理程序
      // options 就是 vm.$options 的引用
      const options = vm.$options
      // handlers 可能是 getHandler 也可能是 hasHandler
      // options.render._withStripped 这个属性只在测试代码中出现过，所以一般情况下这个条件都会为假，也就是使用 hasHandler 作为代理配置。
      const handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler
      // 代理 vm 对象
      vm._renderProxy = new Proxy(vm, handlers)
    } else {
      vm._renderProxy = vm
    }
  }
}

export { initProxy }
