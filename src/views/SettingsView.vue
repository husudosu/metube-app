<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title>Settings</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        <ion-item>
          <ion-label position="floating">Metube server address</ion-label>
          <ion-input
            :value="settings.serverURL"
            @ionBlur="setOption('serverURL', $event.target.value)"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Dark mode</ion-label>
          <ion-toggle
            :checked="settings.nightmode"
            @ionChange="setOption('nightmode', $event.target.checked)"
          ></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>Default quality</ion-label>
          <ion-select
            @ionChange="setOption('defaultQuality', $event.detail.value)"
            :value="settings.defaultQuality"
          >
            <ion-select-option :value="QUALITY.BEST">Best</ion-select-option>
            <ion-select-option :value="QUALITY.QHD">1440p</ion-select-option>
            <ion-select-option :value="QUALITY.FULLHD">1080p</ion-select-option>
            <ion-select-option :value="QUALITY.HD">720p</ion-select-option>
            <ion-select-option :value="QUALITY.NTSC">480p</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>Default format</ion-label>
          <ion-select
            @ionChange="setOption('defaultFormat', $event.detail.value)"
            :value="settings.defaultFormat"
          >
            <ion-select-option :value="FORMAT.ANY">Any</ion-select-option>
            <ion-select-option :value="FORMAT.MP4">MP4</ion-select-option>
            <ion-select-option :value="FORMAT.MP3">MP3</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonMenuButton,
  IonList,
  IonItem,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from "@ionic/vue";
import { useStore } from "vuex";
import { QUALITY, FORMAT } from "../properties";
export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonMenuButton,
    IonList,
    IonItem,
    IonInput,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonToggle,
  },
  setup() {
    const store = useStore();

    const setOption = (key, value) => {
      store.dispatch("settings/setOption", { key, value });
      switch (key) {
        case "serverURL":
          // TODO: Reconnect to new server on server address change.
          break;
        case "nightmode":
          document.body.classList.toggle("dark", value);
          break;
      }
    };

    return {
      QUALITY,
      FORMAT,
      settings: store.getters["settings/settings"],
      setOption,
    };
  },
};
</script>
