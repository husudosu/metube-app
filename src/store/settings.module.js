import { Storage } from "@capacitor/storage";
import { FORMAT, QUALITY } from "../properties";

const initialState = {
  settings: {
    serverURL: null,
    nightmode: false,
    defaultQuality: QUALITY.BEST,
    defaultFormat: FORMAT.ANY,
  },
};

export const settings = {
  namespaced: true,
  state: { ...initialState },
  getters: {
    nightmode: (state) => {
      return state.settings.nightmode;
    },
    serverURL: (state) => {
      return state.settings.serverURL;
    },
    defaultQuality: (state) => {
      return state.settings.defaultQuality;
    },
    defaultFormat: (state) => {
      return state.settings.defaultFormat;
    },
    settings: (state) => {
      return state.settings;
    },
  },
  mutations: {
    setNightmode: (state, value) => {
      state.settings.nightmode = value;
    },
    setServerURL: (state, value) => {
      state.settings.serverURL = value;
    },
    setOptions: (state, value) => {
      state.settings = value;
    },
    setOption: (state, value) => {
      state.settings[value.key] = value.value;
    },
  },
  actions: {
    loadSettings: async ({ commit }) => {
      const nightmode = await Storage.get({ key: "nightmode" });
      const serverURL = await Storage.get({ key: "serverURL" });
      const defaultQuality = await Storage.get({ key: "defaultQuality" });
      const defaultFormat = await Storage.get({ key: "defaultFormat" });

      commit("setOptions", {
        nightmode: nightmode.value
          ? JSON.parse(nightmode.value)
          : initialState.settings.nightmode,
        serverURL: serverURL.value
          ? JSON.parse(serverURL.value)
          : initialState.settings.serverURL,
        defaultQuality: defaultQuality.value
          ? JSON.parse(defaultQuality.value)
          : initialState.settings.defaultQuality,
        defaultFormat: defaultFormat.value
          ? JSON.parse(defaultFormat.value)
          : initialState.settings.defaultFormat,
      });
    },
    setOption: async ({ commit }, payload) => {
      await Storage.set({
        key: payload.key,
        value: JSON.stringify(payload.value),
      });
      commit("setOption", payload);
    },
  },
};
