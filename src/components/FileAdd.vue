<template>
  <v-hover v-slot="{ hover }">
    <label for="myfile" class="label d-flex flex-column mt-4" id="uploadForm">
      <v-card
        :class="{ 'card-hover': hover }"
        class="d-flex flex-column py-6"
        min-height="268"
      >
        <input
          @change="fileuploadWindow"
          ref="inputFile"
          type="file"
          class="my"
          id="myfile"
          name="myfile"
        />
        <v-img
          max-height="92"
          max-width="92"
          class="align-self-center mt-4"
          src="@/assets/plus.png"
        ></v-img>
        <v-spacer></v-spacer>
        <h2 class="text-center">Добавить файл</h2>
        <v-dialog v-model="modalFile" v-if="modalFile" max-width="400">
          <v-card class="d-flex flex-column">
            <v-card-title>Имя файла: {{ file.name }}</v-card-title>
            <v-card-text>Тип файла: {{ file.type }}</v-card-text>
            <v-card-text>Размер файла: {{ file.size / 1000 }} Кб.</v-card-text>
            <div class="d-flex">
              <v-card-text class="pt-0"
                ><h3>
                  Файл удалится после:
                  <span class="font-weight-bold"
                    ><br />{{ fileDeleteDate }}</span
                  >
                </h3></v-card-text
              >
              <v-btn @click="setDateDeleteFile" color="primary" class="mr-4">{{
                pickerDateOpen ? "Удалить" : "Изменить"
              }}</v-btn>
            </div>

            <v-date-picker
              v-if="pickerDateOpen"
              v-model="pickerDate"
              :min="dateNow"
              class="mx-4"
            ></v-date-picker>
            <v-progress-circular
              v-if="fileLoading"
              :size="50"
              color="primary"
              indeterminate
              class="mx-4 my-4 align-self-center"
            ></v-progress-circular>
            <v-btn v-else @click="fileupload" color="primary" class="mx-4 my-4"
              >Добавить файл</v-btn
            >
          </v-card>
        </v-dialog>
      </v-card>
    </label>
  </v-hover>
</template>

<script>
import CommonMixin from "@/mixins/CommonMixin";

export default {
  props: {
    folderID: {
      require: false,
    },
  },
  mixins: [CommonMixin],
  data() {
    return {
      modalFile: false,
      file: "",
      pickerDate: "",
      pickerDateOpen: false,
      dateNow: 0,
      fileLoading: false,
    };
  },
  computed: {
    fileDeleteDate() {
      return this.pickerDate ? this.pickerDate : "Никогда";
    },
    fileDeleteDateChange() {
      return this.pickerDate ? "" : "Никогда";
    },
  },
  watch: {
    modalFile(newVal) {
      if (!newVal) {
        this.pickerDate = "";
        this.pickerDateOpen = false;
        this.fileLoading = false;
      }
    },
  },
  methods: {
    fileuploadWindow(event) {
      const file = this.$refs.inputFile.files[0];
      const fileExtention = this.getFileExtention(file.name);
      if (fileExtention === "php") {
        alert("Загрузка файлов php запрещена");
        return;
      }
      if (file.size > 20000000) {
        alert("Загрузка файлов больше 20 Мб. запрещена");
        return;
      }
      this.file = file;
      this.modalFile = true;
    },
    async fileupload() {
      const formData = new FormData();
      formData.append("file", this.file);
      if (this.pickerDate) {
        formData.append("expires_at", this.pickerDate);
      }
      if (this.currentFolder.id !== -1) {
        formData.append("folder_id", this.currentFolder.id);
      }

      this.fileLoading = true;
      try {
        await this.api.post(`/files`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.file = "";
        this.modalFile = false;
        this.pickerDate = "";
        this.pickerDateOpen = false;
        this.downloadFiles(this.currentFolder.id);
      } catch (e) {}
      this.fileLoading = false;
    },
    setDateDeleteFile() {
      if (this.pickerDateOpen) {
        this.pickerDate = "";
        this.pickerDateOpen = false;
      } else {
        const date = new Date();
        this.dateNow = date.toISOString();
        this.pickerDateOpen = true;
      }
    },
  },
};
</script>

<style scoped>
.card-hover {
  cursor: pointer;
  outline: 1px solid #1976d2;
}
.my {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.label {
  cursor: pointer;
}
</style>