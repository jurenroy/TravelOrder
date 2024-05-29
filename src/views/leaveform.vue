<template>
  <div>
    <div style="flex-direction: column; justify-content: center;" v-if="isEdits && isregisclick">
         <editss></editss>
      </div>
      <div style="flex-direction: column; justify-content: center;" v-if="isregisclick && !isEdits">
         <regis></regis>
      </div>
      <div style="flex-direction: column; justify-content: center;" v-if="employeelis && !isEdits">
         <employeelist></employeelist>
      </div>
    <div style="flex-direction: column; justify-content: center;" v-if="leaveedit">
      <editpage></editpage>
    </div>
    <div>
      <headers v-if="showHeader1" />
      <headers1 v-if="showHeader2" />
      <div v-if="!isregisclick">
        <div v-if="!employeelis">
          <div class="sigleave">
            <signature v-if="acc.signature === null" />
            <div v-else>
              <div v-if="!isregisclick">
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                  <div class="tra">
                    <p class="travel">Leave Form</p>
                  </div>
                  <div>
                    <button class="addleave" @click="toggleForm">{{ isVisible ? 'Close form' : 'Add form'
                      }}</button>
                      <button v-show="!isVisible && acc.type_id == 1 && acc.name_id == 76" class="regleave"
                                 @click="toggleRegistration">{{
         'Registration' }}</button>
                              <button v-show="!isVisible && acc.type_id == 1" class="emploleave" @click="employeelst">{{
         'Employee List' }}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="logssssleave" v-if="isleavelogoutClicked">
            <leavelogout></leavelogout>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import employeelist from './employeelist.vue';  
import regis from './regis.vue';
import editpage from './editpage.vue';
import headers from '../components/heder.vue'
import signature from '../components/signature.vue'
import headers1 from '../components/heder2.vue'
import leavelogout from '../components/logout.vue'
import { showEdit } from '../components/heder.vue';
</script>


<script>
import { ref } from 'vue';
import axios from 'axios';
const accountId = localStorage.getItem('accountId');
const isVisible = ref(false);
const isregisclick = ref(false);
const employeelis = ref(false);
const isleavelogoutClicked = ref(false);
const leaveedit = ref(false);
const acc = ref([]);

//header
const showHeader1 = ref(true)
const showHeader2 = ref(false)



// visible sa  Add form
const toggleForm = () => {
  isVisible.value = !isVisible.value;
  showEdit.value = false
};

// makita ang registration
const toggleRegistration = () => {
  isregisclick.value = true;
  showEdit.value = false;
};

const employeelst = () => {
  employeelis.value = true;
  showEdit.value = false;
};

//ma back ang registration
const backButton = () => {
  isRegistrationClicked.value = false;
      isVisible.value = false;
      showEdit.value = false
  isregisclick.value = false;
  };

const backButtonemp = () => {
  employeelis.value = false;
  isVisible.value = false;
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
    const response = await axios.get('http://172.31.10.164:8000/get_accounts_json/');
    acc.value = response.data.find(result => result.account_id == accountId);
  } catch (error) {
    console.error('Error fetching OTP data:', error);
  }
};
const loginstate = () =>{
  const state = localStorage.getItem('isLoggedIn');
  if (!state){
    localStorage.setItem('isLoggedIn',false);
  }
}

loginstate()
fetchAccounts()


export {
  isVisible,
  isleavelogoutClicked,
  showHeader1,
  showHeader2,
  leaveedit,
  isregisclick,
  employeelis,
  noleaveButton,
  toggleForm,
  toggleRegistration,
  employeelst,
  backButtonemp,
  backButton,
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

.addleave {
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

.emploleave {
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

.logssssleave {
  flex-direction: column;
  justify-content: center;
  top: 0px;
  width: auto
}

.sigleave {
  margin-top: 100px;

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
}
</style>