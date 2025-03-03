<template>
  <div class="titlez" v-if="!isRegistrationClicked && !employeelis && !isEdits">
    <div>
      <p class="travel">Request Slip Form</p>
    </div>
    <div class="navigationz">
      <button class="add" @click="toggleForm">
        {{ isVisible ? "Close Form" : "Add Form" }}
      </button>
      <button
        v-if="!isVisible && acc.type_id == 1 && acc.name_id == 76"
        class="reg"
        @click="toggleRegistration"
      >
        {{ "Registration" }}
      </button>
      <button
        v-if="!isVisible && acc.type_id == 1"
        class="emplo"
        @click="employeelst"
      >
        {{ "Employee List" }}
      </button>
    </div>
  </div>
  <tablez
    class="tablex"
    v-if="!isVisible && !isRegistrationClicked && !isEdits && !employeelis"
  />
  <addforms class="formz" v-if="isVisible" />
  <registrationform
    class="regixcv"
    v-if="isRegistrationClicked && !isEdits && !employeelis"
    :show="isRegistrationClicked"
    @handleBack="handleBack"
  />
  <employeelist class="empex" v-if="employeelis && !isEdits" />
  <signature class="sig" v-if="acc.signature === null" />
  <editss
    class="edix"
    v-if="isEdits"
    :show="isEdits"
    @handleBack2="handleBack2"
  />
  <logsss
    class="logssss"
    v-if="isButssClicked"
    :show="isButssClicked"
    @handleNo="handleNo"
  />
  <Help class="tabang" :accountId="acc.name_id" />
</template>

<script setup>
import signature from "../../components/signature.vue";
import Addforms from "./requestform.vue";
import registrationform from "../regis.vue";
import tablez from "./table.vue";
import employeelist from "../employeelist.vue";
import editss from "../editpage.vue";
import { showEdit } from "../../components/heder.vue";

const handleBack = () => {
  isRegistrationClicked.value = false; // Close the popup
};
const handleBack2 = () => {
  console.log("yawa");
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
import { ref } from "vue";
import axios from "axios";
import { showleavehome } from "../leaveform.vue";
import { API_BASE_URL } from "../../config";

const accountId = localStorage.getItem("accountId");
const isVisible = ref(false);
const isRegistrationClicked = ref(false);
const employeelis = ref(false);
const isButssClicked = ref(false);
const isEdits = ref(false);
const acc = ref([]);
const showhome = ref(true);

//header
const showHeader1 = ref(true);
const showHeader2 = ref(false);

// visible sa  Add form
const toggleForm = () => {
  isVisible.value = !isVisible.value;
  showEdit.value = false;
  showhome.value = !showhome.value;
};

// makita ang registration
const toggleRegistration = () => {
  isRegistrationClicked.value = true;
  showEdit.value = false;
  showhome.value = false;
};

const employeelst = () => {
  employeelis.value = true;
  showEdit.value = false;
  showhome.value = false;
};

//ma back ang registration
const backButton = () => {
  isRegistrationClicked.value = false;
  isVisible.value = false;
  showEdit.value = false;
  isregisclick.value = false;
  showhome.value = true;
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
  showHeader2.value = false;
};

const showEditss = () => {
  isEdits.value = true;
};

// Fetch OTP data function
const fetchAccounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_accounts_json/`);
    acc.value = response.data.find((result) => result.account_id == accountId);
  } catch (error) {
    console.error("Error fetching OTP data:", error);
  }
};
const loginstate = () => {
  const state = localStorage.getItem("isLoggedIn");
  if (!state) {
    localStorage.setItem("isLoggedIn", false);
  }
};

loginstate();
fetchAccounts();

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
  showEditss,
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
  height: 50px;
  width: 150px;
  font-size: 18px;
  font-family: "Playfair Display", serif; /* Luxurious font */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #000000;
  background: #bfa16d; /* Deep charcoal */
  border: 2px solid; /* Luxurious gold border */
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out; /* Smooth transition */
  cursor: pointer;
}

.back {
  margin-top: -19px;
  height: 50px;
  width: 150px;
  font-size: 18px;
  font-family: "Playfair Display", serif; /* Luxurious font */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #000000;
  background: #bfa16d; /* Deep charcoal */
  border: 2px solid; /* Luxurious gold border */
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out; /* Smooth transition */
  cursor: pointer;
}

.reg {
  margin-top: -19px;
  margin-bottom: 13px;
  margin-left: 20px;
  height: 50px;
  width: auto;
  font-size: 18px;
  font-family: "Playfair Display", serif; /* Luxurious font */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #000000;
  background: #bfa16d; /* Deep charcoal */
  border: 2px solid; /* Luxurious gold border */
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out; /* Smooth transition */
  cursor: pointer;
}

.emplo {
  margin-top: -19px;
  margin-bottom: 13px;
  margin-left: 20px;
  height: 50px;
  width: auto;
  font-size: 18px;
  font-family: "Playfair Display", serif; /* Luxurious font */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #000000;
  background: #bfa16d; /* Deep charcoal */
  border: 2px solid; /* Luxurious gold border */
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out; /* Smooth transition */
  cursor: pointer;
}

.logssss {
  flex-direction: column;
  justify-content: center;
  top: 0px;
  width: auto;
}

.sig {
  margin-top: 100px;
}

.navigationz {
  display: flex;
  flex-direction: row;
}

.formz {
  display: flex;
  justify-content: center;
  margin-top: 0px;
}

.regiz {
  display: flex;
  justify-content: center;
  margin-top: 0px;
}
.titlez {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 768px) {
  .navigationz {
    flex-direction: column;
  }
  .add {
    margin-bottom: 30px;
  }
  .reg {
    margin-top: -19px;
    margin-bottom: 30px;
    margin-left: 0px;
  }
  .emplo {
    margin-top: -19px;
    margin-bottom: 13px;
    margin-left: -5px;
  }
  .formz {
    margin-top: 110px;
  }
  .regiz {
    display: flex;
    justify-content: center;
    margin-top: -100px;
  }
  .empeee {
    margin-right: 0px;
  }
  .travel {
    font-size: 35px;
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
  .headz,
  .headx,
  .titlez,
  .formz,
  .regixcv,
  .sig,
  .edix,
  .logssss,
  .homerun,
  .tabang {
    display: none !important;
  }
}
</style>
