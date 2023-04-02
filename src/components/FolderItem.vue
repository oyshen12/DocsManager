<template>
  <v-hover v-slot="{ hover }">
    <v-card
      @click="goToFolder"
      :class="{ 'card-hover': hover }"
      class="d-flex flex-column py-6"
    >
      <v-img
        max-height="128"
        max-width="128"
        class="align-self-center"
        src="@/assets/folder.png"
      ></v-img>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-card-title v-bind="attrs" v-on="on" class="pb-0 folder-name">{{
            folderName
          }}</v-card-title>
        </template>
        <span>{{ folderName }}</span>
      </v-tooltip>
      <v-card-text class="py-0">{{ folderDate }} г.</v-card-text>
      <v-card-text class="py-0"> {{ readableSize(folder.size) }}</v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
import CommonMixin from "@/mixins/CommonMixin";

export default {
  props: {
    folder: {
      require: true,
    },
  },
  mixins: [CommonMixin],
  data() {
    return {};
  },
  computed: {
    folderName() {
      return this.folder.name.split(" ").join("");
    },
    folderDate() {
      const date = new Date(this.folder.created_at);
      const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      const month =
        date.getMonth() + 1 < 10 ? "0" + date.getMonth() : date.getMonth();
      const year = date.getFullYear();

      const fileDate = `${day}.${month}.${year}`;
      return fileDate;
    },
  },
  methods: {
    goToFolder() {
      this.setCurrentFolder({ id: this.folder.id, name: this.folder.name });
      this.setFiles([]);
      this.$router.push({ name: "folder", params: { id: this.folder.id } });
    },
  },
};
</script>

<style scoped>
.card-hover {
  cursor: pointer;
  outline: 1px solid #fcd462;
}
.folder-name {
  word-break: normal !important;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>