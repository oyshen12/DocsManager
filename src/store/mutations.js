export default {
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
  pushFolder(state, folder) {
    state.folders.push(folder);
  },
  pushFile(file) {
    state.files.push(file);
  },
  deleteFile(fileId) {
    const fileIndex = state.files.findIndex((file) => file.id === fileId);
    if (fileIndex !== -1) {
      state.files.splice(fileIndex, 1);
    }
  },
  renameFile({ id, name }) {
    const fileIndex = state.files.findIndex((file) => file.id === id);
    if (fileIndex !== -1) {
      state.files[fileIndex].name = name;
    }
  },
};
