<script setup lang="ts">
import { type CarouselsItem } from '@/api';

const { list } = defineProps<{
  list: CarouselsItem[];
}>();

const goTo = (url: string) => {
  window.open(url);
};
</script>

<template>
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#1baeae">
    <van-swipe-item v-for="item in list" :key="item.redirectUrl">
      <img :src="item.carouselUrl" alt="" @click="goTo(item.redirectUrl)" />
    </van-swipe-item>
  </van-swipe>
</template>

<style lang="less" scoped>
.my-swipe {
  height: 172px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
