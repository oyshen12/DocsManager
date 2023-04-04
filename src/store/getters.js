export default {
  filtrededFiles(state) {
    return state.files.filter((el) =>
      el.full_name.toLowerCase().includes(state.searchInput.toLowerCase())
    );
  },
  filtrededFolders(state) {
    return state.folders.filter((el) =>
      el.name.toLowerCase().includes(state.searchInput.toLowerCase())
    );
  },
  currentFolderSize(state) {
    let folderSize = state.files.reduce((acc, el) => (acc += el.size), 0);
    if (state.currentFolder.id === -1) {
      const foldersSize = state.folders.reduce(
        (acc, el) => (acc += el.size),
        0
      );
      folderSize += foldersSize;
    }
    return folderSize;
  },
};
