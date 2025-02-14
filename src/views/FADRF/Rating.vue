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
  background: rgba(126, 71, 9, 0.856);
  padding: 60px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgb(218, 131, 0);
  z-index: 1000;
  text-align: center;
}

.popup-content {
  color: #f0eaea;
}

.star-rating {
  font-size: 24px;
  color: #f0eaea;
  cursor: pointer;
}

.star-rating span {
  margin: 5px;
  transition: color 0.3s;
}

.star-rating .filled {
  color: gold;
}



.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  gap: 10px;
}

.popup-buttons button {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background-color: transparent;
  border: 2px solid black; /* Added black border */
  padding: 10px 20px;
  font-size: 16px;
  transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out;
}

.popup-buttons button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background-color: rgba(162, 123, 92, 0.856);
  transition: left 0.3s ease-in-out;
  z-index: -1;
}

.popup-buttons button:hover::before {
  left: 0;
}

.popup-buttons button:hover {
  color: white;
  border-color: rgba(162, 123, 92, 0.856); /* Optional: Change border color on hover */
}
</style>
