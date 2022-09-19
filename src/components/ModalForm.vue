<template>
  <v-dialog v-model="modalState" max-width="400">
    <slot></slot>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modalStateProp: {
      require: false,
    },
  },
  data() {
    return {
      modalState: false,
    };
  },
  mounted() {
    console.log("dialog mounted");
  },
  methods: {
    hideDialog() {},
  },
  watch: {
    modalStateProp(newVal) {
      this.modalState = newVal;
    },
    modalState(newVal) {
      console.log("modalChange ", newVal);
      this.$emit("modalChange", newVal);
    },
  },
};
</script>

<style scoped>
.dialog {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
}
.dialog__content {
  margin: auto;
  background: white;
  border-radius: 12px;
  min-height: 50px;
  min-width: 300px;
  padding: 20px;
}
</style>