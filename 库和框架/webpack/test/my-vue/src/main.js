import Vue from "vue";
import App from "./App.vue";
import VuePreview from "@/assets/js/vue-preview.min";
import vuePicturePreview from "vue-picture-preview";

Vue.config.productionTip = false;

Vue.component("my-test", {
  name: "Ceshi"
});

// defalut install
Vue.use(VuePreview);

Vue.component("Previewer", vuePicturePreview);

console.log(
  new Vue({
    render: h => h(App)
  }).$mount("#app")
);
