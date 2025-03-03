<template>
  <div class="rating-popup">
    <div class="popup-content">
      <h2>Rate this Request</h2>

      <div class="stars">
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
      <div class="buttons">
        <button @click="submitRating">Submit</button>
        <button @click="$emit('close')">Cancel</button>
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
      if (this.rating === 0) {
        alert("Please select a rating");
        return;
      }
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
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.popup-content {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(12px);
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
  max-width: 350px;
  width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

h2 {
  font-size: 1.6rem;
  font-weight: 600;
  color: #f8f8f8;
  margin-bottom: 12px;
}

.stars {
  font-size: 36px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.star {
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.3s ease, transform 0.2s ease;
}

.star.active {
  color: #ffb648; /* Orange from "UNRELEASE" button */
  transform: scale(1.15);
  text-shadow: 0px 0px 8px rgba(255, 182, 72, 0.7);
}

.star:hover {
  color: #ffcc00;
  transform: scale(1.2);
}

.selected-label {
  margin-top: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #f5f5f5;
}

.buttons {
  margin-top: 18px;
  display: flex;
  justify-content: center;
  gap: 14px;
}

button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

button.submit {
  background: #ffb648; /* Orange from "UNRELEASE" button */
  color: #3d2f1d;
  border: 1px solid #ffb648;
}

button.submit:hover {
  background: #e89e36;
  border-color: #e89e36;
}

button.cancel {
  background: #28a745; /* Green from "Released" button */
  color: white;
  border: 1px solid #28a745;
}

button.cancel:hover {
  background: #218838;
  border-color: #218838;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
