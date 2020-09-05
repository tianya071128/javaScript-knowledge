<template>
  <div id="app">
    <el-button type="danger">危险按钮</el-button>
    <svg-icon iconClass="component" class="icon"></svg-icon>
    <div>123</div>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    // js代码中使用环境变量
    console.log("BASE_URL", process.env.BASE_URL);
    console.log("VUE_APP_API", process.env.VUE_APP_API);
    console.log(process.env);
    console.log(this);
    Promise.resolve(2).then(console.log);
  }
};
</script>

<style lang="scss"></style>
