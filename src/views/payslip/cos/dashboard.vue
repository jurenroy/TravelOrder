<template>
  <div class="title">
    <div class="navigationz">
      <p class="headerzz">Payslip COS</p>
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

/* Base styles */
.filter-switch {
  background-color: black;
  border: 2px solid #ffc000;
  border-radius: 30px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  width: 100%;
  max-width: 1000px; /* Maximum width for larger screens */
  overflow: hidden;
  margin: 0 auto; /* Center the entire filter-switch block */
}

.filter-switch input {
  display: none;
}

.filter-switch label {
  flex: 1;
  text-align: center;
  cursor: pointer;
  border: none;
  border-radius: 30px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: all 0.5s;
  font-weight: 500;
  font-size: 18px;
}

.filter-switch .background {
  position: absolute;
  width: 49%;
  height: 38px;
  background-color: #ffc000;
  top: 4px;
  left: 4px;
  border-radius: 30px;
  transition: left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

#option2:checked ~ .background {
  left: 50%;
}

#option1:checked + label[for="option1"] {
  color: #212121;
  font-weight: bold;
}

#option2:checked + label[for="option2"] {
  color: #212121;
  font-weight: bold;
}

#option1:not(:checked) + label[for="option1"],
#option2:not(:checked) + label[for="option2"] {
  color: white;
  font-weight: bold;
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  .filter-switch {
    width: 90%; /* Make it smaller on mobile */
    height: 45px; /* Adjust height for better fit */
    max-width: 600px; /* Reduce the maximum width on mobile */
  }

  .filter-switch label {
    font-size: 14px; /* Smaller text size for mobile */
    padding: 10px 0; /* Adjust padding */
  }

  .filter-switch .background {
    height: 35px; /* Adjust background height for smaller screens */
  }
}

@media (max-width: 480px) {
  .filter-switch {
    height: 40px; /* Make it even smaller on very small screens */
  }

  .filter-switch label {
    font-size: 12px; /* Even smaller font size */
    padding: 8px 0;
  }

  .filter-switch .background {
    height: 30px; /* Smaller background height */
  }
}
</style>
