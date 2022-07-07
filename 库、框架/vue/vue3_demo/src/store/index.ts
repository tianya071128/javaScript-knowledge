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
  // mutations,
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
