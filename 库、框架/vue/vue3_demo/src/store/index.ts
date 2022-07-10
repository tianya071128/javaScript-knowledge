import { getCart } from '@/api';
import { getToken } from '@/utils/localStore';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user_pinia', {
  state: () => ({
    token: getToken(),
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    removeToken() {
      this.token = null;
    },
  },
});

export const useCartStore = defineStore('cart_pinia', {
  state: () => ({ count: 0 }),
  actions: {
    async updateCount(action: 'remove' | 'update' | 'change', count?: number) {
      if (action === 'remove') {
        this.count = 0;
      } else if (action === 'update') {
        const data = await getCart();
        this.count = data.length || 0;
      } else {
        count != undefined && (this.count = count);
      }
    },
  },
});

export const useRequest = defineStore('request_pinia', {
  state: () => ({ loading: 0, loadingText: '加载中...' }),
  actions: {
    updatedLoading(action: -1 | 1) {
      this.loading += action;

      if (this.loading < 0) this.loading = 0;
    },
    updatedLoadingText(text: string) {
      this.loadingText = text;
    },
  },
});
