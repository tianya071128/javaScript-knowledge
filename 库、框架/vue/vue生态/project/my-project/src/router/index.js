/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-15 21:37:32
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-16 00:06:31
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import setRouterEach from './setRouterEach';

Vue.use(VueRouter);

const modulesFiles = require.context('./modules', true, /\.js$/);

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  let value = modulesFiles(modulePath);
  value = value.default || value;
  if (!Array.isArray(value)) value = [];
  return [...modules, ...value];
}, []);

console.log(modules);
const router = new VueRouter({
  routes: [...modules],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

// 设置路由守卫
setRouterEach(router);

export default router;
