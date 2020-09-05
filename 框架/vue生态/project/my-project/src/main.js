import Vue from "vue";

// svg
import "@/icons";

// vuex
import stote from "./store";

import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  stote
}).$mount("#app");
