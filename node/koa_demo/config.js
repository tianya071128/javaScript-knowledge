/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-08 10:29:01
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-09 14:53:07
 */
const path = require('path');

const config = {
  port: 3000,

  database: {
    DATABASE: 'koa_demo',
    USERNAME: 'root',
    PASSWORD: 'abc123',
    PORT: '3306',
    HOST: 'localhost',
  },

  System: {
    API_server_type: 'http://', // API服务器协议类型,包含"http://"或"https://"
    API_server_host: 'localhost', // API服务器暴露的域名地址,请勿添加"http://"
    API_server_port: '3000', // API服务器监听的端口号
    HTTP_server_type: 'http://', // HTTP服务器协议类型,包含"http://"或"https://"
    HTTP_server_host: 'www.XXX.com', // HTTP服务器地址,请勿添加"http://" （即前端调用使用的服务器地址，如果是APP请设置为 * ）
    HTTP_server_port: '65534', // HTTP服务器端口号
    System_country: 'zh-cn', // 所在国家的国家代码
    System_plugin_path: path.join(__dirname, './plugins'), // 插件路径
    Session_Key: 'RESTfulAPI', // 生产环境务必随机设置一个值
    db_type: 'mysql', // 数据库类型
  },
};

module.exports = config;
