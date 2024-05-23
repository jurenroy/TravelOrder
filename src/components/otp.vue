<template>
  <div
    style="justify-content: center;  background-color: white; display: flex; margin-top: 100px; position: absolute;  width: 300px; height: auto; ">
    
    <div v-if="sendingOTPS" class="verifieds">
      <a class="verifieds1">
        Sending OTP....
      </a>
    </div>

    <div v-if="OTPsuccesful" class="succesfullyotp">
      <a class="succesfullyotp1">
        OTP loaded successfully
      </a>
    </div>
    <div v-if="!OTPsuccesful && !OTPsent && ANSAK" class="unsuccesfullyotp">
      <a class="succesfullyotp1">
        OTP loaded unsuccessfully
      </a>
    </div>
    <div v-if="OTPsent" style="border: 2px solid black; border-radius: 10px;">
      <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
        <label for="otpInput1" class="Enterotps">Enter OTP: {{ otppp }}</label>
        <div style="display: flex; flex-direction: row;">

          <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 1, 0)" @input="moveToNextField($event, 2)"
            class="otprecomen" type="text" id="otpInput1" v-model="otp1" maxlength="1">
          <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 2, 1)" @input="moveToNextField($event, 3)"
            class="otprecomen" type="text" id="otpInput2" v-model="otp2" maxlength="1">
          <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 3, 2)" @input="moveToNextField($event, 4)"
            class="otprecomen" type="text" id="otpInput3" v-model="otp3" maxlength="1">
          <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 4, 3)" @input="moveToNextField($event, 5)"
            class="otprecomen" type="text" id="otpInput4" v-model="otp4" maxlength="1">
          <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 5, 4)" @input="moveToNextField($event, 6)"
            class="otprecomen" type="text" id="otpInput5" v-model="otp5" maxlength="1">
          <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 6, 5)" @input="moveToNextField($event, 0)"
            class="otprecomen" type="text" id="otpInput6" v-model="otp6" maxlength="1">

        </div>
        <div v-if="verifiedotps" class="verifieds">
          <a class="verifieds1">
            Success Verified OTP
          </a>
        </div>

        <div v-if="expired" class="expireds">
          <a class="verifieds1">
            OTP Expired
          </a>
        </div>

        <div v-if="wrongOTPs" class="expireds">
          <a class="verifieds1">
            Incorrect Input OTP
          </a>
        </div>

        <button class="verifyotps" v-if="expir" :disabled="isVerify" @click="verifyOTP">Verify OTP</button>
        <button class="verifyotps" v-if="expire" @click="sendOTP">Resend OTP</button>
      </div>
    </div>

  </div>
</template>



<script setup>
import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { ref, computed } from 'vue';

const otpInput1 = ref(null);



const authStore = useAuthStore();

const uploadedImageUrl = ref('');
const accountId = localStorage.getItem('accountId');
const otp = ref('');//ge type
// const OTPverified = ref(false);
const OTPsent = ref(false);
const otpData = ref([]);//confirm
const hideUpload = ref(false);
const OTPsuccesful = ref(false)
const verifiedotps = ref(false)
const ANSAK = ref(false)
const expired = ref(false)
const expire = ref(false)
const expir = ref(true)
const wrongOTPs = ref(false)
const sendingOTPS = ref(true)

const otp1 = ref('');
const otp2 = ref('');
const otp3 = ref('');
const otp4 = ref('');
const otp5 = ref('');
const otp6 = ref('');

const otppp = ref('');

const isVerify = computed(() => {
  return otp1.value === '' || otp2.value === '' || otp3.value === '' || otp4.value === '' || otp5.value === '' || otp6.value === '';
});

// Function to update the value of verifiedotps and emit the event
const updateVerifiedOTPs = (value) => {
  verifiedotps.value = value;
  emits('update:verifiedotps', value);
};

const moveToPrevField = (event, currentField, prevField) => {
  if (event.key === 'Backspace' && event.target.value === '') {
    const prevInput = document.getElementById(`otpInput${prevField}`);
    if (prevInput) {
      prevInput.focus();
    }
  } else if (event.target.value && !isNaN(event.target.value)) {
    const nextInput = document.getElementById(`otpInput${currentField}`);
    if (nextInput) {
      nextInput.focus();
    }
  }
};

const moveToNextField = (event, nextField) => {
  event.target.value = event.target.value.replace(/[^0-9]/g, "");
  if (event.target.value && !isNaN(event.target.value)) {
    const nextInput = document.getElementById(`otpInput${nextField}`);
    if (nextInput) {
      nextInput.focus();
    }
  }
};

const getCurrentTimeAdjusted = () => {
  const today = new Date();
  today.setHours(today.getHours() - 8); // Add 8 hours
  let hr = today.getHours();
  let mn = today.getMinutes();
  let sc = today.getSeconds();

  // Ensure leading zero for single digit values
  hr = (hr < 10) ? '0' + hr : hr;
  mn = (mn < 10) ? '0' + mn : mn;
  sc = (sc < 10) ? '0' + sc : sc;

  return `${hr}:${mn}:${sc}`;
};

const showUpload = () => {
  hideUpload.value = true
}

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageUrl.value = e.target.result;
      showUpload();
    };
    reader.readAsDataURL(file);
  }
};

const sendOTP = async () => {
  expire.value = false
  otp1.value = ''
  otp2.value = ''
  otp3.value = ''
  otp4.value = ''
  otp5.value = ''
  otp6.value = ''
  try {
    OTPsent.value = false;
    verifiedotps.value = false;
    await axios.post(`http://172.31.10.164:8000/send-otp/${accountId}`);
    sendingOTPS.value = false
    OTPsuccesful.value = true;
    expired.value = false
    expir.value = true
    await fetchOTPData();
    setTimeout(() => {
      OTPsuccesful.value = false;
      OTPsent.value = true;
    }, 2000);
  } catch (error) {
    console.error('Error sending OTP:', error);
    OTPsent.value = false;
    OTPsuccesful.value = false;
    ANSAK.value = true;
  }
};

