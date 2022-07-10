<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Metube app</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Metube app</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-item lines="full">
          <ion-label class="ion-text-wrap">
            <h2>License</h2>
            <p>MIT</p>
          </ion-label>
        </ion-item>
        <ion-item lines="full">
          <ion-label class="ion-text-wrap">
            <h2>App made by</h2>
            <p>Ferenc Nánási</p>
          </ion-label>
        </ion-item>
        <ion-item lines="full">
          <ion-label class="ion-text-wrap">
            <h2>DISCLAIMER</h2>
            <p>
              This is a proof-of-concept version, most of the things not working
              properly!
            </p>
          </ion-label>
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
  IonContent,
  IonMenuButton,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/vue";

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonMenuButton,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
  },
  setup(props) {
    return { props };
  },
};
</script>
