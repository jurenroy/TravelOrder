<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

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

      <table>
  <thead>
    <tr>
      <th>
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="-30 -30 60 60">
          <circle cx="0" cy="0" r="30" fill="none" stroke="black" stroke-width="2"/>
          <circle cx="-10" cy="-8" r="3" fill="black"/>
          <circle cx="10" cy="-8" r="3" fill="black"/>
          <path d="M -15,12 A 15,15 0 0,0 15,12" fill="none" stroke="black" stroke-width="2" transform="rotate(180, 0, 12)"/>
        </svg>
      </th>
      <th>
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="-30 -30 60 60">
          <circle cx="0" cy="0" r="30" fill="none" stroke="black" stroke-width="2"/>
          <circle cx="-10" cy="-8" r="3" fill="black"/>
          <circle cx="10" cy="-8" r="3" fill="black"/>
          <path d="M -15,15 A 20,20 0 0,1 15,15" fill="none" stroke="black" stroke-width="2"/>
        </svg>
      </th>
      <th>

        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="-30 -30 60 60">
          <circle cx="0" cy="0" r="30" fill="none" stroke="black" stroke-width="2"/>
          <circle cx="-10" cy="-8" r="3" fill="black"/>
          <circle cx="10" cy="-8" r="3" fill="black"/>
          <path d="M -15,8 Q 0,20 15,8" fill="none" stroke="black" stroke-width="2"/>
        </svg>
      </th>
      <th>
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="-30 -30 60 60">
        <circle cx="0" cy="0" r="30" fill="none" stroke="black" stroke-width="2"/>
        <circle cx="-10" cy="-8" r="3" fill="black"/>
        <circle cx="10" cy="-8" r="3" fill="black"/>
        <path d="M -15,10 A 15,15 0 0,0 15,10" fill="none" stroke="black" stroke-width="2"/>
      </svg>
      </th>
    </tr>
  </thead>
  <tbody class="ratinglabel">
    <tr>
      <td>
        Very Dissatisfied
        <div style="text-align: center;">
          <span style="font-size: 16px;">★☆☆☆</span>
        </div>
      </td>
      <td>
        Dissatisfied
        <div style="text-align: center;">
          <span style="font-size: 16px;">★★☆☆</span>
        </div>
      </td>
      <td>
        Satisfied
        <div style="text-align: center;">
          <span style="font-size: 16px;">★★★★</span>
        </div>
      </td>
      <td>
        Very Satisfied
        <div style="text-align: center;">
          <span style="font-size: 16px;">★★★★★</span>
        </div>
      </td>
    </tr>
  </tbody>
</table>

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
      <table>
        <thead>
          <tr>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><i class="fa-regular fa-face-angry"></i></td>
            <td><i class="fa-regular fa-face-frown"></i></td>
            <td><i class="fa-regular fa-face-smile"></i></td>
            <td><i class="fa-regular fa-face-laugh"></i></td>
          </tr>
        </tbody>
      </table>
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

<style src="./CSS/rating.css"scoped ></style>

