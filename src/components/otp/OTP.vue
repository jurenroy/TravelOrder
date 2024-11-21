<template>
    <div class="otp-container">
      <div class="otp-header" v-if="sendingOTPS">
        <p class="otp-message">Sending OTP...</p>
      </div>
  
      <div class="otp-header" v-if="OTPsuccesful">
        <p class="otp-message success">OTP Sent Successfully</p>
      </div>
  
      <div class="otp-header" v-if="!OTPsuccesful && !OTPsent && ANSAK">
        <p class="otp-message error">OTP Sending Failed</p>
      </div>
  
      <div class="otp-wrapper" v-if="OTPsent">
        <label class="otp-label">Enter OTP ({{ otpData.code }})</label>
        <div class="otp-inputs">
          <!-- OTP input fields with automatic focus handling -->
          <input
            v-for="(otp, index) in otpInputs"
            :key="index"
            :id="'otpInput' + (index + 1)"
            class="otp-input-box"
            type="text"
            :value="otp"
            maxlength="1"
            @input="handleInput($event, index)"
            @keydown="handleKeyDown($event, index)"
            :ref="el => otpRefs[index] = el"
          />
        </div>
  
        <div class="otp-status">
          <p v-if="verifiedotps" class="status success">OTP Verified Successfully</p>
          <p v-if="expired" class="status error">OTP Expired</p>
          <p v-if="wrongOTPs" class="status error">Incorrect OTP</p>
        </div>
  
        <div class="otp-buttons">
          <button
            class="otp-button verify"
            v-if="expir"
            :disabled="isVerify"
            @click="verifyOTP"
          >
            Verify OTP
          </button>
          <button
            class="otp-button cancel"
            v-if="expir"
            :disabled="!isVerify"
            @click="handleNo"
          >
            Cancel
          </button>
          <button
            class="otp-button resend"
            v-if="expire"
            @click="sendOTP"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { useAuthStore } from '../../store/auth';
  import { ref, computed } from 'vue';
  import { API_BASE_URL } from '../../config';
  
  const authStore = useAuthStore();
  const accountId = localStorage.getItem('accountId');
  const otpData = ref([]);
  const otpInputs = ref(Array(6).fill('')); // Array to store OTP inputs
  const otpRefs = ref([]); // Refs for OTP input fields
  
  const OTPsent = ref(false);
  const OTPsuccesful = ref(false);
  const verifiedotps = ref(false);
  const ANSAK = ref(false);
  const expired = ref(false);
  const expire = ref(false);
  const expir = ref(true);
  const wrongOTPs = ref(false);
  const sendingOTPS = ref(true);
  const otppp = ref('');
  
  // Computed property for checking OTP input
  const isVerify = computed(() => otpInputs.value.some(value => value === ''));
  
  // Handle OTP input changes
  const handleInput = (event, index) => {
    const value = event.target.value;
  
    // Update otpInputs array with the new value
    otpInputs.value[index] = value;
  
    // Move to the next field if the value is entered and valid
    if (value && !isNaN(value)) {
      focusNextField(index);
    }
  };
  
  // Handle key down events (for Backspace and Enter)
  const handleKeyDown = (event, index) => {
    // Move to the previous field if Backspace is pressed and the current field is empty
    if (event.key === 'Backspace' && otpInputs.value[index] === '') {
      focusPreviousField(index);
    }
  };
  
  // Focus the next input field
  const focusNextField = (index) => {
    if (index < otpInputs.value.length - 1) {
      otpRefs.value[index + 1].focus();
    }
  };
  
  // Focus the previous input field
  const focusPreviousField = (index) => {
    if (index > 0) {
      otpRefs.value[index - 1].focus();
    }
  };
  
  // Send OTP request to the backend
  const sendOTP = async () => {
    resetOTPInputs();
    try {
      await axios.post(`${API_BASE_URL}/send-otp/${accountId}`);
      sendingOTPS.value = false;
      OTPsuccesful.value = true;
      expired.value = false;
      expir.value = true;
      await fetchOTPData();
      setTimeout(() => {
        OTPsuccesful.value = false;
        OTPsent.value = true;
      }, 2000);
    } catch (error) {
      console.error('Error sending OTP:', error);
      handleError();
    }
  };
  
  // Verify the OTP entered by the user
  const verifyOTP = () => {
    const fullOTP = otpInputs.value.join('');
    console.log(fullOTP)
    console.log(parseInt(otppp.value))
    if (otpData.value) {
      if (parseInt(otppp.value) === parseInt(fullOTP)) {
        verifiedotps.value = true;
        // authStore.updateVerifiedOTPs('true');
        // localStorage.setItem('verifiedOTPs', 'true');
        emitOTPStatus(true); // Emit success to parent
      } else {
        handleWrongOTP();
      }
    } else {
      console.error('OTP data not preloaded.');
    }
  };
  
  // Fetch OTP data from the backend
  const fetchOTPData = async () => {
    try {
    
      const response = await axios.get(`${API_BASE_URL}/get_otp_json`);
      otpData.value = response.data.find(result => result.account_id === parseInt(accountId));
      otppp.value = otpData.value.code;
    } catch (error) {
      console.error('Error fetching OTP data:', error);
    }
  };

  // Reset OTP input fields
  const resetOTPInputs = () => {
    otpInputs.value = Array(6).fill('');
    OTPsent.value = false;
    verifiedotps.value = false;
    ANSAK.value = false;
    expired.value = false;
    expir.value = true;
  };
  
  // Handle error during OTP send process
  const handleError = () => {
    OTPsent.value = false;
    OTPsuccesful.value = false;
    ANSAK.value = true;
  };
  
  // Handle incorrect OTP input
  const handleWrongOTP = () => {
    otpInputs.value = Array(6).fill('');
    wrongOTPs.value = true;
    setTimeout(() => {
      wrongOTPs.value = false;
    }, 3000);
  };

  // Handle closing the OTP modal
