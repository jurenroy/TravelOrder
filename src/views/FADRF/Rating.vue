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
      <div class="buttons">
        <button @click="submitRating">Submit</button>
      </div>
      <button class="close-buttons" @click="$emit('close')">&times;</button>
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
          return "Very Satisfied";
        case 3:
          return "Satisfied";
        case 2:
          return "Dissatisfied";
        case 1:
          return "Very Dissatisfied";
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

<style src="./CSS/rating.css" scoped></style>
