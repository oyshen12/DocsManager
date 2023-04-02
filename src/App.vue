<template>
  <v-app>
    <header class="d-flex align-center justify-space-between px-16">
      <div class="d-flex align-center py-3">
        <v-img src="@/assets/file.png" max-height="44" max-width="44"></v-img>
        <h1 class="ml-4">Документы</h1>
      </div>
      <div>
        <v-btn v-if="authorizationToken" @click="logout" color="primary"
          >Выйти</v-btn
        >
        <div v-else>
          <v-btn @click="modalAuthDefind('login')" color="primary">Войти</v-btn>
          <v-btn
            @click="modalAuthDefind('register')"
            color="primary"
            class="ml-4"
            >Регистрация</v-btn
          >
        </div>

        <v-dialog v-model="modalAuth" v-if="modalAuth" max-width="400">
          <v-card class="pa-8 d-flex flex-column">
            <v-card-title class="pl-0">{{
              registerModal ? "Регистрация" : "Авторизация"
            }}</v-card-title>
            <v-card-text v-if="authError" class="pl-0 red--text"
              >Неверный email или пароль</v-card-text
            >
            <MainInput
              v-if="registerModal"
              :value="userName"
              @input="userName = $event"
              label="Имя"
            />
            <MainInput
              :rules="['email']"
              :value="userEmail"
              @input="userEmail = $event"
              label="Email"
            />
            <MainInput
              :value="userPassword"
              @input="userPassword = $event"
              type-password
              label="Пароль"
            />
            <v-btn @click="auth" color="primary" class="ml-auto">{{
              registerModal ? "Регистрация" : "Войти"
            }}</v-btn>
          </v-card>
        </v-dialog>
      </div>
    </header>
    <v-divider class=""></v-divider>

    <v-main class="px-16 pb-8" v-if="authorizationToken">
      <div class="d-flex justify-space-between align-center my-8">
        <v-btn
          v-if="currentFolder.id !== -1"
          @click="$router.push({ name: 'home' })"
          icon
          class="mr-8"
          ><v-icon color="primary" x-large>keyboard_backspace</v-icon></v-btn
        >
        <h1 class="text">
          {{ folderName }}
        </h1>
        <h1 class="">- {{ readableSize(this.folderSize) }}</h1>
        <MainInput
          :value="searchInput"
          @input="setSearchInput($event)"
          label="Поиск..."
          class="pt-0 mx-16"
        />
        <div>
          <v-btn icon fab class="mr-4">
            <v-icon x-large color="black">list</v-icon>
          </v-btn>
          <v-btn
            v-if="currentFolder.id === -1"
            color="primary"
            @click="modalState = true"
          >
            Добавить папку <v-icon class="ml-2">folder</v-icon>
          </v-btn>
          <v-dialog v-model="modalState" v-if="modalState" max-width="400">
            <v-card class="pa-8 d-flex flex-column">
              <v-card-title class="pl-0">Добавить папку</v-card-title>
              <MainInput
                :value="folderName"
                @input="folderName = $event"
                label="Название"
                :rules="['required']"
              />
              <v-btn @click="addFolder" color="primary" class="ml-auto"
                >Добавить</v-btn
              >
            </v-card>
          </v-dialog>
        </div>
      </div>
      <router-view />
    </v-main>
    <h1 v-else class="text-center mt-8">
      Зарегистрируйтесь или войдите чтобы добавить файлы или папки
    </h1>
  </v-app>
</template>

<script>
import CommonMixin from "@/mixins/CommonMixin";
import { mapMutations, mapState } from "vuex";
import MainInput from "./components/MainComponents/MainInput.vue";

export default {
  name: "App",
  components: { MainInput },
  mixins: [CommonMixin],
  data: () => ({
    modalAuth: false,
    modalRegister: false,
    modalState: false,
    newFolderName: "",
    userEmail: "",
    userPassword: "",
    userName: "",
    typeAuth: "",
    authError: false,
    folderSize: 0,
  }),
  computed: {
    ...mapState(["searchInput"]),
    registerModal() {
      return this.typeAuth === "register";
    },
    folderName() {
      return currentFolder.name
        ? "Папка: " + currentFolder.name
        : "Корневая папка";
    },
  },
  methods: {
    ...mapMutations(["setAuthorizationToken"]),
    async addFolder() {
      if (!this.newFolderName) {
        return;
      }
      try {
        await this.api.post(`/folders`, {
          name: this.newFolderName,
        });
        this.newFolderName = "";
        this.modalState = false;
        this.downloadFolders();
      } catch {
        //
      }
    },
    modalChange(val) {
      this.authModal = val;
    },
    modalAuthDefind(typeAuth) {
      this.modalAuth = true;
      this.typeAuth = typeAuth;
    },
    async auth() {
      const authLink = "/auth/" + this.typeAuth;
      const params = {
        email: this.userEmail,
        password: this.userPassword,
      };
      if (this.typeAuth === "register") {
        params.name = this.userName;
      }

      try {
        const resp = await this.api.post(authLink, params);
        if (resp.status === 200) {
          this.setAuthorizationToken(resp.data.data.token);
          localStorage.setItem("authorizationToken", this.authorizationToken);
          this.modalAuth = false;
          this.authError = false;
        }
      } catch (e) {
        if (e.response?.status === 422) {
          this.authError = true;
        }
      }
    },
    async logout() {
      try {
        await this.api.post(`/auth/logout`);
        localStorage.removeItem("authorizationToken");
        this.setAuthorizationToken("");
      } catch {
        //
      }
    },
  },
  mounted() {
    const authorizationToken = localStorage.getItem("authorizationToken");
    if (authorizationToken) {
      this.setAuthorizationToken("Bearer " + authorizationToken);
    }
  },
  watch: {
    modalAuth() {
      this.userEmail = "";
      this.userPassword = "";
      this.userName = "";
      this.authError = false;
    },
    files(newFiles) {
      this.folderSize = newFiles.reduce((acc, el) => (acc += el.size), 0);
      if (this.currentFolder.id === -1) {
        const foldersSize = this.folders.reduce(
          (acc, el) => (acc += el.size),
          0
        );
        this.folderSize += foldersSize;
      }
    },
  },
};
</script>
