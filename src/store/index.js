import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    baseUrl: process.env.VUE_APP_BASE_URL,
    authorizationToken: "",
    folders: [],
    files: [],
    currentFolder: {
      id: -1,
      name: "",
    },
    searchInput: "",
  },
  getters: {
    filtrededFiles(state) {
      return state.files.filter((el) =>
        el.full_name.toLowerCase().includes(state.searchInput.toLowerCase())
      );
    },
    filtrededFiles(state) {
      return state.folders.filter((el) =>
        el.name.toLowerCase().includes(state.searchInput.toLowerCase())
      );
    },
  },
  mutations: {
    setFolders(state, payload) {
      state.folders = payload;
    },
    setCurrentFolder(state, payload) {
      state.currentFolder = payload;
    },
    setFiles(state, payload) {
      state.files = payload;
    },
    setAuthorizationToken(state, payload) {
      state.authorizationToken = payload;
    },
    setSearchInput(state, payload) {
      state.searchInput = payload;
    },
  },
  actions: {},
  modules: {},
});
