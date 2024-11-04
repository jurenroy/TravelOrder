<template>
   <headers v-if="showHeader1" class="headz" @toggleEdit="handleEditToggle" @toggleLogout="handleLogoutToggle"/>
   <headers1 v-if="showHeader2" class="headx"/>
   <div style=" position: relative; top: 80px; left: 10px; display: flex; flex-direction: row;" v-if="showhome" class="homerun">
      <img src="../../assets/home.png" style="height: 30px; width: 30px; cursor: pointer;" @click="$router.push('/')">
      <p style="margin-left:10px; font-size: 20px; margin-top: 9px; cursor: pointer;" @click="$router.push('/')">Home</p>
    </div>
   <div class="titlez" v-if="!isRegistrationClicked && !employeelis && !isEdits">
      <div>
         <p class="travel" >Special Order</p>
      </div>
      <div class="navigationz" >
         <button class="add" @click="toggleForm">{{ isVisible ? 'Close Form' : 'Add Form'}}</button>
         <button v-if="!isVisible && acc.type_id == 1 && acc.name_id == 76" class="reg" @click="toggleRegistration">{{'Registration' }}</button>
         <button v-if="!isVisible && acc.type_id == 1" class="emplo" @click="employeelst">{{'Employee List' }}</button>
      </div>
   </div>
   <tablez class="tablex" v-if="!isVisible && !isRegistrationClicked && !isEdits && !employeelis"/>
   <addforms class="formz" v-if="isVisible"/>
   <registrationform class="regixcv" v-if="isRegistrationClicked && !isEdits && !employeelis" :show="isRegistrationClicked" @handleBack="handleBack"/>
   <employeelist class="empex" v-if="employeelis && !isEdits"/>
   <signature class="sig" v-if="acc.signature === null" />
   <editss class="edix" v-if="isEdits" :show="isEdits" @handleBack2="handleBack2"/>
   <logsss class="logssss" v-if="isButssClicked" :show="isButssClicked" @handleNo="handleNo"/>
   <Help class="tabang" :accountId="acc.name_id" />
</template>


<script setup>


import headers from '../../components/heder.vue'
import signature from '../../components/signature.vue'
import headers1 from '../../components/heder2.vue'
import addforms from './../form.vue';
import tablez from './table.vue';
import registrationform from './../regis.vue';
import employeelist from '../../views/employeelist.vue'
import logsss from '../../components/logout.vue'
import editss from '../../views/editpage.vue'
import { showEdit } from '../../components/heder.vue';
import { isleavelogoutClicked, isregisclick } from './../leaveform.vue';
import Help from '../../components/help/helpdata.vue'; // Adjust the path if necessary

const handleBack = () => {
  isRegistrationClicked.value = false; // Close the popup
};

const handleBack2 = () => {
   isEdits.value = false; // Close the popup
};

const handleNo = () => {
   isButssClicked.value = false; // Close the popup
};

const handleEditToggle = () => {
   isEdits.value = true; // Close the popup
};
const handleLogoutToggle = () => {
   isButssClicked.value = true; // Close the popup
};
</script>


<script>
import { ref } from 'vue';
import axios from 'axios';
import { showleavehome } from './../leaveform.vue';
import { API_BASE_URL } from '../../config'

const accountId = localStorage.getItem('accountId');
const isVisible = ref(false);
const isRegistrationClicked = ref(false);
const employeelis = ref(false);
const isButssClicked = ref(false);
const isEdits = ref(false);
const acc = ref([]);
const showhome = ref(true)

//header
const showHeader1 = ref(true)
const showHeader2 = ref(false)

// visible sa  Add form
const toggleForm = () => {
   isVisible.value = !isVisible.value;
   showEdit.value = false
   showhome.value = !showhome.value
};

// makita ang registration
const toggleRegistration = () => {
   isRegistrationClicked.value = true;
   showEdit.value = false;
   showhome.value = false
};

const employeelst = () => {
   employeelis.value = true;
   showEdit.value = false;
   showhome.value = false
};

//ma back ang registration
const backButton = () => {
   isRegistrationClicked.value = false;
   isVisible.value = false;
   showEdit.value = false
   isregisclick.value = false;
   showhome.value = true
   showleavehome.value = true;

};

const backButtonemp = () => {
   employeelis.value = false;
   isVisible.value = false;
};

//makita ang logout
const logButton = () => {
   isButssClicked.value = true;
};

const noButton = () => {
   isButssClicked.value = false;
   isleavelogoutClicked.value = false;
   showHeader1.value = true;
   showHeader2.value = false

};

const showEditss = () => {
   isEdits.value = true
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
   isVisible,
   isRegistrationClicked,
   isButssClicked,
   showHeader1,
   showHeader2,
   isEdits,
   employeelis,
   noButton,
   toggleForm,
   toggleRegistration,
   employeelst,
   backButton,
   backButtonemp,
   logButton,
   showEditss
};
</script>


<style scoped>
.travel {
   font-weight: bold;
   font-size: 40px;
   margin-top: 10px;
}

.add {
   margin-top: -19px;
   margin-bottom: 13px;
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
   height: auto;
   width: 95px;
   padding: 5px;
   border-radius: 10px;
   font-size: 20px;
   font-weight: bold;
   cursor: pointer;
}

.reg {
   margin-top: -19px;
   margin-bottom: 13px;
   margin-left: 20px;
   height: auto;
   width: 150px;
   padding: 5px;
   border-radius: 10px;
   font-size: 20px;
   font-weight: bold;
   box-shadow: 7px 7px 12px black;
   cursor: pointer;
}

.emplo {
   margin-top: -19px;
   margin-bottom: 13px;
   margin-left: 20px;
   height: auto;
   width: 160px;
   padding: 5px;
   border-radius: 10px;
   font-size: 20px;
   font-weight: bold;
   box-shadow: 7px 7px 12px black;
   cursor: pointer;
}

.logssss {
   flex-direction: column;
   justify-content: center;
   top: 0px;
   width: auto
}

.sig {
   margin-top: 100px;

}

.navigationz{
   display: flex;
   flex-direction: row;
}

.formz{
   display: flex;
   justify-content:center; 
   margin-top: 0px;
}

.regiz{
   display: flex;
   justify-content:center; 
   margin-top: 0px;
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
   .add{
      margin-bottom: 30px;
   }
   .reg{
      margin-top: -19px;
      margin-bottom: 30px;
      margin-left: 0px;
   }
   .emplo{
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
   .add {
      display: none !important;
   }

   .reg {
      display: none !important;
   }

   .emplo {
      display: none !important;
   }

   .tra {
      display: none !important;
   }
   .headz, .headx, .titlez, .formz, .regixcv, .sig, .edix, .logssss, .homerun, .tabang{
      display: none !important;
   }
}
</style>