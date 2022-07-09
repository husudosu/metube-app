import { createStore } from "vuex";
import { settings } from "./settings.module";
import { metube } from "./metube.module";
export const store = createStore({
  modules: {
    settings,
    metube,
  },
});