const verifyOTP = () => {
  const fullOTP = otp1.value + otp2.value + otp3.value + otp4.value + otp5.value + otp6.value;
  if (otpData.value.length > 0) {
    const currentTime = getCurrentTimeAdjusted();
    const backendExpiryTime = otpData.value[0].expires_at;

    // Adjust backend expiry time by adding 8 hours
    const expiryTimeAdjusted = adjustExpiryTime(backendExpiryTime);
    if (expiryTimeAdjusted > currentTime) {
      if (parseInt(otpData.value[0].code) === parseInt(fullOTP)) {
        // OTPverified.value = true;
        verifiedotps.value = true;
        authStore.updateVerifiedOTPs('true'); // Update state using Pinia store
        localStorage.setItem('verifiedOTPs', 'true');

        //   setTimeout(() => {
        //         window.location.reload();
        //         }, 2000);
      } else {
        wrongOTPs.value = true
        otp1.value = ''
        otp2.value = ''
        otp3.value = ''
        otp4.value = ''
        otp5.value = ''
        otp6.value = ''
        setTimeout(() => {
          wrongOTPs.value = false
        }, 2000);
      }
    } else {
      otp1.value = ''
      otp2.value = ''
      otp3.value = ''
      otp4.value = ''
      otp5.value = ''
      otp6.value = ''
      expire.value = true
      expired.value = true
      expir.value = false
      setTimeout(() => {
        expired.value = false
      }, 2000);
    }
  } else {
    console.error('OTP data not preloaded.');
    return;
  }
};

const adjustExpiryTime = (expiryTime) => {
  const expiryTimeParts = expiryTime.split(':');
  let hours = parseInt(expiryTimeParts[0]);
  let minutes = parseInt(expiryTimeParts[1]);
  let seconds = parseInt(expiryTimeParts[2]);

  // Ensure 24-hour format
  hours = hours % 24;

  // Format hours, minutes, seconds
  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  return `${hours}:${minutes}:${seconds}`;
};


const fetchOTPData = async () => {
  try {
    const response = await axios.get('http://172.31.10.164:8000/get_otp_json');
    otpData.value = response.data.filter(result => result.account_id == accountId);
    otppp.value = otpData.value[0].code
  } catch (error) {
    console.error('Error fetching OTP data:', error);
  }
};


sendOTP()
</script>

<style scoped>
.succesfullyotp {
  top: 0;
  left: 0;
  width: fit-content;
  /* Adjust width based on content */
  justify-self: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #39b259;
  /* background-color: #39b259; */
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 0px 0px 10px #39b259, 0px 0px 10px #39b259 inset;
}

.unsuccesfullyotp {
  top: 0;
  left: 0;
  width: fit-content;
  /* Adjust width based on content */
  justify-self: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #d23636;
  /* background-color: #d23636; */
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 0px 0px 10px #d23636, 0px 0px 10px #d23636 inset;
}

.succesfullyotp1,
.verifieds1 {
  height: 20px;
  width: 100%;
  text-align: center;
  color: black;
}

.sign1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto;
  width: 200px;
}

.buttonz {
  margin-top: 90px;
}

.uploaded-image {
  margin-top: 10px;
  max-width: 100%;
  height: 90px;
  width: auto;
  border: 1px solid black;
}

.submit-button {
  margin-top: 20px;
  height: 30px;
  width: 90px;
  font-size: 13px;
  color: black;
  cursor: pointer;
  border-radius: 10px;
  margin-left: 10px;
}

.custom-button {
  height: 20px;
  width: 100px;
  font-size: 13px;
  color: black;
  cursor: pointer;
  padding: 5px;
  border: 1px solid black;
  border-radius: 5px;
  margin-left: 10px;
  font-weight: bold;
  font-size: 13px;

}

.custom-button:hover {
  background-color: black;
  color: white;
  border: 1px solid white;
}

.otpinput {
  font-size: 12px;
  border-radius: 5px;
  width: 50%;
  height: 15px;
  margin-bottom: 12px;

}

.Enterotps {
  font-weight: bold;
  font-size: 23px;
  text-align: left;
}


.verifyotps {
  height: 50px;
  width: 100px;
  margin-top: -5px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 13px;
  margin-bottom: 10px;
}

.verifieds {
  top: 0;
  left: 0;
  width: fit-content;
  /* Adjust width based on content */
  justify-self: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #39b259;
  /* background-color: #39b259; */
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 0px 0px 10px #39b259, 0px 0px 10px #39b259 inset
}

.expireds {
  top: 0;
  left: 0;
  width: fit-content;
  /* Adjust width based on content */
  justify-self: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #cf4545;
  /* background-color: #d12727; */
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 0px 0px 10px #cf4545, 0px 0px 10px #cf4545 inset;
}

.otprecomen {
  /* font-size: 12px;
  border-radius: 5px;
  width: 10%;
  height: 35px;
  margin-top: 15px;
  margin-left: 10px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 24px; */
 
  font-size: 12px;
  border-radius: 1px;
  border-color: transparent;
  border-width: 0 0 2px 0;
  border-color: black;
  border-style: solid;
  width: 11.5%;
  height: 35px;
  margin-left: 10px;
  margin-bottom: 12px;
  text-align: center;
  font-size: 24px;

}
</style>