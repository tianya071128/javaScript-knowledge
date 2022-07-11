<script setup lang="ts">
import '@/views/home/index.vue';
import { Toast } from 'vant';
import { watch, watchEffect } from 'vue';
import { useCartStore, useUserStore, useRequest } from './store';

// 登录状态时，重新获取购物车数据
const userSore = useUserStore();
const cartStore = useCartStore();
const requestStore = useRequest();

watch(
  () => requestStore.loading,
  () => {
    if (requestStore.loading > 0) {
      Toast.loading({ message: requestStore.loadingText, forbidClick: true });
    } else {
      Toast.clear();
    }
  }
);

watchEffect(() => {
  if (userSore.token) {
    // 如果登录情况下的话，那么就去更新一下购物车数据
    cartStore.updateCount('update');
  } else {
    cartStore.updateCount('remove');
  }
});
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || ''">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<style lang="less" scoped>
.slide-right-leave-from,
.slide-left-leave-from {
  opacity: 1;
}

.slide-right-leave-active,
.slide-left-leave-active {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.slide-right-enter-active,
.slide-left-enter-active {
  transition: transform 0.5s ease;
  background-color: #f7f8fa;
  will-change: transform;
  position: fixed;
  top: 0;
  z-index: 999999;
  height: 100vh;
  width: 100vw;
}

.slide-right-enter-from {
  transform: translateX(100vw);
}

.slide-left-enter-from {
  transform: translateX(-100vw);
}

:global(#app) {
  background-color: #f7f8fa;
  min-height: 100vh;
}
</style>
