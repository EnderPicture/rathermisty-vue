import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "weather",
    component: () => import("../components/Weather.vue"),
  },
  {
    path: "/old",
    name: "old",
    component: () => import("../components/old/WeatherOld.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../components/About.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
