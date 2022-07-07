import { createStore } from "vuex";
import { settings } from "./settings.module";

export const store = createStore({
  modules: {
    settings,
  },
});
