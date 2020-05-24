import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.component("my-test", {
  name: "Ceshi"
});

console.log(
  new Vue({
    render: h => h(App)
  }).$mount("#app")
);
