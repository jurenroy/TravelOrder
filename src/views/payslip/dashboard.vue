<template>
  <div>
    <!-- Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click="handleOverlayClick">
      <div class="form-container" @click.stop>
        <h2 class="title">Select a Payslip Type</h2>
        <div class="choices">
          <button @click="goToRoute('/payslipcos')" class="choice-btn">Payslip COS</button>
          <button @click="goToRoute('/payslipreg')" class="choice-btn">Payslip Regular</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // Import useRouter for navigation

// Reactive references
const isModalOpen = ref(false);
const selectedChoice = ref(null);
const router = useRouter(); // Create a router instance

// Track the previous location using window.history
let previousLocation = null;
let userMadeChoice = false; // Flag to track whether the user selected a choice

// Open modal when component is mounted
onMounted(() => {
  isModalOpen.value = true;

  // Track the previous location when the modal opens
  previousLocation = window.location.href;
});

// Handle closing the modal when clicking the overlay
const handleOverlayClick = () => {
  if (!userMadeChoice) {
    goBack(); // If no choice was made, go back to the previous page
  }
  closeModal(); // Close the modal
};

// Close modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Navigate to route on button click
const goToRoute = (route) => {
  selectedChoice.value = route; // Optionally save the selected route
  console.log(`Navigating to: ${route}`);

  // Set the flag to indicate the user made a choice
  userMadeChoice = true;

  // Save current location before navigating
  previousLocation = window.location.href;

  // Navigate using Vue Router
  router.push(route);
  closeModal(); // Close modal after navigation without going back
};

// Go back to previous location using window.history
const goBack = () => {
  if (previousLocation) {
    window.location.href = previousLocation; // Go back to the last visited location
  } else {
    window.history.back(); // Fallback to history back if no location is found
  }
};
</script>

<style scoped>
/* Overlay to darken the background */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* Semi-transparent black overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Form container with luxury style */
.form-container {
  width: 90%;
  max-width: 750px;
  background: linear-gradient(180deg, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid #000000;
  position: absolute;
  z-index: 999;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-family: "Playfair Display", serif;
  text-align: center;
}

.choices {
  margin-bottom: 20px;
  text-align: center;
}

.choice-btn {
  padding: 18px 40px;
  font-size: 18px;
  font-weight: 700;
  background-color: #000000;
  color: rgb(255, 255, 255);
  border: solid black 2px;
  border-radius: 10px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  box-shadow: 0 10px 30px rgba(243, 156, 18, 0.3);
  font-family: "Playfair Display", serif;
  margin: 10px;
}

.choice-btn:hover {
  background-color: #ffeb3b;
  transform: scale(1.1);
}
</style>
