import api from "@/mixins/Api";

export default {
  getFolders() {
    return api.get(`/folders`);
  },
  getFiles(_, params) {
    return api.get("/files", {
      params,
    });
  },
  getFolder(_, folderID) {
    return api.get(`/folders/${folderID}`);
  },
  createFolder({ commit }, name) {
    return api
      .post(`/folders`, {
        name,
      })
      .then((data) => {
        const newFolder = data.data;
        if (newFolder) {
          commit("pushFolder", newFolder);
        }
      });
  },
  authHandler({ commit }, { link, params }) {
    return api.post(link, params).then((resp) => {
      commit("setAuthorizationToken", resp.data.data.token);
      localStorage.setItem("authorizationToken", this.authorizationToken);
    });
  },
  logout({ commit }) {
    return api.post(`/auth/logout`).then(() => {
      localStorage.removeItem("authorizationToken");
      commit("setAuthorizationToken", "");
    });
  },
  createFile(_, payload) {
    return api
      .post(`/files`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((data) => {
        const newFile = data.data;
        if (newFile) {
          commit("pushFile", newFile);
        }
      });
  },
  deleteFile({ commit }, id) {
    return api.delete(`/files/${id}`).then(() => {
      commit("deleteFile", id);
    });
  },
  fileRename({ commit }, { id, name }) {
    return api.patch(`/files/${id}`, { name }).then(() => {
      commit("renameFile", { id, name });
    });
  },
  getFileLink(_, id) {
    return api.post(`/files/${id}/publish`);
  },
};
