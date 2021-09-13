/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-13 23:00:26
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-13 23:05:36
 */
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport': {
      unitToConvert: 'px', // 默认为 px， 需要转换的单位
      viewportWidth: 375, // 视窗的宽度
      unitPrecision: 5, // 小数位
      propList: ['*'], // 需要转换的属性列表
      viewportUnit: 'vw', // 指定需要转换成视窗单位
      fontViewportUnit: 'vw', // 字体使用视窗单位
      selectorBlackList: [], // 排除类
      minPixelValue: 1, // 不转换单位
      mediaQuery: false, // 允许在媒体查询中转换 px
      replace: true, // 是否直接更换属性而不添加备用属性
    }
  }
}