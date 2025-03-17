<template>
  <div class="rating-popup">
    <div class="popup-content">
      <h3>Rate Request</h3>
      <div class="star-rating">
        <span
          v-for="s in 4"
          :key="s"
          @click="setRating(s)"
          class="star"
          :class="{ active: s <= rating }"
          >★</span
        >
      </div>
      <div class="selected-label">{{ getLabel(rating) }}</div>
      <div class="popup-buttons">
        <button @click="submitRating">Submit</button>
        <button @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rating: 0,
    };
  },
  methods: {
    setRating(star) {
      this.rating = star;
    },
    submitRating() {
      this.$emit("submit", this.rating);
    },
    getLabel(star) {
      switch (star) {
        case 4:
          return "4 - Very Satisfied";
        case 3:
          return "3 - Satisfied";
        case 2:
          return "2 - Dissatisfied";
        case 1:
          return "1 - Very Dissatisfied";
        default:
          return "No Rating Selected";
      }
    },
  },
  onmounted() {
    this.rating = 0;
  },
};
</script>

<style scoped>
.rating-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(10px);
}
.popup-content {
  background: #fffbf2;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.7);
  text-align: center;
  width: 320px;
  color: #333;
  font-family: 'Arial', sans-serif;
}
h3 {
  font-size: 24px;
  margin-bottom: 20px;
}
.star-rating {
  font-size: 32px;
  color: #333129;
  cursor: pointer;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.star {
  transition: color 0.3s ease, transform 0.2s ease;
}
.star:hover {
  transform: scale(1.2);
}
.star.active {
  color: #ff9900;
}
.selected-label {
  margin-top: 10px;
  font-size: 18px;
  color: #555;
}
.popup-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  
}
.popup-buttons button {
  padding: 0.9em 1.4em;
  border-radius: 25px;
  font-size: 16px;
  min-width: 85px;
  min-height: 35px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: none;
  transition: 0.8s;
  background-size: 280% auto;
  background-image: linear-gradient(
    325deg,
    #3e2a20 0%,
    #ac9174 60%,
    #3e2a20 90%
  );
  color: #fffbf2;
  
}

.popup-buttons button:hover {
  background-position: right top;
}


@media (prefers-reduced-motion: reduce) {
  .popup-buttons button {
    transition: linear;
  }
}
.submitRating {
  background-color: #99500c;
  color: white;
}
.submitRating:hover {
  background-color: #7a4b23;
}
.close-btn {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  color: #333;
}
.close-btn:hover {
  background-color: #e0e0e0;
}
</style>
