<template>
  <div style="display: flex; justify-content: center">
  <div class="frontcontainer">
    <img src="../assets/background_image.png" class="frontpic">
    <div class="textzxc">
      <p class="p1">Republic of the Philipines</p>
      <p class="p2">Department of Environment and Natural Resources</p>
      <p class="p3">Mines and Geosciences Bureau</p>
      <p class="p4">Regional Office No.X</p>
      <p>MGB Application Form</p>
    </div>
    
    <div class="hakdogzzz">
      <button class="frontbutton" @click="navigateTo('TravelOrder')">Travel Order Form</button>
      <button class="frontbutton" @click="navigateTo('LeaveForm')">Leave Form</button>
    </div>
  
  </div>
  </div>
</template>

<script>
import { showstatus } from '@/components/heder.vue';
import { isRegistrationClicked, isEdits, employeelis, isButssClicked, isVisible} from './dashboard.vue';
import { showEdit } from '@/components/heder.vue';
import { isregisclick, leaveedit, employeelisleave, isaddleave, isleavelogoutClicked } from './leaveform.vue';
export default {
  data(){
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
        isRegistrationClicked.value =false
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
        isRegistrationClicked.value =false
        employeelis.value = false
        isregisclick.value = false
        leaveedit.value = false
        showEdit.value = false
      }
      this.$router.push({ name: routeName});
      localStorage.setItem('routerz', routeName);
    },
  },
};
</script>

<style>
.frontcontainer {
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.frontbutton {
  height: 60px;
  width: 300px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 10px;
  margin: 10px;
  cursor: pointer;
}

.hakdogzzz {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}

.frontpic {
  margin: 30px;
  height: 250px;
  width: auto;
}
.textzxc{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.p1, .p2, .p3, .p4{
  font-weight: bold;
  font-size: 25px;
  margin-top: -20px;
}

@media (max-width: 768px) {
  .hakdogzzz {
    justify-content: center;
    flex-direction: column;
  }
    .p1, .p2, .p3, .p4{
    font-size: 12px;
    margin-top: -10px;
  }
  .textzxc {
    text-align: center;
  }
}
</style>