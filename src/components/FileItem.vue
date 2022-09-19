<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :class="{ 'card-hover': hover }"
      class="d-flex flex-column py-6"
      width="240"
    >
      <v-img
        max-height="92"
        max-width="92"
        class="align-self-center"
        src="@/assets/file.png"
      ></v-img>
      <h2 class="text-center">.{{ fileExtention }}</h2>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-card-title v-bind="attrs" v-on="on" class="pb-0 file-name">{{
            fileName
          }}</v-card-title>
        </template>
        <span>{{ fileName }}</span>
      </v-tooltip>
      <div class="d-flex justify-space-between align-center">
        <div>
          <v-card-text class="py-0">{{ fileDate }} г.</v-card-text>
          <v-card-text class="py-0"> {{ file.size / 1000 }} Кб</v-card-text>
        </div>
        <v-menu bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="getFileLink()">
              <v-icon>more_vert</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title
                ><a :href="fileLink" class="download-file"
                  >Загрузить Файл</a
                ></v-list-item-title
              >
            </v-list-item>
            <v-list-item @click="modalRenameOpen">
              <v-list-item-title>Переименовать Файл</v-list-item-title>
            </v-list-item>
            <v-list-item @click="getPublicLink">
              <v-list-item-title
                >Получить ссылку для скачивания</v-list-item-title
              >
            </v-list-item>
            <v-list-item @click="deleteFile">
              <v-list-item-title class="red--text"
                >Удалить Файл</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
        <v-dialog
          v-model="modalRenameFile"
          v-if="modalRenameFile"
          max-width="400"
        >
          <v-card class="d-flex flex-column">
            <v-card-title>Переименовать файл</v-card-title>
            <v-text-field
              v-model="newFileName"
              label="Имя"
              class="mx-8"
            ></v-text-field>
            <v-btn @click="fileRename" color="primary" class="ml-auto mr-8 mb-8"
              >Сохранить</v-btn
            >
          </v-card>
        </v-dialog>
        <v-dialog v-model="modalPublicLink">
          <v-card class="d-flex flex-column">
            <v-card-title>Ссылка для скачивания файла:</v-card-title>
            <v-text-field
              :value="fileLink"
              solo
              readonly
              class="mx-8"
            ></v-text-field>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
  </v-hover>
</template>

<script>
import CommonMixin from "@/mixins/CommonMixin";
import axios from "axios";

export default {
  props: {
    file: {
      require: true,
    },
  },
  mixins: [CommonMixin],
  data() {
    return {
      fileExtention: "",
      modalRenameFile: false,
      newFileName: "",
      fileLink: "",
      modalPublicLink: false,
    };
  },
  computed: {
    fileName() {
      return this.file.name.split(" ").join("");
    },
    fileDate() {
      const date = new Date(this.file.created_at);
      const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      const month =
        date.getMonth() + 1 < 10 ? "0" + date.getMonth() : date.getMonth();
      const year = date.getFullYear();

      const fileDate = `${day}.${month}.${year}`;
      return fileDate;
    },
  },
  watch: {
    modalRenameFile(newVal) {
      if (!newVal) {
        this.newFileName = "";
      }
    },
  },
  methods: {
    async deleteFile() {
      await axios.delete(`${this.baseUrl}/files/${this.file.id}`, {
        headers: {
          Authorization: this.authorizationToken,
        },
      });
      this.downloadFiles(this.currentFolder.id);
    },
    async fileRename() {
      if (!this.newFileName) {
        return;
      }
      await axios.patch(
        `${this.baseUrl}/files/${this.file.id}`,
        {},
        {
          params: {
            name: this.newFileName,
          },
          headers: {
            Authorization: this.authorizationToken,
          },
        }
      );
      this.modalRenameFile = false;
      this.downloadFiles(this.currentFolder.id);
    },
    async getFileLink() {
      if (this.fileLink) {
        return;
      }
      const resp = await axios.post(
        `${this.baseUrl}/files/${this.file.id}/publish`,
        {},
        {
          headers: {
            Authorization: this.authorizationToken,
          },
        }
      );
      this.fileLink = resp.data.data.link;
    },
    modalRenameOpen() {
      this.modalRenameFile = true;
      this.newFileName = this.file.name;
    },
    getPublicLink() {
      this.modalPublicLink = true;
    },
  },
  mounted() {
    this.fileExtention = this.getFileExtention(this.file.full_name);
  },
};
</script>

<style scoped>
.card-hover {
  cursor: pointer;
  outline: 1px solid #1976d2;
}
.file-name {
  word-break: normal !important;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.download-file {
  color: black;
  text-decoration: none;
}
</style>