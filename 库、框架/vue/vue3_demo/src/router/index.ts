import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        index: 1,
      },
    },
    {
      path: '/product/:productId',
      name: 'Product',
      component: () => import('@/views/product/index.vue'),
      meta: {
        index: 3,
        login: true, // 页面需要登录才能进入
      },
    },
  ],
});

export default router;
