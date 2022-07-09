import { getToken } from '@/utils/localStore';
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
        title: '首页',
      },
    },
    {
      path: '/product/:productId',
      name: 'Product',
      component: () => import('@/views/product/index.vue'),
      meta: {
        index: 3,
        login: true, // 页面需要登录才能进入
        title: '商品详情',
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      beforeEnter(to, form) {
        if (getToken()) {
          router.replace((to.query.from as string) || '/');
        }
      },
      meta: {
        index: 1,
        title: '登录',
      },
    },
  ],
});

/** 全局前置守卫 */
router.beforeEach((to, from) => {
  /** 页面切换动画效果 */
  if (to.meta.index && from.meta.index) {
    if (to.meta.index > from.meta.index) {
      to.meta.transition = 'slide-right';
    } else if (to.meta.index < from.meta.index) {
      to.meta.transition = 'slide-left';
    }
  }

  /** 校验登录 */
  const token = getToken();
  if (!token && to.meta.login) {
    // 需要登录才能进入
    return {
      name: 'Login',
      replace: true,
      query: {
        from: to.path,
      },
    };
  }
});
/** 全局后置守卫 */
router.afterEach((to) => {
  document.title = `${to.meta.title} | vue3_demo`;
});

export default router;
