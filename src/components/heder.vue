<template>
  <div class="OIC" v-if="(setEmployee === name.name_id || name.name_id === 76)">
    <div class="status-row">
      <h1>Status:</h1>
      <h1 :style="{ color: setEmployee == selectedEmployee ? 'black' : 'red' }">
        {{ setEmployee === 20 ? 'Regional Director' : 'OIC' }}
      </h1>
    </div>

    <div v-if="setEmployee !== null && setEmployee !== ''">
      <!-- Conditional rendering for 'In' or 'Sub' text can be handled here -->
    </div>
    
    <div class="action-row">
      
      <select v-model="setEmployee" v-if="setEmployee !== name.name_id || name.name_id === 76">
        <option v-for="employee in employees" :key="employee.employee_id" :value="employee.name_id">
          {{ getName(employee.name_id) }}
        </option>
      </select>
      <button v-if="setEmployee !== selectedEmployee" @click="setAccount">
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { isButssClicked } from '../views/dashboard.vue';
import { API_BASE_URL } from '../config'

import axios from 'axios';

const authStore = useAuthStore();

const accountIdz = localStorage.getItem('accountId');

const emit = defineEmits();

    const toggleEdit = () => {
      emit('toggleEdit', true); // Emit the edit toggle
    };

    const toggleLogout = () => {
      emit('toggleLogout', true); // Emit the logout toggle
    };


const accounts = ref([]);
const employees = ref([]);
const names = ref([]);
const name = ref('')
const nameLoaded = ref(false)
const selectedEmployee = ref(null);
const setEmployee = ref(null);
const routerzz = localStorage.getItem('routerz')

const setAccount = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/update_employee/${setEmployee.value}`);
    window.location.reload();
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
};




const fetchAccounts = async () => {

  try {
    Usernames.value = false
    const response = await axios.get(`${API_BASE_URL}/get_accounts_json`);

    accounts.value = response.data;
    Usernames.value = true
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
};

const fetchEmployee = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_employees_json`);
    employees.value = response.data.filter(emp => emp.chief > 0)
    const selectedEmp = response.data.find(emp => emp.rd !== null);
    if (selectedEmp) {
      setEmployee.value = selectedEmp.name_id;
      selectedEmployee.value = selectedEmp.name_id;
    } else {
      setEmployee.value = null;
      selectedEmployee.value = null;
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
};


const fetchNames = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_names_json`);
    names.value = response.data;

    const account = accounts.value.find(acc => acc.account_id === parseInt(accountIdz));

    if (account) {
      const nameId = account.name_id;
      const foundName = names.value.find(name => name.name_id === nameId);
      if (foundName) {
        name.value = foundName;
        nameLoaded.value = true;
      } else {
      }
    } else {
    }
  } catch (error) {
    console.error('Error fetching names:', error);
  }
};

const getName = (nameId) => {
  const namec = names.value.find(name => name.name_id === nameId);
  if (namec) {
    const { first_name, middle_init, last_name } = namec;
    return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
  }
  return 'Unknown';
};


const setOTPv = () => {
  localStorage.setItem('verifiedOTPs', false)
}

setOTPv();
fetchAccounts();
fetchEmployee();
fetchNames();




</script>

<script>
import { ref } from 'vue';
import { isButssClicked,showHeader1, showHeader2, isEdits, isRegistrationClicked, isVisible } from '../views/dashboard.vue';
import { isleavelogoutClicked, leaveedit } from '@/views/leaveform.vue';
import { addem, blurTable } from '@/views/employeelist.vue';

export const showEdit = ref(false)

export const Usernames = ref(true)

export const islogout2 = ref(false)
export const hideedit = ref(true)

export const showstatus = ref(true)




export default {
  inject: ['close'],
  methods: {
    
    navigatefront() {
      this.$router.push('/');
    },

    logButtonz() {
      isButssClicked.value = true;
      isleavelogoutClicked.value = true;
      showHeader1.value = false;
      showHeader2.value = true
      showEdit.value = false

    },
    closeAndLog() {

      if (typeof this.close === 'function') {
        this.close();

      }
      this.logButtonz();
    },



    showEdits() {
      showEdit.value = !showEdit.value;
    },

    clickEdit() {
      leaveedit.value = true
      showEdit.value = false;
      isEdits.value = true
      isRegistrationClicked.value = true;
      isVisible.value = false
      islogout2.value = true;
      hideedit.value = false
      addem.value = false;
      blurTable.value = false
    },

    backUpdate() {
      if (typeof this.close === 'function') {
        this.close();
      }
      this.clickEdit();
    },


    clickOut() {
      showEdit.value = true;
      leaveedit.value = false
      isEdits.value = false
      Usernames.value = true
    }


  },

};
</script>

<style>
  .OIC {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  z-index: 999;
}

.OIC h1,
.OIC button,
.OIC select {
  margin: 5px 0;
}

.OIC .status-row,
.OIC .action-row {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1999;
}

.OIC .status-row h1,
.OIC .action-row button,
.OIC .action-row select {
  margin-right: 10px; /* Space between items in each row */
}

@media (max-width: 768px) {
  .OIC {
    display: none;
  }
}

@media print {
  .OIC {
    display: none !important;
  }
}

</style>