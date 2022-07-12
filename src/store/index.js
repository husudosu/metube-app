import { createStore } from "vuex";
import { settings } from "./settings.module";
import { metube } from "./metube.module";

const initialState = {
  isOpenModalShown: false,
  toastShown: false,
  toastDuration: 2000,
  toastMessage: null,
  socketConnected: false,
};

export const store = createStore({
  modules: {
    settings,
    metube,
  },
  state: { ...initialState },
  mutations: {
    setIsOpenModalShown: (state, value) => {
      state.isOpenModalShown = value;
    },
    showToast: (state, value) => {
      state.toastShown = true;
      state.toastDuration = value.toastDuration;
      state.toastMessage = value.toastMessage;
    },
    setToastShown: (state, value) => {
      state.toastShown = value;
    },
    setSocketConnected: (state, value) => {
      state.socketConnected = value;
    },
  },
});
