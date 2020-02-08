/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2019-12-09 20:33:31
 * @LastEditTime: 2019-12-09 21:22:51
 */

/**
 * @name: 封装WebSockets
 * @Descripttion: 主要问题在于, 客户端有时是检测不到连接断开的问题的, 此时需要引入心跳机制, 以及重连机制(也可手动重连机制)
 * 1. 每隔一段指定的时间（计时器），向服务器发送一个数据，服务器收到数据后再发送给客户端，正常情况下客户端通过onmessage事件是能监听到服务器返回的数据的，说明请求正常。
 * 2. 如果再这个指定时间内，客户端没有收到服务器端返回的响应消息，就判定连接断开了，使用websocket.close关闭连接。
 * 3. 这个关闭连接的动作可以通过onclose事件监听到，因此在 onclose 事件内，我们可以调用reconnect事件进行重连操作。
 */
class WS {
  // 当前重连次数
  _connectNum = 0;
  // 心跳检测频率
  _timeout = 3000;
  _timeoutObj = null;
  // 是否连接
  _isLogin = false;
  // 当前网络状态
  _netWork = true;
  // 是否人为退出
  _isClosed = false;
  // 是否在连接过程中 - 避免重复连接
  _lockReconnect = false;

  /* 计时器 */
  //重连计时器
  _reconnect_timer = null;
  //心跳计时器
  _heart_timer = null;

  /**
   * @name: 构造函数
   * @param {Object} 配置项
   * @return:
   */
  constructor(option = {}) {
    this.option = option;
    // 初始化
    this.init();
  }

  // 初始化
  init() {
    // 重置定时器
    clearInterval(this._reconnect_timer);
    clearInterval(this._heart_timer);

    // url可根据实际情况自行配置
    this.ws = new WebSocket(this.option.url);
    // 连接关闭事件
    this.ws.addEventListener("close", () => {
      // 人为关闭, 不重连
      if (this._isClosed) return;
      // 意外关闭, 重连机制启动
    });
    // 连接错误事件
    this.ws.addEventListener("error", () => {});
  }

  // 发送数据
  send(data) {
    this.ws.send(data);
  }
}
