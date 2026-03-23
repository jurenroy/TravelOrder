<template>
  <div class="title">
    <div class="navigationz">
      <p class="headerzz">Payslip Regular</p>
      <!-- <button class="add-button" @click="toggleForm">Generate DTR</button> -->
    </div>
    <div class="filter-switch">
      <!-- Radio button for Generate Payslip -->
      <input type="radio" id="option1" name="options" v-model="activeTab" value="generate" @change="emitAction('generate')" checked />
      <label for="option1">Generate Payslip</label>

      <!-- Radio button for View Payslip -->
      <input type="radio" id="option2" name="options" v-model="activeTab" value="view" @change="emitAction('view')" />
      <label for="option2">View Payslip</label>

      <span class="background"></span>
    </div>
  </div>

  <!-- Modal component only visible when isVisible is true -->
  <modal v-if="isVisible" :is-visible="isVisible" @sendDataToB="handleDataFromChildA" :tab-status="currentTabStatus" />
  <damn v-if="isVisible && dataForChildB" :receivedData="dataForChildB" />
</template>

<script setup>
import damn from "./table.vue";
import modal from "./form.vue";

const isVisible = ref(true);

const toggleForm = () => {
  isVisible.value = true; // show the modal
};

const activeTab = ref("generate");
const currentTabStatus = ref("generate");

// Emit the selected tab status ('generate' or 'view')
const emitAction = (tabStatus) => {
  currentTabStatus.value = tabStatus; // Update the status
  toggleForm(); // Show modal after emitting
};

// Switch between tabs
const switchTab = (tab) => {
  activeTab.value = tab;
};

// Constants for your components and methods
const dataForChildB = ref("");

// Direct functions (no methods object)
const handleDataFromChildA = (data) => {
  dataForChildB.value = data; // Pass data from Child A to Child B
};

const refreshKey = ref(0);

const handleRefresh = () => {
  refreshKey.value++;
};
</script>

<script>
import { ref } from "vue";
</script>

<style>
@media print {
  .title {
    display: none;
  }
}
</style>
