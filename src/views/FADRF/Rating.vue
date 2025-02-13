<template>
    <div class="rating-popup">
      <div class="popup-content">
        <h3>Rate Request</h3>
        <p>Requestor: {{ item ? getName(item.name_id) : '' }}</p>
        <select v-model="rating">
          <option value="1">1 - Poor</option>
          <option value="2">2 - Fair</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Very Good</option>
          <option value="5">5 - Excellent</option>
        </select>
        <div class="popup-buttons">
          <button @click="submitRating">Submit</button>
          <button @click="$emit('close')">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ["item"],
    data() {
      return {
        rating: "",
      };
    },
    methods: {
      submitRating() {
        console.log(`Rated ${this.item.name_id} with ${this.rating}`);
        this.$emit("close"); // Close the popup after submitting
      },
    },
  };
  </script>
  
  <style scoped>
  .rating-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
  }
  .popup-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  </style>
  