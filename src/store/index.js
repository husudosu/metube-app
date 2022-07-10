import { createStore } from "vuex";
import { settings } from "./settings.module";
import { metube } from "./metube.module";

const initialState = {
  isOpenModalShown: false,
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
  },
});
