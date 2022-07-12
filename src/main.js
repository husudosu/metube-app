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

const handleSocketEvents = (ioClient) => {
  ioClient.on("all", (data) => {
    const parsedData = JSON.parse(data);
    // Downloading list
    store.commit(
      "metube/setDownloadingList",
      parsedData[0].map((el) => el[1])
    );

    // Completed list
    store.commit(
      "metube/setCompletedList",
      parsedData[1].map((el) => el[1])
    );
  });

  ioClient.on("added", (data) => {
    store.commit("metube/addToDownloadingList", JSON.parse(data));
  });

  ioClient.on("canceled", (data) => {
    store.commit("metube/removeFromDownloadingList", JSON.parse(data));
  });

  ioClient.on("updated", (data) => {
    store.commit("metube/updateDownloadingEntry", JSON.parse(data));
  });

  ioClient.on("completed", (data) => {
    const parsedData = JSON.parse(data);
    store.commit("metube/removeFromDownloadingList", parsedData.id);
    store.commit("metube/addToCompletedList", parsedData);
  });

  ioClient.on("connect", () => {
    store.commit("setSocketConnected", true);
  });

  ioClient.on("disconnect", () => {
    console.log("Disconnected");
    store.commit("setSocketConnected", false);
  });
};

store.dispatch("settings/loadSettings").then(() => {
  // Toggle dark-mode
  if (store.getters["settings/nightmode"]) document.body.classList.add("dark");
  // Socket IO connection
  if (store.getters["settings/serverURL"]) {
    const ioClient = io(store.getters["settings/serverURL"]);
    handleSocketEvents(ioClient);
  }
  router.isReady().then(() => {
    app.mount("#app");
  });
});
