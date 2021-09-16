/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-15 22:52:47
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-16 00:19:40
 */
export default [
  {
    path: '/test01',
    name: 'Test01',
    component: {
      name: 'Test01',
      created() {
        console.log('组件创建');
      },
      destroyed() {
        console.log('销毁');
      },
      render(h) {
        return h('div', 'test01');
      },
    },
    meta: {
      keepAliveNames: ['Test02'],
    },
  },
  {
    path: '/test02',
    name: 'Test04',
    component: {
      name: 'Test02',
      render(h) {
        return h('div', 'test02');
      },
    },
  },
];
