<template>
  <div class="front-cont">
    <div class="frontcontainer">
      <div class="hakdogzzz">
        <button class="frontbutton trabel-btn" @click="navigateTo('TravelOrder')"><div class="trabel-cont"><p class="travel-text">Travel Order Form</p></div></button>
        <button class="frontbutton leave-btn" @click="navigateTo('LeaveForm')"><div class="leave-cont"><p class="leave-text">Leave Form</p></div></button>
      </div>
      <div class="details-cont">
        <img src="../assets/logo-white.png" class="frontpic">
        <div class="textzxc">
          <p class="p1">Republic of the Philipines</p>
          <p class="p2">Department of Environment and Natural Resources</p>
          <p class="p3">Mines and Geosciences Bureau</p>
          <p class="p4">Regional Office No.X</p>
          <p class="p5">MGB Application Form</p>
      </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { showstatus } from '@/components/heder.vue';
import { isRegistrationClicked, isEdits, employeelis, isButssClicked, isVisible } from './dashboard.vue';
import { showEdit } from '@/components/heder.vue';
import { isregisclick, leaveedit, employeelisleave, isaddleave, isleavelogoutClicked } from './leaveform.vue';
import './../styles/frontpage.css'
export default {
  data() {
    return {
      showstatus: true,
    }
  },
  methods: {
    navigateTo(routeName) {
      if (routeName === 'LeaveForm') {
        showstatus.value = false
        isButssClicked.value = false
        isaddleave.value = false
        isEdits.value = false
        isRegistrationClicked.value = false
        employeelisleave.value = false
        isregisclick.value = false
        leaveedit.value = false
        showEdit.value = false
        isleavelogoutClicked.value = false
      } else {
        showstatus.value = true;
        isVisible.value = false
        isButssClicked.value = false
        isEdits.value = false
        isRegistrationClicked.value = false
        employeelis.value = false
        isregisclick.value = false
        leaveedit.value = false
        showEdit.value = false
      }
      this.$router.push({ name: routeName });
      localStorage.setItem('routerz', routeName);
    },
  },
};
</script>

<style>

</style>