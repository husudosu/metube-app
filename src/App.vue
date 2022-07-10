<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-list-header>Metube</ion-list-header>
            <ion-note></ion-note>

            <ion-menu-toggle
              auto-hide="false"
              v-for="(p, i) in appPages"
              :key="i"
            >
              <ion-item
                @click="selectedIndex = i"
                router-direction="root"
                :router-link="p.url"
                lines="none"
                detail="false"
                class="hydrated"
                :class="{ selected: selectedIndex === i }"
              >
                <ion-icon
                  slot="start"
                  :ios="p.iosIcon"
                  :md="p.mdIcon"
                ></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
          <!-- Open URL modal !-->
          <ion-modal :is-open="isOpenModalShown">
            <ion-header>
              <ion-toolbar>
                <ion-buttons slot="start">
                  <ion-button @click="closeModal">Cancel</ion-button>
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
                <ion-select
                  v-model="openModalQuality"
                  :value="openModalQuality"
                >
                  <ion-select-option :value="QUALITY.BEST"
                    >Best</ion-select-option
                  >
                  <ion-select-option :value="QUALITY.QHD"
                    >1440p</ion-select-option
                  >
                  <ion-select-option :value="QUALITY.FULLHD"
                    >1080p</ion-select-option
                  >
                  <ion-select-option :value="QUALITY.HD"
                    >720p</ion-select-option
                  >
                  <ion-select-option :value="QUALITY.NTSC"
                    >480p</ion-select-option
                  >
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
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script>
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonButton,
  IonTitle,
  IonToolbar,
  IonHeader,
  getPlatforms,
} from "@ionic/vue";
import { defineComponent, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import {
  heartOutline,
  heartSharp,
  downloadOutline,
  downloadSharp,
  settingsOutline,
  settingsSharp,
} from "ionicons/icons";
import { Http } from "@capacitor-community/http";
import urlJoin from "url-join";

import { QUALITY, FORMAT, AndroindIntentActions } from "./properties";
// Android 7.0 Webview cannot join URL properly so we have to use a third party library for that.
export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    IonRouterOutlet,
    IonSplitPane,
    IonModal,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonButton,
    IonTitle,
    IonToolbar,
    IonHeader,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const platforms = getPlatforms();
    const selectedIndex = ref(0);
    const appPages = [
      {
        title: "Downloads",
        url: "/folder/downloads",
        iosIcon: downloadOutline,
        mdIcon: downloadSharp,
      },
      {
        title: "Settings",
        url: "/folder/settings",
        iosIcon: settingsOutline,
        mdIcon: settingsSharp,
      },
      {
        title: "About",
        url: "/folder/about",
        iosIcon: heartOutline,
        mdIcon: heartSharp,
      },
    ];

    // Open URL Modal
    const openModalURL = ref("");
    const openModalQuality = ref(store.getters["settings/defaultQuality"]);
    const openModalFormat = ref(store.getters["settings/defaultFormat"]);

    const path = window.location.pathname.split("folder/")[1];
    if (path !== undefined) {
      selectedIndex.value = appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }

    // Intent handling code
    const initApp = async () => {
      if (platforms.includes("hybrid")) {
        console.log("Registering indent");
        registerBroadcastReceiver();
        window.plugins.intentShim.onIntent((intent) => {
          handleIntent(intent);
        });
      }
    };

    const registerBroadcastReceiver = () => {
      window.plugins.intentShim.registerBroadcastReceiver(
        {
          filterActions: [
            "com.darryncampbell.cordova.plugin.broadcastIntent.ACTION",
          ],
        },
        (intent) => {
          //  Broadcast received
          handleIntent(intent);
        }
      );
    };

    const handleSendIntent = async (intent) => {
      console.log("Send intent");
      store.commit("setIsOpenModalShown", true);
      openModalURL.value = intent.clipItems[0].text;
    };

    const handleIntent = async (intent) => {
      if (Object.prototype.hasOwnProperty.call(intent, "action")) {
        switch (intent.action) {
          case AndroindIntentActions.SEND:
            handleSendIntent(intent);
            break;
          default:
            break;
        }
      }
    };
    const closeModal = () => {
      store.commit("setIsOpenModalShown", false);
      openModalURL.value = "";
      openModalQuality.value = store.getters["settings/defaultQuality"];
      openModalFormat.value = store.getters["settings/defaultFormat"];
    };

    const addURL = async () => {
      const resp = await Http.post({
        url: urlJoin(store.getters["settings/serverURL"], "add"),
        headers: { "Content-Type": "application/json" },
        data: {
          quality: openModalQuality.value,
          format: openModalFormat.value,
          url: openModalURL.value,
        },
      });
      console.log(resp);
      closeModal();
    };

    initApp();

    return {
      selectedIndex,
      appPages,
      isSelected: (url) => (url === route.path ? "selected" : ""),
      QUALITY,
      FORMAT,
      addURL,
      openModalURL,
      openModalQuality,
      openModalFormat,
      isOpenModalShown: computed(() => store.state.isOpenModalShown),
      closeModal,
    };
  },
});
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
