/**
 * 一个简单的事件系统
 */
const EventEmitter = require('events');

// 继承 evnets 类
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// 注册事件
myEmitter.on('event', () => {
  console.log('触发事件');
});
// 发射事件
myEmitter.emit('event');

/**
 * EventEmitter 类
 *  newListener 事件: 添加新事件时触发
 *  removeListener 事件: 删除事件时触发
 *  emitter.on(eventName, listener): 监听事件
 *  emitter.emit(eventName[, ...args]): 触发事件 -- 如果事件有监听器，则返回 true，否则返回 false。
 *  emitter.off(eventName, listener): 移除事件指定的 listener
 *  emitter.removeListener(eventName, listener): emitter.off 效果一样
 *  emitter.removeAllListeners([eventName]): 移除所有监听器或者指定事件的所有监听器
 *  emitter.once(eventName, listener): 监听一次性事件, 事件触发后自动移除
 *
 */
