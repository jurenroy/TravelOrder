<template>
  <div class="form">
    <h3>Add Leave</h3>

    <input v-model="form.value" placeholder="Value (e.g. 8 or -4)" />
    <input v-model="form.type" placeholder="Type (credit/debit/growth)" />
    <input v-model="form.description" placeholder="Description" />

    <button @click="submit">Submit</button>
  </div>
</template>

<script>
import axios from "axios";
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});
export default {
  data() {
    return {
      form: {
        user_id: 1,
        value: "",
        type: "",
        description: "",
      },
    };
  },

  methods: {
    async submit() {
      await api.post("/leave-benefits", this.form);

      this.form.value = "";
      this.form.type = "";
      this.form.description = "";

      this.$emit("refresh");
    },
  },
};
</script>

<style>
.form {
  margin-bottom: 20px;
}
input {
  display: block;
  margin: 5px 0;
  padding: 8px;
}
button {
  padding: 8px 12px;
}
</style>
