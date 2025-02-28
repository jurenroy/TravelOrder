<template>
  <div class="zero">
    <div class="first">
      <alerz></alerz>
      <div class="second">
        <button class="close-btn" @click="closeLogin">X</button> <!-- Close button -->
        
        <p class="form">Welcome</p>

        <!-- Form Fields -->
        <div class="inside">
          <div style="display: flex; flex-direction: column; width: 100%;">
            <label class="n">Username: </label>
            <input type="text" v-model="email" class="inputsss" id="email" required @keydown.enter="login_submit" :class="{ 'red-border': isRed && email === '' }" @input="resetRed"/>

            <label class="p">Password: </label>
            <input type="password" v-model="password" class="inputsss" id="password" required @keydown.enter="login_submit" :class="{ 'red-border': isRed && password === '' }" @input="resetRed"/>
          </div>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="isValid" class="error">
          <a class="errormsg1">Warning Alert!!</a>
          <a class="errormsg">Please fill out the text fields</a>
        </div>

        <div v-if="isEmail" class="wronge">
          <a class="wronge1">Error Alert!!</a>
          <a class="wronge2">{{ error }}</a>
        </div>

        <div v-else-if="pleaseWait" class="logincorrect">
          <a class="logincorrect1">Login!!</a>
          <a class="logincorrect2">Please wait for a moment....</a>
        </div>

        <!-- Login Button -->
        <div class="buttonss">
          <button class="button" :disabled="submitting" @click="login_submit">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../store/auth';
import CryptoJS from 'crypto-js';
import { API_BASE_URL } from '../../config';

// Define the `login` prop and `close` event
const props = defineProps({
  login: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits();
const closeLogin = () => {
  emit('closeLogin'); // Emit an event to the parent to close the login modal
};

// State Variables
const email = ref('');
const password = ref('');
const accounts = ref([]);
const employees = ref([]);
const isValid = ref(false);
const isEmail = ref(false);
const pleaseWait = ref(false);
const submitting = ref(false);
const first = ref(true);
const error = ref('');
const authStore = useAuthStore();
const decryptedPassword = ref('');
const empi = ref('');

// Validation States
const isRed = ref(false);

// Reset Red Border on Input
const resetRed = () => {
  isRed.value = false;
};

// Login Function
const login_submit = () => {
  const passvalid = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;
  const account = accounts.value.find(acc => acc.email === email.value);

  if (account) {
    empi.value = employees.value.find(emp => emp.name_id === account.name_id).isActive;
    decryptedPassword.value = CryptoJS.AES.decrypt(account.password, 'jUr3ñr0yR@br4g@n').toString(CryptoJS.enc.Utf8);
  }

  isRed.value = true;

  // Validation Logic
  if (email.value === '' && password.value === '') {
    isValid.value = true;
    setTimeout(() => { isValid.value = false; }, 2000);
  } else if (email.value === '') {
    error.value = 'Input Email';
    isValid.value = true;
    setTimeout(() => { isValid.value = false; }, 2000);
  } else if (!account) {
    error.value = 'Email not Found';
    isEmail.value = true;
    setTimeout(() => { isEmail.value = false; }, 2000);
  } else if (password.value === '') {
    isValid.value = true;
    setTimeout(() => { isValid.value = false; }, 2000);
  } else if (passvalid.test(password.value) === false) {
    error.value = 'Invalid Password Format';
    isEmail.value = true;
    setTimeout(() => { isEmail.value = false; }, 2000);
  } else if (decryptedPassword.value !== password.value) {
    if (first.value) {
      first.value = false;
      login_submit();
    } else {
      error.value = 'Wrong Password';
    }
    isEmail.value = true;
    setTimeout(() => { isEmail.value = false; }, 2000);
  } else if (empi.value === 'out') {
    error.value = 'Account inactive';
    isEmail.value = true;
    setTimeout(() => { isEmail.value = false; }, 2000);
  } else {
    email.value = '';
    password.value = '';
    authStore.login(account.account_id, account.type_id, account.name_id, account.signature, account.password); // Call the login action
    submitting.value = true;
    pleaseWait.value = true;

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

// Fetch Accounts and Employees
const fetchAccounts = () => {
  axios.get(`${API_BASE_URL}/get_accounts_json`)
    .then(response => {
      accounts.value = response.data;
      axios.get(`${API_BASE_URL}/get_employees_json`)
        .then(response => {
          employees.value = response.data;
        });
    })
    .catch(error => {
      console.error('Error fetching accounts:', error);
    });
};

// Initialize Data
fetchAccounts();
</script>

<style scoped>
/* Gradient background */
body {
  background: linear-gradient(150deg, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
  font-family: 'Lora', serif;
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  
}
.zero {
  position: absolute;        /* Make it positioned relative to the nearest positioned ancestor */
  top: 50%;                  /* Center vertically */
  left: 50%;                 /* Center horizontally */
  transform: translate(-50%, -50%);  /* Adjust the position to truly center */
  display: flex;             /* Flexbox for inner elements */
  justify-content: center;   /* Center content horizontally */
  align-items: center;       /* Center content vertically */
  width: 100%;               /* Optional: set the width (you can customize this if needed) */
  height: 100%;              /* Optional: set the height (you can customize this if needed) */
}

.first {
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}

.second {
  background: linear-gradient(150deg, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  backdrop-filter: blur(15px);
  transition: transform 0.3s ease;
  position: relative;
}

.second:hover {
  transform: scale(1.05);
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  background: none;
  border: solid 1px red;
  color: #ff0000;
  cursor: pointer;
  border-radius: 100%;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #c24d4d;
  border: solid 1px #c24d4d;
}

/* Heading styling */
.form {
  font-size: 30px;
  font-weight: 700;
  color: rgb(0, 0, 0);
  letter-spacing: 1px;
  margin-bottom: 20px;
}

/* Input field styling */
.inputsss {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border-radius: 10px;
  border: 2px solid #fff;
  margin-bottom: 15px;
  outline: none;
  background-color: rgba(255, 255, 255, 0.2);
  color: rgb(0, 0, 0);
  transition: border-color 0.3s ease;
}

.inputsss:focus {
  border-color: #000000;
  background-color: rgba(255, 255, 255, 0.3);
}

/* Labels */
.n, .p {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  text-align: left;
  margin: 0 0 5px 0;
}

/* Button styling */
.buttonss {
  margin-top: 20px;
}

.button {
  width: 100%;
  padding: 12px;
  background-color: #000000;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.button:hover {
  background-color: #525252;
  transform: translateY(-3px);
}

.button:disabled {
  background-color: #081a08;
  cursor: not-allowed;
}

/* Error and success messages */
.error, .wronge, .logincorrect {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 15px;
  margin-top: 15px;
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.error {
  border: 2px solid #f8a837;
  background-color: rgba(248, 168, 55, 0.15);
}

.wronge {
  border: 2px solid #c95e58;
  background-color: rgba(201, 94, 88, 0.15);
}

.logincorrect {
  border: 2px solid #39b259;
  background-color: rgba(57, 178, 89, 0.15);
}

.errormsg1, .wronge1, .logincorrect1 {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-right: 10px;
}

.errormsg, .wronge2, .logincorrect2 {
  font-size: 14px;
  text-align: center;
  margin-top: 5px;
}

/* Responsive Design for Mobile */
@media (max-width: 768px) {
  .second {
    padding: 20px;
    width: 90%;
  }

  .inputsss {
    font-size: 16px;
  }

  .button {
    font-size: 18px;
  }
}
</style>
