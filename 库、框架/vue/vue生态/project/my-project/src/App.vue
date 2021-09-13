<template>
  <div id="app">
    <el-button type="danger">危险按钮</el-button>
    <svg-icon iconClass="component" class="icon"></svg-icon>
    <div class="test">123</div>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
  }
};
</script>

<style lang="scss">
.test {
  font-size: 16px;
  display: flex;
}
</style>
