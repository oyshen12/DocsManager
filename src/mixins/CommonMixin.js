import { mapMutations, mapActions } from "vuex";

export default {
  methods: {
    ...mapMutations(["setFolders", "setFiles", "setCurrentFolder"]),
    ...mapActions(["getFolders", "getFiles", "getFolder"]),

    getFileExtention(fileName) {
      return fileName.split(".").pop();
    },

    async downloadFolders() {
      try {
        const { data } = await this.getFolders();
        this.setFolders(data.data);
      } catch {
        //
      }
    },

    async downloadFiles(folderID = -1) {
      const params = { folder_id: folderID };
      try {
        const { data } = await this.getFiles(params);
        this.setFiles(data.data);
      } catch {
        //
      }
    },

    async downloadCurrentFolder(folderID) {
      try {
        const { data } = await this.getFolder(folderID);
        this.setCurrentFolder(data.data);
      } catch {
        //
      }
    },

    readableSize(size) {
      return size < 1000 ? `${size} Б.` : `${Math.round(size / 1000)} Кб.`;
    },
  },
};
