import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.prototype.$url =
  process.env.NODE_ENV === "production"
    ? "http://musirawaskab.ddns.net:8080/pengelolaan_file_api/public"
    : "http://localhost:8000";

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
