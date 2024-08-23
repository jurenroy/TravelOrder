<template>
  <div style="display: flex; justify-content: center">
  <div class="frontcontainer">
    <img src="../assets/background_image.png" class="frontpic">
    <div class="textzxc">
      <p class="p1">Republic of the Philipines</p>
      <p class="p2">Department of Environment and Natural Resources</p>
      <p class="p3">Mines and Geosciences Bureau</p>
      <p class="p4">Regional Office No.X</p>
      <p>MGB Application Form</p>
    </div>
    
    <div class="hakdogzzz">
      <button class="frontbutton" @click="navigateTo('TravelOrder')">Travel Order Form</button>
      <button class="frontbutton" @click="navigateTo('LeaveForm')">Leave Form</button>
    </div>
  </div>
  <!-- Password Change Popup -->
  <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>Please Change Your Default Password</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="password">New Password:</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="Enter your new password" 
              required
            />
          </div>
          <div class="form-actions">
            <button type="button" class="skip-button" @click="skip">Skip</button>
            <button type="submit" class="submit-button">Change Password</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { showstatus } from '@/components/heder.vue';
import { isRegistrationClicked, isEdits, employeelis, isButssClicked, isVisible } from './dashboard.vue';
import { showEdit } from '@/components/heder.vue';
import { isregisclick, leaveedit, employeelisleave, isaddleave, isleavelogoutClicked } from './leaveform.vue';
import CryptoJS from 'crypto-js';
import { API_BASE_URL } from '../config';
import axios from 'axios';

export default {
  data() {
    return {
      showstatus: true,
      showPopup: false, // Control the visibility of the popup
      password: '',
      predefinedPassword: 'Pass12345',
    }
  },
  methods: {
    navigateTo(routeName) {
      if (routeName === 'LeaveForm') {
        showstatus.value = false
        isButssClicked.value = false
        isaddleave.value = false
        isEdits.value = false
        isRegistrationClicked.value = false
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
        isRegistrationClicked.value = false
        employeelis.value = false
        isregisclick.value = false
        leaveedit.value = false
        showEdit.value = false
      }
      this.$router.push({ name: routeName });
      localStorage.setItem('routerz', routeName);
    },
    handleKeyDown(event) {
      if (event.key === 'Escape') {
        this.skip();
      }
    },
    async handleSubmit() {
      // Logic for handling password change
      const id = localStorage.getItem('accountId');
      this.encryptedPassword = CryptoJS.AES.encrypt(this.password, 'jUr3ñr0yR@br4g@n').toString();

      if (!id) {
        console.error('No account ID found in localStorage');
        return;
      }

      try {
        // Create a FormData object
        const formData = new FormData();
        formData.append('password', this.encryptedPassword);

        // Send the FormData object with axios
        const response = await axios.post(`${API_BASE_URL}/update_account/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Handle success (e.g., show a success message)
        this.showPopup = false; // Hide popup after submission
      } catch (error) {
        console.error('Error updating password:', error);
        // Handle error (e.g., show an error message)
      }
    },
    skip() {
      // Logic for skipping the password change
      this.showPopup = false; // Hide popup if user chooses to skip
    },
    async fetchAccountData() {
      try {
        const accountId = localStorage.getItem('accountId');
        if (!accountId) {
          console.error('Account ID not found in local storage');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/get_accounts_json`);
        const accountData = response.data;
        const account = accountData.find(result => result.account_id === parseInt(accountId));

        console.log(accountData)
        console.log(account)

        if (account && account.password) {
          const defaultStatus = this.checkDefaultStatus(account.password);
          this.showPopup = defaultStatus === 'Yes';
        } else {
          console.error('Account not found or password missing');
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
      }
    },
    checkDefaultStatus(encryptedPassword) {
      const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, 'jUr3ñr0yR@br4g@n').toString(CryptoJS.enc.Utf8);
      return decryptedPassword === this.predefinedPassword ? 'Yes' : 'No';
    },
  },
  mounted() {
    this.fetchAccountData();
    // Add keydown event listener for the ESC key when the component is mounted
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeDestroy() {
    // Remove the event listener when the component is destroyed
    window.removeEventListener('keydown', this.handleKeyDown);
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
  margin: 30px;
  height: 250px;
  width: auto;
}
.textzxc{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.p1, .p2, .p3, .p4{
  font-weight: bold;
  font-size: 25px;
  margin-top: -20px;
}

@media (max-width: 768px) {
  .hakdogzzz {
    justify-content: center;
    flex-direction: column;
  }
    .p1, .p2, .p3, .p4{
    font-size: 12px;
    margin-top: -10px;
  }
  .textzxc {
    text-align: center;
  }
}

/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h2 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="password"] {
  width: 95%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.submit-button,
.skip-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.skip-button {
  background-color: #6c757d;
  color: white;
  font-weight: bold;
}

.submit-button:hover,
.skip-button:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .popup-content {
    padding: 15px;
  }

  .submit-button,
  .skip-button {
    padding: 8px 16px;
  }
}
</style>