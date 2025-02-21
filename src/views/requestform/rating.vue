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
        <button @click="submitRating">Submit </button>
        
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.stars {
  font-size: 30px;
  cursor: pointer;
}

.star {
  color: gray;
}

.star.active {
  color: gold;
}

.selected-label {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.buttons {
  margin-top: 20px;
}
</style>
