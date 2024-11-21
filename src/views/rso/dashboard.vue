<template>
   <div class="titlez" v-if="!isRegistrationClicked && !employeelis && !isEdits">
      <div>
         <p class="travel" >Special Order</p>
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



import signature from '../../components/signature.vue'
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

.sig {
   margin-top: 100px;

}

.titlez{
   display: flex; 
   flex-direction: column; 
   align-items: center; 
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