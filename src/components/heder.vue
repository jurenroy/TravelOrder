<template>
  <div class="una">
    <div class="imagediv1" @click="navigatefront">
      <img class="ima" src="../assets/logo.png" alt="Description of the image" >
      <img class="ima ims" src="../assets/republic.png" alt="Description of the image" >
      <img class="ima" src="../assets/bago.png" alt="Description of the image" >

    </div>

    <div
      style="display: flex; margin-top: 2px; margin-left:-100px ; height: inherit; width: 250px; justify-content: center;"
      v-if="routerzz == 'TravelOrder' && (setEmployee === name.name_id || name.name_id === 76)">
      <h1 style="position: fixed; margin-left:-90px ; margin-top: 3px;">Status:</h1>

      <div v-if="setEmployee !== null && setEmployee !== ''">
        <h1 :style="{ position: 'fixed', marginTop: '3px', color: setEmployee == selectedEmployee ? 'black' : 'red' }"
          v-if="setEmployee === 20">In</h1>
        <h1 :style="{ position: 'fixed', marginTop: '3px', color: setEmployee == selectedEmployee ? 'black' : 'red' }"
          v-else>Sub</h1>
      </div>
      <button style="position: fixed; margin-top: 9px; margin-left: 280px; height: 30px;"
        v-if="setEmployee !== selectedEmployee" @click="setAccount">Save Changes</button>
      <select v-model="setEmployee" style="position: fixed; margin-top: 39px; margin-left: -40px;"
        v-if="setEmployee !== name.name_id || name.name_id === 76">
        <option v-for="employee in employees" :key="employee.employee_id" :value="employee.name_id">
          {{ getName(employee.name_id) }}
        </option>
      </select>
    </div>
    <div class="editnames" style="height: 90px;">
      <div>
        <text class="ima2 usew" v-if="Usernames" @click="showEdits" style="user-select: none;">{{ name.first_name }} {{
        name.middle_init }} {{ name.last_name }} <img v-if="Usernames" src="../assets/down.png"
            style="position: relative; width: 25px; height: 25px;top: 7px "></text>

        <div v-if="showEdit" style="height: auto; width:auto ; position: relative; top: 5px;left: 10px; ">
          <div
            style="border:2px solid black; border-radius: 10px; padding:5px;  background-color: white; width: 60px; height:auto; position: relative; display: flex; flex-direction: column;">
            <button class="editbut" v-if="hideedit" @click="backUpdate">Edit</button>
            <button class="logoutbut" @click="closeAndLog">Logout</button>
          </div>

        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { isButssClicked } from '../views/dashboard.vue';

import axios from 'axios';

const authStore = useAuthStore();

const accountIdz = localStorage.getItem('accountId');


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
    const response = await axios.post(`http://172.31.10.164:8000/update_employee/${setEmployee.value}`);
    window.location.reload();
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
};




const fetchAccounts = async () => {

  try {
    Usernames.value = false
    const response = await axios.get('http://172.31.10.164:8000/get_accounts_json');

    accounts.value = response.data;
    Usernames.value = true
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
};

const fetchEmployee = async () => {
  try {
    const response = await axios.get('http://172.31.10.164:8000/get_employees_json');
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
    const response = await axios.get('http://172.31.10.164:8000/get_names_json');
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
.una {
  background-color: white;
  display: flex;
  height: 70px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid black;
  box-shadow: 0px 0px 4px black, 0px 0px 3px black inset;
}

.imagediv1 {
  display: flex;
  align-items: center;
}

.editnames {

  position: relative;
  top: 30px;
  left: -30px;
}

.imagediv3 {
  display: flex;
  align-items: center;
  height: inherit;
}

.ima {
  height: 50px;
  width: 50px;
  margin-top: -5px;
  margin-left: 5px;
  cursor: pointer;
}

.ima2 {

  cursor: pointer;
}

.imabut {
  margin-right: 30px;
}


.tes {
  justify-content: center;
  position: relative;
  top: 6px;
  left: 35px;
}



.imabut {
  border-radius: 10px;
  font-size: 13px;
  width: 60px;
  height: 40px;
}

.editbut {
  border-radius: 5px;
  font-size: 13px;
  margin-bottom: 4px;
  width: 60px;
  position: relative;

}

.logoutbut {
  border-radius: 5px;
  font-size: 13px;
  width: 60px;
  position: relative;

}

.ims {
  width: 160px;
}

.usew {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {

  .imabut,
  .ima,
  .ima2 {
    margin-right: 0px;
  }

  .ims {
    width: 145.9px;
  }

  .imabut {
    border-radius: 10px;
    font-size: 13px;
    width: 50px;
    height: 30px;
    margin-right: 1px;

  }

  .usew {
    margin-right: -1px;
  }

}

@media print {
  .una {
    display: none !important;
  }
}
</style>