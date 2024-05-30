<template>
  <div class="frontcontainer">
    <div class="frontpic"> 
    <img src="../assets/background_image.png">
  </div>
    
    <div style="margin-top: 20px; font-size: 24px; font-weight: bold; ">
      <p >Republic of the Philipines<br>
        Department of Environment and Natural Resources<br>
        Mines and Geosciences Bureau<br>
        Regional Office No.X</p>
      <div style="display: flex; justify-content: center; margin-top: 30px;">
        <p>MGB Application Form</p>
      </div>

    </div>
    <div class="hakdogzzz">
      <button class="frontbutton" @click="navigateTo('TravelOrder')">Travel Order Form</button>
      <button class="frontbutton" @click="navigateTo('LeaveForm')">Leave Form</button>
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
  margin-top: 30px;
}

@media (max-width: 768px) {
  .hakdogzzz {
    justify-content: center;
    flex-direction: column;

  }

  .frontpic {
    margin-top: -15px;
    height: 200px;
    margin-bottom: 150px;
  }

}
</style>