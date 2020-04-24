import Vue from "vue";
import ElementUI from "element-ui";

Vue.use(ElementUI);

import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
