<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Downloads</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Downloads</ion-title>
        </ion-toolbar>
      </ion-header>
      <!-- Open URL modal !-->
      <ion-modal :is-open="isOpenModalShown">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="isOpenModalShown = false">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Open URL</ion-title>
            <ion-buttons slot="end">
              <ion-button :strong="true" color="success" @click="addURL"
                >Open</ion-button
              >
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item lines="full">
            <ion-label position="floating">URL</ion-label>
            <ion-input
              ref="input"
              type="url"
              placeholder="URL"
              v-model="openModalURL"
            ></ion-input>
          </ion-item>
          <ion-item lines="full">
            <ion-label position="floating">Quality</ion-label>
            <ion-select v-model="openModalQuality" :value="openModalQuality">
              <ion-select-option :value="QUALITY.BEST">Best</ion-select-option>
              <ion-select-option :value="QUALITY.QHD">1440p</ion-select-option>
              <ion-select-option :value="QUALITY.FULLHD"
                >1080p</ion-select-option
              >
              <ion-select-option :value="QUALITY.HD">720p</ion-select-option>
              <ion-select-option :value="QUALITY.NTSC">480p</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item lines="full">
            <ion-label position="floating">Format</ion-label>
            <ion-select v-model="openModalFormat" :value="openModalFormat">
              <ion-select-option :value="FORMAT.ANY">Any</ion-select-option>
              <ion-select-option :value="FORMAT.MP4">MP4</ion-select-option>
              <ion-select-option :value="FORMAT.MP3">MP3</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-content>
      </ion-modal>

      <!-- Status of entries !-->
      <ion-list>
        <ion-list-header>Downloading</ion-list-header>
        <ion-item v-for="item in downloadingList" :key="item.id">
          <ion-label>{{ item.title }}</ion-label>
        </ion-item>
        <ion-item v-if="downloadingList.length == 0">Empty</ion-item>
        <ion-list-header>Completed</ion-list-header>
        <ion-item v-for="item in completedList" :key="item.id">
          <ion-label>{{ item.title }}</ion-label>
        </ion-item>
        <ion-item v-if="completedList.length == 0">Empty</ion-item>
      </ion-list>
      <ion-fab
        vertical="bottom"
        horizontal="end"
        slot="fixed"
        @click="isOpenModalShown = true"
      >
        <ion-fab-button @click="isOpenModalShown = true" color="success">
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
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonList,
  IonListHeader,
} from "@ionic/vue";
import { addSharp } from "ionicons/icons";

import { useStore } from "vuex";
import { ref } from "@vue/reactivity";
import { Http } from "@capacitor-community/http";

import { QUALITY, FORMAT } from "../properties";
import { getCurrentInstance } from "@vue/runtime-core";

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
    IonModal,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonList,
    IonListHeader,
  },
  setup() {
    const store = useStore();
    const app = getCurrentInstance();
    // Add URL modal settings
    const isOpenModalShown = ref(false);
    const openModalURL = ref("");
    const openModalQuality = ref(store.getters["settings/defaultQuality"]);
    const openModalFormat = ref(store.getters["settings/defaultFormat"]);

    const downloadingList = ref([]);
    const completedList = ref([]);

    const addURL = async () => {
      isOpenModalShown.value = false;
      const resp = await Http.post({
        url: new URL("add", store.getters["settings/serverURL"]),
        data: {
          quality: openModalQuality.value,
          format: openModalFormat.value,
          url: openModalURL.value,
        },
      });
      console.log(resp);
      // TODO: Clear modal form on cancel too!
      openModalURL.value = "";
      openModalQuality.value = store.getters["settings/defaultQuality"];
      openModalFormat.value = store.getters["settings/defaultFormat"];
    };

    // Handle Socket.IO events
    app.appContext.config.globalProperties.$socketIOClient.on("all", (data) => {
      const parsedData = JSON.parse(data);
      downloadingList.value = [];
      completedList.value = [];

      // Parse downloadingList
      parsedData[0].forEach((element) => {
        downloadingList.value.push(element[1]);
      });
      // Parse completedList
      parsedData[1].forEach((element) => {
        completedList.value.push(element[1]);
      });
    });

    app.appContext.config.globalProperties.$socketIOClient.on(
      "added",
      (data) => {
        downloadingList.value.push(JSON.parse(data));
      }
    );

    app.appContext.config.globalProperties.$socketIOClient.on(
      "canceled",
      (data) => {
        const index = downloadingList.value.findIndex(
          (el) => el.id === JSON.parse(data)
        );
        if (index > -1) {
          downloadingList.value.splice(index, 1);
        }
      }
    );

    app.appContext.config.globalProperties.$socketIOClient.on(
      "completed",
      (data) => {
        // Remove from downloadingList if exists
        const parsedData = JSON.parse(data);
        const index = downloadingList.value.findIndex(
          (el) => el.id === parsedData.id
        );
        if (index > -1) {
          downloadingList.value.splice(index, 1);
        }
        completedList.value.push(parsedData);
      }
    );

    return {
      addSharp,
      addURL,
      isOpenModalShown,
      openModalURL,
      openModalQuality,
      openModalFormat,
      QUALITY,
      FORMAT,
      downloadingList,
      completedList,
    };
  },
};
</script>
