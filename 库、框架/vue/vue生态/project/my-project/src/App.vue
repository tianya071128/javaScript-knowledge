<template>
  <div id="app">
    <!-- <svg-icon iconClass="component" class="icon" /> -->

    <keep-alive :include="keepAliveRouterNames">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapState({
      keepAliveRouterNames: state => state.globalStore.keepAliveRouterNames,
    }),
  },
};
</script>

<style lang="scss">
.test {
  font-size: 16px;
  display: flex;
}
</style>
