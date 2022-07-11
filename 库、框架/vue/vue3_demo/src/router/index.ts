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
      path: '/category',
      name: 'Category',
      component: () => import('@/views/category/index.vue'),
      meta: {
        index: 1,
        title: '分类',
      },
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/views/cart/index.vue'),
      meta: {
        index: 1,
        login: true, // 页面需要登录才能进入
        title: '购物车',
      },
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('@/views/user/index.vue'),
      meta: {
        index: 1,
        login: true, // 页面需要登录才能进入
        title: '我的',
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
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/about/index.vue'),
      meta: {
        index: 2,
        title: '关于我们',
      },
    },
    {
      path: '/setting',
      name: 'Setting',
      component: () => import('@/views/setting/index.vue'),
      meta: {
        index: 2,
        login: true, // 页面需要登录才能进入
        title: '账号管理',
      },
    },
    {
      path: '/address',
      name: 'Address',
      component: () => import('@/views/address/index.vue'),
      meta: {
        index: 3,
        login: true, // 页面需要登录才能进入
        title: '地址管理',
      },
    },
    {
      path: '/address-edit',
      name: 'AddressEdit',
      component: () => import('@/views/address/addressEdit.vue'),
      meta: {
        index: 4,
        login: true, // 页面需要登录才能进入
        title: '新增地址',
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