const handleNo = () => {
  emitOTPStatus(false); // Emit failure (false) to parent
};

// Emit OTP status to the parent
const emitOTPStatus = (status) => {
  emit('handleCloseOTP', status); // Pass the status to the parent component
};

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits();
  
  // Initial OTP send
  sendOTP();
  </script>
  
  <style scoped>
  /* Elegant and luxurious OTP design */
  .otp-container {
    position: absolute;        /* Make it positioned relative to the nearest positioned ancestor */
    top: 50%;                  /* Center vertically */
    left: 50%;                 /* Center horizontally */
    transform: translate(-50%, -50%);  /* Adjust the position to truly center */
    display: flex;             /* Flexbox for inner elements */
    justify-content: center;   /* Center content horizontally */
    align-items: center;       /* Center content vertically */
    width: 100%;               /* Optional: set the width (you can customize this if needed) */
    height: 100%; 
    z-index: 999;
  }
  
  .otp-header {
    margin-bottom: 10px;
    background: linear-gradient(150deg, #DDC7AD, #92785b);
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .otp-message {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
  }
  
  .otp-message.success {
    color: #031f09;
  }
  
  .otp-message.error {
    color: #e74c3c;
  }
  
  .otp-wrapper {
    background: linear-gradient(150deg, #DDC7AD, #92785b);
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  .otp-label {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .otp-inputs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .otp-input-box {
    width: 50px;
    height: 50px;
    font-size: 22px;
    text-align: center;
    border: 2px solid #ddd;
    border-radius: 10px;
    background: #f5f5f5;
    transition: all 0.3s ease;
  }
  
  .otp-input-box:focus {
    outline: none;
    border-color: #3498db;
    background-color: #eaf2f9;
  }
  
  .otp-status {
    text-align: center;
  }
  
  .status {
    font-size: 14px;
    font-weight: bold;
  }
  
  .status.success {
    color: #28a745;
  }
  
  .status.error {
    color: #e74c3c;
  }
  
  .otp-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  .otp-button {
    padding: 12px 25px;
    font-size: 16px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .otp-button.verify {
    background-color: #000000;
    color: #fff;
  }
  
  .otp-button.verify:disabled {
    background-color: #868686;
    cursor: not-allowed;
  }
  .otp-button.cancel{
    background-color: #000000;
    color: #fff;
  }
  .otp-button.cancel:disabled {
    background-color: #868686;
    cursor: not-allowed;
  }
  
  .otp-button.resend {
    background-color: #e74c3c;
    color: #fff;
  }
  
  .otp-button:hover {
    opacity: 0.8;
  }
  </style>
  