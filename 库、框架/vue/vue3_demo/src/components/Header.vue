<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const title = computed<string>(() => route.meta.title || '');

const onClickLeft = () => {
  router.back();
};
</script>

<template>
  <van-nav-bar
    :title="title"
    left-arrow
    @click-left="onClickLeft"
    fixed
    placeholder
  />
</template>

<style lang="scss" scoped></style>
