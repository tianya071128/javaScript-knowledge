<template>
  <div id="app">
    <!-- <svg-icon iconClass="component" class="icon" /> -->

    <keep-alive :include="keepAliveRouterNames">
      <router-view></router-view>
    </keep-alive>

    <div class="test" @click="test">test</div>

    <!-- 我们只需要让其启动, 其他逻辑在内部完成即可 -->
    <wzb-loading />
  </div>
</template>

<script>
import wzbLoading from '@/components/loading';
import { test } from '@/api/test';
import { mapState } from 'vuex';

export default {
  name: 'App',
  components: {
    wzbLoading,
  },
  computed: {
    ...mapState({
      keepAliveRouterNames: state => state.globalStore.keepAliveRouterNames,
    }),
  },
  methods: {
    async test() {
      console.log(await test({ id: 222 }));
    },
  },
};
</script>

<style lang="scss">
.test {
  font-size: 16px;
  display: flex;
}
</style>
