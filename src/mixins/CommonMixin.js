import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState([
      "baseUrl",
      "authorizationToken",
      "folders",
      "files",
      "currentFolder",
      "searchInput",
    ]),
    ...mapGetters(["filtrededFiles", "filtrededFiles"]),
  },
  methods: {
    ...mapMutations([
      "setFolders",
      "setAuthorizationToken",
      "setFiles",
      "setSearchInput",
      "setCurrentFolder",
    ]),

    getFileExtention(fileName) {
      return fileName.split(".").pop();
    },

    async downloadFolders() {
      try {
        const { data } = await this.api.get(`/folders`);
        this.setFolders(data.data);
      } catch {
        //
      }
    },

    async downloadFiles(folderID = -1) {
      const params = { folder_id: folderID };
      try {
        const { data } = await this.api.get("/files", {
          params,
        });
        this.setFiles(data.data);
      } catch {
        //
      }
    },

    async downloadCurrentFolder(folderID) {
      try {
        const { data } = await this.api.get(`/folders/${folderID}`);
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
