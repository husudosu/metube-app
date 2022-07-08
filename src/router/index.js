import { createRouter, createWebHistory } from "@ionic/vue-router";

const routes = [
  {
    path: "",
    redirect: "/folder/settings",
  },
  {
    path: "/folder/settings",
    component: () => import("../views/SettingsView.vue"),
  },
  {
    path: "/folder/downloads",
    component: () => import("../views/DownloadsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
