<template>
  <v-text-field
    :value="value"
    @input="inputEvent"
    :label="label"
    :rules="enabledRules"
    :type="typeInput"
    :append-icon="appendIcon"
    @click:append="passwordVisible = !passwordVisible"
  ></v-text-field>
</template>

<script>
export default {
  name: "MainInput",
  props: {
    value: {
      required: true,
      type: String,
    },
    label: {
      type: String,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    typePassword: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      passwordVisible: false,
    };
  },
  computed: {
    validateRules() {
      return {
        required: (v) => v !== "" || "Обязательное поле",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Неверный формат email.";
        },
      };
    },
    enabledRules() {
      const rules = [];
      Object.keys(this.validateRules).map((rule) => {
        if (this.rules.includes(rule)) {
          rules.push(this.validateRules[rule]);
        }
      });
      return rules;
    },
    typeInput() {
      if (this.typePassword) {
        return this.passwordVisible ? "text" : "password";
      }
      return "text";
    },
    appendIcon() {
      if (this.typePassword) {
        return this.passwordVisible ? "mdi-eye" : "mdi-eye-off";
      }
      return "";
    },
  },
  methods: {
    inputEvent(value) {
      this.$emit("input", value);
    },
  },
};
</script>
