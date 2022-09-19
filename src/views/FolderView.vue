<template>
  <div class="d-flex flex-wrap justify-md-space-between">
    <file-add></file-add>
    <file-item
      v-for="file in filtredFiles"
      :file="file"
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
  data() {
    return {};
  },
  mounted() {
    this.downloadFiles(this.$route.params.id);
  },
};
</script>

<style scoped>
</style>