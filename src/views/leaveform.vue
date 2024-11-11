<template>
  <headers v-if="showHeader1" class="headz"  @toggleEdit="handleEditToggle" @toggleLogout="handleLogoutToggle"/>
  <headers1 v-if="showHeader2" class="headx"/>
  <div style=" position: relative; top: 80px; left: 10px; display: flex; flex-direction: row;" v-if="showleavehome && acc.signature !== null" class="leverage">
    <img src="../assets/home.png" style="height: 30px; width: 30px; cursor: pointer;" @click="$router.push('/')">
    <p style="margin-left:10px; font-size: 20px; margin-top: 9px; cursor: pointer;" @click="$router.push('/')">Home</p>
  </div>
  <div class="titlez" v-if="!isregisclick && !employeelisleave && !leaveedit && acc.signature !== null">
      <div>
         <p class="travel">Leave Form</p>
      </div>
      <div class="navigationz">
         <button class="addleave" @click="toggleForm">{{ isaddleave ? 'Close Form' : 'Add Form'}}</button>
         <button v-if="!isVisible && acc.type_id == 1 && acc.name_id == 76" class="regleave" @click="toggleRegistration">{{'Registration' }}</button>
         <button v-if="!isVisible && acc.type_id == 1" class="emploleave" @click="employeelst">{{'Employee List' }}</button>
      </div>
   </div>

   <editss v-if="isEdits && isregisclick"/>
   <regis v-if="isregisclick && !isEdits" :show="isregisclick" @handleBack="handleBack"/>
   <employeelist v-if="employeelisleave && !isEdits"/>
   <editpage v-if="leaveedit" :show="leaveedit" @handleBack2="handleBack2"/>
   <signature v-if="acc.signature === null" />
   <leavetable v-if="!isaddleave && !isregisclick && !employeelisleave && !leaveedit && acc.signature !== null" />
   <leavelogout v-if="isleavelogoutClicked" :show="isleavelogoutClicked" @handleNo="handleNo"/>
   <leaveleave v-if="(isaddleave && !leaveedit)"/>
</template>

<script setup>
import leaveleave from './formleave2.vue'
import employeelist from './employeelist.vue';
import regis from './regis.vue';
import editpage from './editpage.vue';
import headers from '../components/heder.vue'
import leavetable from '../views/leavetable.vue'
import signature from '../components/signature.vue'
import headers1 from '../components/heder2.vue'
import leavelogout from '../components/logout.vue'
import { showEdit } from '../components/heder.vue';
import addleaveform from '../views/addleaveform.vue'
import { hideedit } from '../components/heder.vue';


const handleBack = () => {
  isregisclick.value = false; // Close the popup
};
const handleBack2 = () => {
   leaveedit.value = false; // Close the popup
};
const handleNo = () => {
   isleavelogoutClicked.value = false; // Close the popup
};
const handleEditToggle = () => {
   leaveedit.value = true; // Close the popup
};
const handleLogoutToggle = () => {
  isleavelogoutClicked.value = true; // Close the popup
};
</script>


<script>
import { ref } from 'vue';
import axios from 'axios';
import addleaveformVue from './addleaveform.vue';
import leavetableVue from './leavetable.vue';
import { API_BASE_URL } from '../config'
const accountId = localStorage.getItem('accountId');
const isaddleave = ref(false);
const isregisclick = ref(false);
const employeelisleave = ref(false);
const isleavelogoutClicked = ref(false);
const leaveedit = ref(false);
const acc = ref([]);

//header
const showHeader1 = ref(true)
const showHeader2 = ref(false)
const showleavehome = ref(true)



// visible sa  Add form
const toggleForm = () => {
  isaddleave.value = !isaddleave.value
  showEdit.value = false
  showleavehome.value = false
};

const formback = () => {
  isaddleave.value = false;
  showEdit.value = false
  isregisclick.value = false;
  leaveedit.value = false;
};

// makita ang registration
const toggleRegistration = () => {
  isregisclick.value = true;
  showEdit.value = false;
  showleavehome.value = false
};

const employeelst = () => {
  employeelisleave.value = true;
  showEdit.value = false;
  showleavehome.value = false
};

//ma back ang registration
const backButton = () => {
  isRegistrationClicked.value = false;
  isaddleave.value = false;
  showEdit.value = false
  isregisclick.value = false;
};

const backButtonemp = () => {
  employeelisleave.value = false;
  isaddleave.value = false;
};

//makita ang logout
const logButton = () => {
  isleavelogoutClicked.value = true;
};

const noleaveButton = () => {
  isleavelogoutClicked.value = false;
  showHeader1.value = true;
  showHeader2.value = false
};

const showEditss = () => {
  leaveedit.value = true
}



// Fetch OTP data function
const fetchAccounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_accounts_json/`);
    acc.value = response.data.find(result => result.account_id == accountId);
  } catch (error) {
    console.error('Error fetching OTP data:', error);
  }
};
const loginstate = () => {
  const state = localStorage.getItem('isLoggedIn');
  if (!state) {
    localStorage.setItem('isLoggedIn', false);
  }
}

loginstate()
fetchAccounts()


export {
  isaddleave,
  isleavelogoutClicked,
  showHeader1,
  showHeader2,
  leaveedit,
  isregisclick,
  employeelisleave,
  showleavehome,
  noleaveButton,
  toggleForm,
  toggleRegistration,
  employeelst,
  backButtonemp,
  backButton,
  logButton,
  showEditss,
  formback
};
</script>


<style scoped>
.travel {
  font-weight: bold;
  font-size: 40px;
  margin-top: -25px;
}

.addleave {
  height: auto;
  width: 150px;
  padding: 5px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 7px 7px 12px black;
  cursor: pointer;
}

.back {
  margin-top: -19px;
  margin-top: 13px;
  height: auto;
  width: 95px;
  padding: 5px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.regleave {
  height: auto;
  width: 150px;
  padding: 5px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 7px 7px 12px black;
  cursor: pointer;
  margin-left: 20px;
}

.emploleave {
  height: auto;
  width: 160px;
  padding: 5px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 7px 7px 12px black;
  cursor: pointer;
  margin-left: 20px;
}

.logssssleave {
  flex-direction: column;
  justify-content: center;
  top: 0px;
  width: auto
}

.sigleave {
  margin-top: 100px;
}
.navigationz{
   display: flex;
   flex-direction: row;
}

.titlez{
   display: flex; 
   flex-direction: column; 
   align-items: center; 
   margin-top: 100px;
}

@media (max-width: 768px) {
   .navigationz{
   flex-direction: column;
   }
   .addleave{
      margin-bottom: 30px;
   }
   .regleave{
      margin-top: -19px;
      margin-bottom: 30px;
      margin-left: 0px;
   }
   .emploleave{
      margin-top: -19px;
      margin-bottom: 13px;
      margin-left: -5px;
   }
   .formz{
      margin-top: 110px;
   }
   .regiz{
      display: flex;
      justify-content:center; 
      margin-top: -100px;
   }
   .empeee{
      margin-right: 0px;
   }
}


@media print {
  .addleave {
    display: none !important;
  }

  .regleave {
    display: none !important;
  }

  .emploleave {
    display: none !important;
  }

  .tra {
    display: none !important;
  }
  .leverage{
    display: none !important;
  }
  .travel{
    display: none !important;
  }
}
</style>