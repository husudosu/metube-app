import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { IonicVue } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { store } from "./store";
import { io } from "socket.io-client";

const app = createApp(App).use(IonicVue).use(router).use(store);
// Load settings before mounting
store.dispatch("settings/loadSettings").then(() => {
  // Toggle dark-mode
  if (store.getters["settings/nightmode"]) document.body.classList.add("dark");
  // Socket IO connection
  app.config.globalProperties.$socketIOClient = io(
    store.getters["settings/serverURL"]
  );

  router.isReady().then(() => {
    app.mount("#app");
  });
});
