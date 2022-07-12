<template>
  <ion-toolbar v-if="!props.socketConnected">
    <ion-title size="small">Socket not connected</ion-title>
  </ion-toolbar>
</template>

<script>
import { IonToolbar, IonTitle } from "@ionic/vue";
export default {
  props: ["socketConnected"],
  components: {
    IonToolbar,
    IonTitle,
  },
  setup(props) {
    return {
      props,
    };
  },
};
</script>
