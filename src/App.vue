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
            <v-text-field
              v-if="registerModal"
              v-model="userName"
              label="Имя"
            ></v-text-field>
            <v-text-field
              :rules="[rules.email]"
              v-model="userEmail"
              label="Email"
            ></v-text-field>
            <v-text-field v-model="userPassword" label="Пароль"></v-text-field>
            <v-btn @click="auth" color="primary" class="ml-auto">{{
              registerModal ? "Регистрация" : "Войти"
            }}</v-btn>
          </v-card>
        </v-dialog>
      </div>
    </header>
    <v-divider class=""></v-divider>

    <v-main class="px-16" v-if="authorizationToken">
      <div class="d-flex justify-space-between align-center my-8">
        <v-btn
          v-if="currentFolder.id !== -1"
          @click="$router.push({ name: 'home' })"
          icon
          class="mr-8"
          ><v-icon color="primary" x-large>keyboard_backspace</v-icon></v-btn
        >
        <h1 class="text">
          {{
            currentFolder.name === "Корневая папка"
              ? currentFolder.name
              : "Папка: " + currentFolder.name
          }}
        </h1>
        <h1 class="">- {{ readableSize(this.folderSize) }}</h1>
        <v-text-field
          v-model="searchInputLoc"
          label="Поиск..."
          class="pt-0 mx-16"
        ></v-text-field>
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
              <v-text-field
                v-model="folderName"
                label="Название"
                :rules="[rules.required]"
              ></v-text-field>
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
import axios from "axios";
import CommonMixin from "@/mixins/CommonMixin";
import { mapMutations } from "vuex";

export default {
  name: "App",
  mixins: [CommonMixin],
  data: () => ({
    modalAuth: false,
    modalRegister: false,
    modalState: false,
    rules: {
      required: (value) => !!value || "Required.",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Неверный формат email.";
      },
    },
    folderName: "",
    userEmail: "",
    userPassword: "",
    userName: "",
    typeAuth: "",
    authError: false,
    searchInputLoc: "",
    folderSize: 0,
  }),
  computed: {
    registerModal() {
      return this.typeAuth === "register";
    },
  },
  methods: {
    ...mapMutations({
      setAuthorizationToken: "setAuthorizationToken",
    }),
    async addFolder() {
      if (!this.folderName) {
        return;
      }
      await axios.post(
        `${this.baseUrl}/folders`,
        {
          name: this.folderName,
        },
        {
          headers: {
            Authorization: this.authorizationToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      this.folderName = "";
      this.modalState = false;
      this.downloadFolders();
    },
    modalChange(val) {
      this.authModal = val;
    },
    modalAuthDefind(typeAuth) {
      this.modalAuth = true;
      this.typeAuth = typeAuth;
    },
    async auth() {
      const authLink = this.baseUrl + "/auth/" + this.typeAuth;
      const params = {
        email: this.userEmail,
        password: this.userPassword,
      };
      if (this.typeAuth === "register") {
        params.name = this.userName;
      }

      try {
        const resp = await axios.post(
          authLink,
          {},
          {
            params,
            headers: {
              Authorization: this.authorizationToken,
            },
          }
        );
        if (resp.status === 200) {
          this.setAuthorizationToken(resp.data.data.token);
          localStorage.setItem("authorizationToken", this.authorizationToken);
          this.modalAuth = false;
          this.authError = false;
        }
      } catch (e) {
        if (e.response.status === 422) {
          this.authError = true;
        }
      }
    },
    async logout() {
      await axios.post(
        `${this.baseUrl}/auth/logout`,
        {},
        {
          headers: {
            Authorization: this.authorizationToken,
          },
        }
      );
      localStorage.removeItem("authorizationToken");
      this.setAuthorizationToken("");
    },
  },
  watch: {
    modalAuth() {
      this.userEmail = "";
      this.userPassword = "";
      this.userName = "";
      this.authError = false;
    },
    searchInputLoc(newVal) {
      this.setSearchInput(newVal);
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
