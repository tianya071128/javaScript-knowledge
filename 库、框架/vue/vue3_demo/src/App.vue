<script setup lang="ts">
import '@/views/home/index.vue';
import { watchEffect } from 'vue';
import { useCartStore, useUserStore } from './store';

// 登录状态时，重新获取购物车数据
const userSore = useUserStore();
const cartStore = useCartStore();
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
  background-color: #fff;
  will-change: transform;
  position: fixed;
  top: 0;
  z-index: 999999;
  height: 100vh;
}

.slide-right-enter-from {
  transform: translateX(100vw);
}
.slide-left-enter-from {
  transform: translateX(-100vw);
}
</style>
