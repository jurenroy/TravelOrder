<template>
    <div class="note" v-if="appr">
      <div class="title-bar">
        <div class="title">Approval</div>
        <div class="close-icon" @click="closeModal">X</div>
      </div>
  
      <div class="content">
        <div style="border: 2px solid black; margin-top: 2px; font-size: 10px; margin-left: -2px;">
          <p style="margin-left: 10px;">APPROVAL {{appronum}}</p>
          <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
            <label class="containerlist">
              <input type="checkbox" v-model="approveLeavetype" :value="approvetype[0]">
              <svg viewBox="0 0 64 64" height="2em" width="2em">
                <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" class="path"></path>
              </svg>
            </label>
            <p>For approval</p>
          </div>
  
          <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
            <label class="containerlist">
              <input type="checkbox" v-model="approveLeavetype" :value="approvetype[1]">
              <svg viewBox="0 0 64 64" height="2em" width="2em">
                <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" class="path"></path>
              </svg>
            </label>
            <p>For disapproval due to:</p>
          </div>
  
          <textarea @keydown.enter.prevent v-model="text2" id="myTextarea" :rows="rows"
            :class="{ 'not': !approveLeavetype.includes(2) }" :disabled="!approveLeavetype.includes(2)"
            style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 290px; margin-left: 20px; font-size: 13px;"></textarea>
        </div>
  
        <div class="butokz">
          <button @click="postApproval" :disabled="(approveLeavetype < 1 || approveLeavetype.length === 0) || (approveLeavetype < 1 || approveLeavetype.includes(2))" class="save-btn"
            :style="{ cursor: (approveLeavetype < 1 || approveLeavetype.length === 0) || (approveLeavetype < 1 || approveLeavetype.includes(2) && !text2) ? 'not-allowed' : 'pointer' }">
            {{ approveLeavetype == 2 ? 'disapprove' : 'approve' }}
          </button>
          <button @click="closeModal" class="option-btn">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      appr: Boolean,
      apronum: Number,
      // Add other props as needed
    },
    data() {
      return {
        approveLeavetype: [],
        text2: '',
        approvetype: ['For Approval', 'For Disapproval'],
      };
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      postApproval() {
        // Your postApproval logic here
      },
    },
  };
  </script>
  
  <style scoped>
  .note {
  width: 380px;
  background: linear-gradient(150deg, #DDC7AD, #92785b);
  border: 2px solid #000000;
  border-radius: 5px;
  padding: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}
.option-btn {
  background-color: transparent;
  color: #000000;
  border: 1px solid #000000;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}
.option-btn:hover {
  background-color: #000000;
  color: #ffffff;
}
.save-btn {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  background-color: #000000;
  color: #ffffff;
}
.save-btn:hover {
  transform: scale(1.05);
  background-color: #2e2e2e;
  color: #ffffff;
}
  </style>