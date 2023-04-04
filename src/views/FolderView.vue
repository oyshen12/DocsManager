<template>
  <div class="grid">
    <file-add></file-add>
    <file-item
      v-for="file in filtrededFiles"
      :file="file"
      :key="file.id"
      class="mt-4"
    ></file-item>
  </div>
</template>

<script>
import CommonMixin from "@/mixins/CommonMixin";
import FileItem from "@/components/FileItem.vue";
import FileAdd from "@/components/FileAdd.vue";

export default {
  mixins: [CommonMixin],
  components: { FileItem, FileAdd },
  mounted() {
    this.downloadFiles(this.$route.params.id);
    this.downloadCurrentFolder(this.$route.params.id);
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