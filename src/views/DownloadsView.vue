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
      <ion-fab
        vertical="bottom"
        horizontal="end"
        slot="fixed"
        @click="isOpenModalShown = true"
      >
        <ion-fab-button @click="isOpenModalShown = true">
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
} from "@ionic/vue";
import { addSharp } from "ionicons/icons";

import { useStore } from "vuex";
import { ref } from "@vue/reactivity";
import { Http } from "@capacitor-community/http";

import { QUALITY, FORMAT } from "../properties";

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
  },
  setup() {
    const store = useStore();
    // Add URL modal settings
    const isOpenModalShown = ref(false);
    const openModalURL = ref("");
    const openModalQuality = ref(store.getters["settings/defaultQuality"]);
    const openModalFormat = ref(store.getters["settings/defaultFormat"]);

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
      // Clear modal
      openModalURL.value = "";
      openModalQuality.value = store.getters["settings/defaultQuality"];
      openModalFormat.value = store.getters["settings/defaultFormat"];
    };

    return {
      addSharp,
      addURL,
      isOpenModalShown,
      openModalURL,
      openModalQuality,
      openModalFormat,
      QUALITY,
      FORMAT,
    };
  },
};
</script>
