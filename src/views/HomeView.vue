<template>
  <div class="grid">
    <file-add></file-add>
    <folder-item
      v-for="folder in filtrededFiles"
      :folder="folder"
      :key="folder.id"
      class="mt-4"
    ></folder-item>
    <file-item
      v-for="file in filtrededFiles"
      :file="file"
      :key="file.id"
      class="mt-4"
    ></file-item>
  </div>
</template>

<script>
import FolderItem from "@/components/FolderItem.vue";
import FileItem from "@/components/FileItem.vue";
import FileAdd from "@/components/FileAdd.vue";
import CommonMixin from "@/mixins/CommonMixin";

export default {
  name: "Home",
  components: { FolderItem, FileItem, FileAdd },
  mixins: [CommonMixin],
  data() {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {
    this.downloadFolders();
    this.downloadFiles();
  },
};
</script>
<style scoped>
.grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  grid-gap: 1rem;
  justify-content: space-between;
}
</style>
