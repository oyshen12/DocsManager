import axios from "axios";
import store from "@/store";

export const api = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = store.state.authorizationToken;

  return config;
});

export default {
  data() {
    return {
      api: api,
    };
  },
};
