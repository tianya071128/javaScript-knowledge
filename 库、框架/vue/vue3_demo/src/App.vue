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
  <router-view></router-view>
</template>

<style lang="scss" scoped></style>
