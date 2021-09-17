<!--
 * @Descripttion: 
 * @Author: 温祖彪
 * @Date: 2021-09-17 11:28:00
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-17 15:32:43
-->
<template>
  <div class="wzb-loading" v-show="loading">
    <van-loading size="30px" vertical color="#0094ff">加载中...</van-loading>
  </div>
</template>

<script>
import { Loading } from 'vant';
import { mapState } from 'vuex';

export default {
  name: 'Loading',
  components: {
    [Loading.name]: Loading,
  },
  computed: {
    ...mapState({
      loading: state => state.globalStore.loading,
    }),
  },
  mounted() {
    // 我们使用单例模式, 让这个 loading 始终在页面中, 这样的话, 我们就可以不仅在接口中使用, 在其他地方手动改变 vuex 的值也是可以的
    document.body.appendChild(this.$el);
  },
};
</script>

<style lang="scss" scoped>
.wzb-loading {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
