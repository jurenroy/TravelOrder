<template>
  <div class="title">
    <div class="navigationz">
      <p class="headerzz">2026 FWA-A DTR</p>
      <button class="add-button" @click="toggleForm" v-if="isAdmin">Generate DTR</button>
    </div>
  </div>
  <Attendance></Attendance>
  <Table></Table>
  <Form v-if="isVisible" @close="isVisible = false"></Form>
</template>

<script>
import Attendance from "./attendance.vue";
import Table from "../attendance/table.vue";
import Form from "./form.vue";
import { useAuthStore } from "@/store/auth";

export default {
  components: {
    Attendance,
    Table,
    Form,
  },
  data() {
    return {
      authStore: useAuthStore(),
      isVisible: false, // Vue 2 reactive state
    };
  },
  computed: {
    // Check if the user is an admin
    isAdmin() {
      return this.authStore.name_id === 76;
    },
    toggleForm() {
      this.isVisible = !this.isVisible; // show the modal
    },
  },
};
</script>

<style></style>
