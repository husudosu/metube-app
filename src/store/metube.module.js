const initialState = {
  downloadingList: [],
  completedList: [],
};

export const metube = {
  namespaced: true,
  state: { ...initialState },
  getters: {
    downloadingList: (state) => {
      return state.downloadingList;
    },
    completedList: (state) => {
      return state.completedList;
    },
  },
  mutations: {
    setDownloadingList: (state, value) => {
      state.downloadingList = value;
    },
    setCompletedList: (state, value) => {
      state.completedList = value;
    },
    addToDownloadingList: (state, value) => {
      state.downloadingList.push(value);
    },
    addToCompletedList: (state, value) => {
      state.completedList.push(value);
    },
    removeFromDownloadingList: (state, value) => {
      const index = state.downloadingList.findIndex((el) => el.id === value);
      if (index > -1) state.downloadingList.splice(index, 1);
    },
    removeFromCompletedList: (state, value) => {
      const index = state.completedList.findIndex((el) => el.id === value);
      if (index > -1) state.completedList.splice(index, 1);
    },
    updateDownloadingEntry: (state, value) => {
      const index = state.downloadingList.findIndex((el) => el.id === value.id);
      if (index > -1) {
        state.downloadingList[index].percent = value.percent;
        state.downloadingList[index].eta = value.eta;
        state.downloadingList[index].speed = value.speed;
      }
    },
  },
  actions: {},
};
