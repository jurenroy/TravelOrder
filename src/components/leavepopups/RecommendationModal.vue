<template>
    <div class="note" v-if="recoms">
      <div class="title-bar">
        <div class="title">Recommendation</div>
        <div class="close-icon" @click="closeModal">X</div>
      </div>
  
      <div class="content">
        <div style="border: 2px solid black; margin-top: 2px; font-size: 10px; margin-left: -2px;">
          <p style="margin-left: 10px;">7.B RECOMMENDATION</p>
          <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
            <label class="containerlist">
              <input type="checkbox" v-model="recommendationLeavetype" :value="recommendationtype[0]">
              <svg viewBox="0 0 64 64" height="2em" width="2em">
                <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" class="path"></path>
              </svg>
            </label>
            <p>For approval</p>
          </div>
  
          <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
            <label class="containerlist">
              <input type="checkbox" v-model="recommendationLeavetype" :value="recommendationtype[1]">
              <svg viewBox="0 0 64 64" height="2em" width="2em">
                <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" class="path"></path>
              </svg>
            </label>
            <p>For disapproval due to:</p>
          </div>
  
          <textarea @keydown.enter.prevent v-model="text" id="myTextarea" :rows="rows"
            :class="{ 'not': !recommendationLeavetype.includes(2) }" :disabled="!recommendationLeavetype.includes(2)"
            style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 295px; margin-left: 20px; font-size: 13px"></textarea>
        </div>
  
        <div class="butokz">
          <button @click="postRecommendation" class="save-btn"
            :disabled="recommendationLeavetype < 1 || recommendationLeavetype.length === 0"
            :style="{ cursor: recommendationLeavetype < 1 || recommendationLeavetype.length === 0 ? 'not-allowed' : 'pointer' }">
            {{ recommendationLeavetype == 2 ? 'disapprove' : 'approve' }}
          </button>
          <button @click="closeModal" class="option-btn">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      recoms: Boolean,
      reconum: Number,
      // Add other props as needed
    },
    data() {
      return {
        recommendationLeavetype: [],
        text: '',
        recommendationtype: ['For Approval', 'For Disapproval'],
      };
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      postRecommendation() {
        // Your postRecommendation logic here
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>