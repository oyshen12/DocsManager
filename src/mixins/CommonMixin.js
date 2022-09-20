import { mapState, mapMutations, mapGetters } from "vuex";
import axios from "axios";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      baseUrl: (state) => state.baseUrl,
      authorizationToken: (state) => state.authorizationToken,
      folders: (state) => state.folders,
      files: (state) => state.files,
      currentFolder: (state) => state.currentFolder,
      searchInput: (state) => state.searchInput,
    }),
    ...mapGetters({
      filtredFiles: "filtredFiles",
      filtredFolders: "filtredFolders",
    }),
  },
  methods: {
    ...mapMutations({
      setFolders: "setFolders",
      setAuthorizationToken: "setAuthorizationToken",
      setFiles: "setFiles",
      setSearchInput: "setSearchInput",
      setСurrentFolder: "setСurrentFolder",
    }),

    getFileExtention(fileName) {
      return fileName.split(".").pop();
    },

    async downloadFolders() {
      const { data } = await axios.get(`${this.baseUrl}/folders`, {
        headers: {
          Authorization: this.authorizationToken,
        },
      });
      this.setFolders(data.data);
    },

    async downloadFiles(folderID = -1) {
      const params = { folder_id: folderID };
      const { data } = await axios.get("http://markwebdev.ru/api/v1/files", {
        params,
        headers: {
          Authorization: this.authorizationToken,
        },
      });
      this.setFiles(data.data);
    },

    async downloadCurrentFolder(folderID) {
      const { data } = await axios.get(
        `http://markwebdev.ru/api/v1/folders/${folderID}`,
        {
          headers: {
            Authorization: this.authorizationToken,
          },
        }
      );
      this.setСurrentFolder(data.data);
    },

    readableSize(size) {
      return size < 1000 ? `${size} Б.` : `${Math.round(size / 1000)} Кб.`;
    },
  },
  mounted() {
    const authorizationToken = localStorage.getItem("authorizationToken");
    if (authorizationToken) {
      this.setAuthorizationToken("Bearer " + authorizationToken);
    }
  },
};
