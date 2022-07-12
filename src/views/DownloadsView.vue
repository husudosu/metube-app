<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Downloads</ion-title>
      </ion-toolbar>
      <connection-state-toolbar
        :socketConnected="socketConnected"
      ></connection-state-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Downloads</ion-title>
        </ion-toolbar>
      </ion-header>
      <!-- Status of entries !-->
      <ion-list>
        <ion-list-header>Downloading</ion-list-header>
        <ion-item v-for="item in downloadingList" :key="item.id">
          <ion-label
            >{{ item.title }}
            <ion-progress-bar
              class="progress"
              v-if="item.percent"
              :value="item.percent / 100"
            ></ion-progress-bar>
            <b>ETA:</b> {{ humanReadableTime(item.eta) }} | <b>Speed:</b>
            {{ humanReadableSpeed(item.speed) }}<br />
            <ion-button
              size="small"
              fill="none"
              @click="onDeleteClicked(item, 'queue')"
            >
              <ion-icon :icon="trashBinSharp" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-label>
        </ion-item>
        <ion-item v-if="downloadingList.length == 0">Empty</ion-item>
        <ion-list-header>Completed</ion-list-header>
        <ion-item v-for="item in completedList" :key="item.id">
          <ion-label>
            {{ item.title }}
            <br />
            <ion-button
              size="small"
              fill="none"
              @click="onDeleteClicked(item, 'done')"
            >
              <ion-icon :icon="trashBinSharp" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-label>
        </ion-item>
        <ion-item v-if="completedList.length == 0">Empty</ion-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button
          @click="onAddClicked"
          :disabled="!socketConnected"
          color="success"
        >
          <ion-icon :icon="addSharp"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonMenuButton,
  IonTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonButton,
  IonList,
  IonListHeader,
  IonProgressBar,
} from "@ionic/vue";
import { addSharp, trashBinSharp } from "ionicons/icons";

import { useStore } from "vuex";
import { Http } from "@capacitor-community/http";

import { computed } from "@vue/runtime-core";
import { humanReadableSpeed, humanReadableTime } from "../utils";

import ConnectionStateToolbar from "../components/ConnectionStateToolbar";
// Android 7.0 Webview cannot join URL properly so we have to use a third party library for that.
import urlJoin from "url-join";

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonMenuButton,
    IonTitle,
    IonFab,
    IonFabButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonButton,
    IonList,
    IonListHeader,
    IonProgressBar,
    ConnectionStateToolbar,
  },
  setup() {
    const store = useStore();

    const onAddClicked = () => {
      store.commit("setIsOpenModalShown", true);
    };
    const onDeleteClicked = async (item, where) => {
      try {
        const resp = await Http.post({
          url: urlJoin(store.getters["settings/serverURL"], "delete"),
          headers: { "Content-Type": "application/json" },
          connectTimeout: 3000,
          data: {
            where,
            ids: [item.id],
          },
        });
        // Remove from store too.
        if (JSON.parse(resp.data).status == "ok") {
          if (where === "queue")
            store.commit("metube/removeFromDownloadingList", item.id);
          else store.commit("metube/removeFromCompletedList", item.id);
        } else {
          store.commit("showToast", {
            toastDuration: 3000,
            toastMessage: `Error from metube server: ${JSON.parse(resp.data)}`,
          });
        }
      } catch (err) {
        if (err.message === "SocketTimeoutException") {
          store.commit("showToast", {
            toastDuration: 3000,
            toastMessage: "Cannot add link, probably the server not available.",
          });
        } else {
          store.commit("showToast", {
            toastDuration: 3000,
            toastMessage: `Cannot add new link: ${err}`,
          });
        }
      }
    };
    return {
      addSharp,
      downloadingList: computed(() => store.getters["metube/downloadingList"]),
      completedList: computed(() => store.getters["metube/completedList"]),
      trashBinSharp,
      humanReadableSpeed,
      humanReadableTime,
      onDeleteClicked,
      onAddClicked,
      socketConnected: computed(() => store.state.socketConnected),
    };
  },
};
</script>

<style>
.progress {
  margin-top: 10px;
  padding-top: 10px;
  margin-bottom: 10px;
}
</style>
