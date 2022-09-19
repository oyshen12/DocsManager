import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    baseUrl: "http://markwebdev.ru/api/v1",
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
    filtredFiles(state) {
      return state.files.filter((el) =>
        el.full_name.toLowerCase().includes(state.searchInput.toLowerCase())
      );
    },
    filtredFolders(state) {
      return state.folders.filter((el) =>
        el.name.toLowerCase().includes(state.searchInput.toLowerCase())
      );
    },
  },
  mutations: {
    setFolders(state, payload) {
      state.folders = payload;
    },
    setСurrentFolder(state, payload) {
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
