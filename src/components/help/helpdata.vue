<template>
  <div>
    <!-- Button to toggle the popup -->
    <button @click="toggleHelpPopup" class="help-button">Help</button>

    <!-- Help Popup -->
    <div v-if="showHelpPopup" class="help-popup-overlay">
      <div class="help-popup-content">
        <!-- Close button -->
        <button class="help-close-button" @click="toggleHelpPopup">X</button>

        <!-- Display current instruction -->
        <div v-if="currentInstruction">
          <img :src="currentInstruction.image" :alt="currentInstruction.title" class="help-image" />
          <h2>{{ currentInstruction.title }}</h2>
          <p class="help-description">{{ currentInstruction.content }}</p>

          <!-- Navigation buttons -->
          <div class="navigation-buttons">
            <button @click="prevStep" :disabled="currentStep === 0">Back</button>
            <button @click="nextStep" :disabled="currentStep === instructions.length - 1">Next</button>
          </div>

          <!-- Instruction navigation -->
          <div class="instruction-navigation">
            <button
              v-for="(instruction, index) in instructions"
              :key="index"
              @click="setStep(index)"
              :class="{ 'selected': index === currentStep }"
            >
              {{ instruction.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { helpData } from './helpdata'; // Ensure the path is correct

const props = defineProps(['accountId']);

const showHelpPopup = ref(false);
const currentStep = ref(0);

// Default role-specific IDs
const sectionChiefIds = [39, 2, 3, 8, 42, 34, 29, 36, 48, 5, 47];
const divisionChiefIds = [15, 21, 45, 48];
const planningOfficerId = 37;
const rdIds = [15, 20, 21, 45, 48];

// Computed property for instructions based on account ID
const instructions = computed(() => {
  const defaultHelp = [
    helpData.user[0], // Dashboard
    helpData.user[1], // Edit Password Page
    helpData.user[2], // Add Travel Order
    helpData.user[3], // Dashboard with Travel Order
  ];

  if (props.accountId === 76) {
    // Include all helps for accountId 76
    return [...defaultHelp, ...helpData.user.slice(4)]; // All role-specific help
  }

  const roleSpecificHelp = [];

  if (sectionChiefIds.includes(props.accountId)) {
    roleSpecificHelp.push(helpData.user[4]); // Add Section Chief help
  }
  if (divisionChiefIds.includes(props.accountId)) {
    roleSpecificHelp.push(helpData.user[6]); // Add Division Chief help
  }
  if (props.accountId === planningOfficerId) {
    roleSpecificHelp.push(helpData.user[5]); // Add Planning Officer help
  }
  if (rdIds.includes(props.accountId)) {
    roleSpecificHelp.push(helpData.user[7]); // Add OIC or RD help
  }

  return [...defaultHelp, ...roleSpecificHelp]; // Combine default and role-specific help
});

const currentInstruction = computed(() => instructions.value[currentStep.value] || {});

const toggleHelpPopup = () => {
  showHelpPopup.value = !showHelpPopup.value;
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const nextStep = () => {
  if (currentStep.value < instructions.value.length - 1) {
    currentStep.value++;
  }
};

const setStep = (index) => {
  currentStep.value = index;
};
</script>

<style scoped>
.help-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  position: fixed;
  bottom: 10px;
  right: 10px;
  border-radius: 5px;
}

.help-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 35px;
}

.help-popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  width: 90%;
  max-width: 600px;
}

.help-close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.help-image {
  width: 100%;
  height: auto;
}

.help-description {
  margin: 10px 0;
}

.navigation-buttons {
  display: flex;
  justify-content: space-around;
}

.navigation-buttons button {
  background: transparent;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin: 2px;
  width: 40%;
  height: 50px;
}

.instruction-navigation {
  display: block;
  margin: 5px 0;
}

.instruction-navigation button {
  background: transparent;
  border: 1px solid #007bff;
  border-radius: 5px;
  color: #007bff;
  padding: 5px 10px;
  cursor: pointer;
  margin: 2px;
}

.instruction-navigation button.selected {
  background: #007bff;
  color: white;
}
</style>
