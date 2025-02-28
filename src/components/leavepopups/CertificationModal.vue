<template>
    <div class="note" v-if="certif">
      <div class="title-bar">
        <div class="title">LEAVE CREDITS</div>
        <div class="close-icon" @click="closeModal">X</div>
      </div>
  
      <div class="content">
        <div style="border: 2px solid black; margin-top: 2px; font-size: 10px;">
          <p style="margin-left: 10px;">7.A CERTIFICATION OF LEAVE CREDITS</p>
          <div style="display: flex; flex-direction: row; justify-content: center; margin-left: 90px">
            <p>As of</p>
            <input
              style="height: 12px; width: 200px; border: none; border-bottom: 1.5px solid black; outline: none; font-size: 13px; margin-top: 7px; margin-left: 3px"
              v-model="leavecredits" class="leavecredits">
          </div>
          <div>
            <div class="grid-container" style="margin-left: 20px;">
              <div class="grid-item" style="border: solid black 1.5px;"></div>
              <div class="grid-item" style="width: 90px; border: solid black 1.5px;">Vacation Leave</div>
              <div class="grid-item" style="width: 90px; margin-left: -26.5px; border: solid black 1.5px;">Sick Leave</div>
              <div class="grid-item" style="border: solid black 1.5px;">Total Earned</div>
              <div class="grid-item" style="width: 90px; border: solid black 1.5px;">
                <input type="text" class="leavecredits" v-model="totalvacation" @input="nonumber($event, 'totalvacation')">
              </div>
              <div class="grid-item" style="width: 90px; margin-left: -26.5px; border: solid black 1.5px;">
                <input type="text" class="leavecredits" v-model="totalsick" @input="nonumber($event, 'totalsick')">
              </div>
              <div class="grid-item" style="border: solid black 1.5px;">Less this Application</div>
              <div class="grid-item" style="width: 90px; border: solid black 1.5px;">
                <input type="text" class="leavecredits" v-model="lessvacation" @input="nonumber($event, 'lessvacation')">
              </div>
              <div class="grid-item" style="width: 90px; margin-left: -26.5px; border: solid black 1.5px;">
                <input type="text" class="leavecredits" v-model="lesssick" @input="nonumber($event, 'lesssick')">
              </div>
              <div class="grid-item" style="border: solid black 1.5px;">Balance</div>
              <div class="grid-item" style="width: 90px; border: solid black 1.5px;">
                <input type="text" class="leavecredits" v-model="balancevacation" @input="nonumber($event, 'balancevacation')">
              </div>
              <div class="grid-item" style="width: 90px; margin-left: -26.5px; border: solid black 1.5px;">
                <input type="text" class="leavecredits" v-model="balancesick" @input="nonumber($event, 'balancesick')">
              </div>
            </div>
          </div>
          <div style="margin-left: 20px; margin-top: 10px;">
            <div style="display: flex; flex-direction: row; margin-top: -5px;">
              <input 
                style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black; outline: none; margin-right: 10px; font-size: 10px"
                v-model="withpay" class="leavecredits">
              <p style="font-size: 10px;">days with pay</p>
            </div>
            <div style="display: flex; flex-direction: row; margin-top: -5px;">
              <input class="leavecredits"
                style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black; outline: none; margin-right: 10px; font-size: 10px"
                v-model="withoutpay">
              <p>days without pay</p>
            </div>
            <div style="display: flex; flex-direction: row; margin-top: -5px;">
              <input class="leavecredits"
                style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black; outline: none; margin-right: 10px; font-size: 10px"
                v-model="othersSpecify">
              <p>others (Specify)</p>
            </div>
          </div>
        </div>
  
        <div class="butokz">
          <button @click="postCertification" v-if="[76,24].includes(this.nameId)" class="save-btn">Save</button>
          <button @click="postCertification" v-if="[76,2].includes(this.nameId)" class="save-btn">Certify</button>
          <button @click="closeModal" class="option-btn">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
export default {
  props: {
    certif: {
      type: Boolean,
      required: true,
    },
    certinum: {
      type: Number,
      required: true,
    },
    leavecredits: {
      type: String,
      default: '',
    },
    totalvacation: {
      type: String,
      default: '',
    },
    totalsick: {
      type: String,
      default: '',
    },
    lessvacation: {
      type: String,
      default: '',
    },
    lesssick: {
      type: String,
      default: '',
    },
    balancevacation: {
      type: String,
      default: '',
    },
    balancesick: {
      type: String,
      default: '',
    },
    withpay: {
      type: String,
      default: '',
    },
    withoutpay: {
      type: String,
      default: '',
    },
    othersSpecify: {
      type: String,
      default: '',
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    postCertification() {
      // Your postCertification logic here
    },
  },
};
</script>
  
  <style scoped>
  /* Add your styles here */
  </style>