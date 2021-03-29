const EventEmitter = require('events');

// 让类继承至 EventEmitter, 从而就会继承 event 自定义事件体系
class MyEventEmitter extends EventEmitter {}

const event = new MyEventEmitter();

// 监听事件
event.on('play', (value) => {
  console.log(value);
})

// 监听一次性事件
event.once('play', (value) => {
  console.log('只触发一次', value);
})

// 触发事件
event.emit('play', 'move');
event.emit('play', 'move2');


