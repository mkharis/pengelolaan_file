import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Kegiatan from "../views/Kegiatan.vue";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/kegiatan",
    name: "Kegiatan",
    component: Kegiatan,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
