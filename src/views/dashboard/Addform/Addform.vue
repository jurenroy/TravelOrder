<template>
  <div class="dropdown-wrapper">
    <div style="display: flex; flex-direction: row; justify-content: center; gap: 30px; margin-bottom: 30px;">
    <div class="dropdown-container" @click="handleClickOutside">
      <div class="dropdown-trigger" @click="toggleDropdown">
        Add form for: {{ selectedOption || 'Select an option' }}
      </div>

      <div class="dropdown-menu" :class="{ open: isDropdownOpen }">
        <div class="dropdown-item" @click="selectOption('Travel Order')">
          <span class="dropdown-item-icon"></span>
          Travel Order
        </div>
        <div class="dropdown-item" @click="selectOption('Leave Form')">
          <span class="dropdown-item-icon"></span>
          Leave Form
        </div>
        <div class="dropdown-item" @click="selectOption('ICT Request')">
          <span class="dropdown-item-icon"></span>
          ICT Request
        </div>
        <div class="dropdown-item" @click="selectOption('Admin Request')">
          <span class="dropdown-item-icon"></span>
          Admin Request
        </div>
        <div class="dropdown-item" @click="selectOption('Procurement Request')">
          <span class="dropdown-item-icon"></span>
          Procurement Request
        </div>
      </div>
    </div>
    <div>
      <div class="dropdown-trigger" style="background-color: red;" @click="clearSelection" v-if="selectedOption">
          Close
        </div>
    </div>
    </div>
    <!-- Render the selected form component -->
    <component :is="currentForm" v-if="currentForm" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TravelForm from '@/views/travelorderV2/Form.vue';
import ICTForm from '@/views/ictsrf/form.vue';
import LeaveForm from '@/views/leaveform/Form.vue';
import ProcurementForm from '@/views/FADRF/Form.vue';
import AdminForm from '@/views/requestform/requestform.vue';

const isDropdownOpen = ref(false);
const selectedOption = ref(null);
const currentForm = ref(null);

// Toggle dropdown visibility
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

// Handle option selection
function selectOption(option) {
  selectedOption.value = option;
  switch (option) {
    case 'Travel Order':
      currentForm.value = TravelForm;
      break;
    case 'Leave Form':
      currentForm.value = LeaveForm;
      break;
    case 'ICT Request':
      currentForm.value = ICTForm;
      break;
    case 'Admin Request':
      currentForm.value = AdminForm;
      break;
    case 'Procurement Request':
      currentForm.value = ProcurementForm;
      break;
    default:
      currentForm.value = null;
  }
  isDropdownOpen.value = false; // Close dropdown after selection
}

// Clear the selection
function clearSelection() {
  selectedOption.value = null;
  currentForm.value = null; // Reset the form component
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  const dropdownContainer = event.currentTarget;
  if (!dropdownContainer.contains(event.target) && isDropdownOpen.value) {
    isDropdownOpen.value = false;
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa;
}

.dropdown-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dropdown-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.dropdown-trigger {
  width: 100%;
  padding: 14px 20px;
  background: #4a6cf7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.25);
}

.dropdown-trigger:hover {
  background: #3a5cef;
  box-shadow: 0 6px 16px rgba(74, 108, 247, 0.35);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transform-origin: top;
  transform: scaleY(0);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 100;
}

.dropdown-menu.open {
  transform: scaleY(1);
  opacity: 1;
}

.dropdown-item {
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  color: #333;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f5f7fa;
  color: #4a6cf7;
}

.selected-option {
  margin-top: 20px;
  padding: 14px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: #555;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item-icon {
  margin-right: 12px;
  width: 20px;
  height: 20px;
  display: inline-block;
  background: #f0f0f0;
  border-radius: 4px;
}
</style>