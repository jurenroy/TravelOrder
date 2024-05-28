<template>
  <div>
    <div style="flex-direction: column; justify-content: center;" v-if="leaveedit">
      <editpage></editpage>
    </div>
    <div>
      <headers v-if="showHeader1" />
      <headers1 v-if="showHeader2" />
      <div v-if="!isRegistrationClicked">
        <div v-if="!employeelis">
          <div class="sig">
            <signature v-if="acc.signature === null" />
            <div v-else>
              <div v-if="!isRegistrationClicked">
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                  <div class="tra">
                    <p class="travel">Leave Form</p>
                  </div>
                  <div>
                    <button class="add" @click="toggleForm">{{ isVisible ? 'Close form' : 'Add form'
                      }}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="logssss" v-if="isleavelogoutClicked">
            <leavelogout></leavelogout>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

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
const isRegistrationClicked = ref(false);
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
  isRegistrationClicked.value = true;
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

fetchAccounts()


export {
  isVisible,
  isleavelogoutClicked,
  showHeader1,
  showHeader2,
  leaveedit,
  employeelis,
  noleaveButton,
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
  margin-top: 13px;
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
}
</style>