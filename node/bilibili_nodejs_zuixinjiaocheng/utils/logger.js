/*
 * @Descripttion: 
 * @Author: 温祖彪
 * @Date: 2021-03-24 23:00:21
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-24 23:01:23
 */
const log4js = require('log4js');
log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'chess.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
})

const logger = log4js.getLogger('cheese');
logger.level = 'debug';

module.exports = logger;
