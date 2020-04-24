<template>
  <div id="app">
    <el-button type="danger">危险按钮</el-button>
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  mounted() {
    // js代码中使用环境变量
    console.log("BASE_URL", process.env.BASE_URL);
    console.log("VUE_APP_API", process.env.VUE_APP_API);
    console.log(process.env);
    Promise.resolve(2).then(console.log);
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
