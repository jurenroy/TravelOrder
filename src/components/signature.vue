<template>
  <div
    style="justify-content: center; align-items: center; background-color: transparent; display: flex; margin-top: 200px;">
    <div class="sign1">
      <div class="sign1" v-if="!OTPsent">
        <label for="fileInput" class="custom-button">Upload Signature</label>
        <input class="buttonz" type="file" accept="image/*" id="fileInput" ref="fileInput" style="display: none;"
          @change="handleFileUpload">
        <img class="uploaded-image" :src="uploadedImageUrl" alt="Uploaded Image" v-if="uploadedImageUrl">

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
        <button class="submit-button" @click="sendOTP" :disabled="dlimaclick" v-if="hideUpload">Submit</button>
      </div>



      <div v-if="OTPsent">
        <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;  width: 170%;">
          <label for="otpInput" class="Enterotps">Enter OTP Verification: {{ otppp }}</label>

          <div style="display: flex; flex-direction: row;">

            <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 1, 0)"
              @input="moveToNextField($event, 2)" class="otpinput" type="text" id="otpInput1" v-model="otp1"
              maxlength="1" autofocus>
            <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 2, 1)"
              @input="moveToNextField($event, 3)" class="otpinput" type="text" id="otpInput2" v-model="otp2"
              maxlength="1">
            <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 3, 2)"
              @input="moveToNextField($event, 4)" class="otpinput" type="text" id="otpInput3" v-model="otp3"
              maxlength="1">
            <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 4, 3)"
              @input="moveToNextField($event, 5)" class="otpinput" type="text" id="otpInput4" v-model="otp4"
              maxlength="1">
            <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 5, 4)"
              @input="moveToNextField($event, 6)" class="otpinput" type="text" id="otpInput5" v-model="otp5"
              maxlength="1">
            <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 6, 5)"
              @input="moveToNextField($event, 0)" class="otpinput" type="text" id="otpInput6" v-model="otp6"
              maxlength="1">

          </div>



          <div v-if="sendingOTPS2" class="verifieds">
            <a class="verifieds1">
              Sending OTP....
            </a>
          </div>


          <div v-if="expired" class="notequal">
            <a class="notequal1">
              OTP Expired
            </a>
          </div>



          <div v-if="verifyingotp" class="verifieds">
            <a class="verifieds1">
              Verifying OTP....
            </a>
          </div>

          <div v-if="verifiedotps" class="verifieds">
            <a class="verifieds1">
              Success Verified OTP
            </a>
          </div>
          <div v-if="wrongsOTPs" class="notequal">
            <a class="notequal1">
              Incorrect Input OTP
            </a>
          </div>

          <button class="verifyotps" @click="verifyOTP" :disabled="verify || verifydisab">Verify OTP</button>

          <button class="verifyotps" @click="sendOTP" :disabled="resed">Resend OTP</button>
        </div>
      </div>

    </div>
  </div>
</template>



<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '../config'
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore(); // Use the store
const uploadedImageUrl = ref('');
const accountId = authStore.account_id;
const OTPsent = ref(false);
const otp = ref('');
const OTPverified = ref(false);
const otpData = ref([]);
const hideUpload = ref(false);
const OTPsuccesful = ref(false)
const OTPsuccesful2 = ref(false)
const verifiedotps = ref(false)
const sendingOTPS = ref(false)
const sendingOTPS2 = ref(false)
const dlimaclick = ref(false)
const verifyingotp = ref(false)
const wrongsOTPs = ref(false)
const expired = ref(false)
const resed = ref(true)
const OTPsent2 = ref(false)

const verifydisab = ref(false);
const otp1 = ref('');
const otp2 = ref('');
const otp3 = ref('');
const otp4 = ref('');
const otp5 = ref('');
const otp6 = ref('');
const otppp = ref('');


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

const verify = computed(() => {
  return otp1.value === '' || otp2.value === '' || otp3.value === '' || otp4.value === '' || otp5.value === '' || otp6.value === '';
});

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
  sendingOTPS.value = true;
  resed.value = true;
  verifydisab.value = false

  otp1.value = ''
  otp2.value = ''
  otp3.value = ''
  otp4.value = ''
  otp5.value = ''
  otp6.value = ''
  try {
    await axios.post(`${API_BASE_URL}/send-otp/${accountId}`);
    await fetchOTPData();
    sendingOTPS.value = false;
    OTPsuccesful.value = true;
    setTimeout(() => {
      sendingOTPS2.value = false;
      OTPsuccesful2.value = true
      OTPsuccesful.value = false;
      OTPsent.value = true;
      OTPsent2.value = true;

    }, 2000);

  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};

const submitImage = async () => {
  if (!uploadedImageUrl.value) {
    console.error('No image uploaded.');
    return;
  }
  try {
    const formData = new FormData();
    const file = dataURItoBlob(uploadedImageUrl.value);
    formData.append('signature', file);
    await axios.post(`${API_BASE_URL}/update_account/${accountId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // After successful image upload, call the changeSignature action
    if (response.status === 200) {
      authStore.changeSignature(file);  // Call the changeSignature action after success
      console.log('Image uploaded and signature updated.');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mimeString });
};

const verifyOTP = () => {
  const fullOTP = otp1.value + otp2.value + otp3.value + otp4.value + otp5.value + otp6.value;
  verifydisab.value = true
  verifyingotp.value = true;
  verify.value = true;
  setTimeout(() => {
    if (otpData.value.length > 0) {
      const currentTime = getCurrentTimeAdjusted();
      const backendExpiryTime = otpData.value[0].expires_at;


      const expiryTimeAdjusted = adjustExpiryTime(backendExpiryTime);
      if (1 == 1) {
        verifydisab.value = false
        if (parseInt(otpData.value[0].code) === parseInt(fullOTP)) {

          verifyingotp.value = false;
          verifiedotps.value = true;
          submitImage();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          verifyingotp.value = false;
          // verifydisab.value = false
          wrongsOTPs.value = true;
          setTimeout(() => {

            wrongsOTPs.value = false
          }, 2000);
        }
      } else {
        verifyingotp.value = false
        expired.value = true
        resed.value = false
        setTimeout(() => {
          expired.value = false
          verifydisab.value = true

        }, 2000);
      }
    } else {
      console.error('OTP data not preloaded.');
      return;
    }
  }, 2000);


};
const adjustExpiryTime = (expiryTime) => {
  const expiryTimeParts = expiryTime.split(':');
  let hours = parseInt(expiryTimeParts[0]);
  let minutes = parseInt(expiryTimeParts[1]);
  let seconds = parseInt(expiryTimeParts[2]);

  hours = hours % 24;

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  return `${hours}:${minutes}:${seconds}`;
};




const getCurrentTimeAdjusted = () => {
  const today = new Date();
  today.setHours(today.getHours() - 8); 
  let hr = today.getHours();
  let mn = today.getMinutes();
  let sc = today.getSeconds();

  hr = (hr < 10) ? '0' + hr : hr;
  mn = (mn < 10) ? '0' + mn : mn;
  sc = (sc < 10) ? '0' + sc : sc;

  return `${hr}:${mn}:${sc}`;
};

const fetchOTPData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_otp_json`);
    otpData.value = response.data.filter(result => result.account_id == accountId);
    otppp.value = otpData.value[0].code
  } catch (error) {
    console.error('Error fetching OTP data:', error);
  }
};



</script>



<style scoped>
.succesfullyotp {
  top: 0;
  left: 0;
  width: 200px;
  justify-self: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #39b259;
  padding: 10px;
  margin-top: 12px;
  margin-left: 15px;
  border-radius: 10px;
  box-shadow: 0px 0px 4px #39b259, 0px 0px 3px #39b259 inset;
}

.succesfullyotp1,
.verifieds1 {
  height: 20px;
  width: 100%;
  text-align: center;
  font-size: 19px;
  font-weight: bold;
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
  max-width: 200%;
  height: 200px;
  width: auto;
  border: 1px solid black;
}

.submit-button {
  margin-top: 20px;
  height: 60px;
  width: 190px;
  font-size: 22px;
  color: black;
  cursor: pointer;
  border-radius: 10px;
  margin-left: 10px;
  background-color: white;
  border-radius: 2px solid black;
}

.custom-button {
  text-align: center;
  height: 30px;
  width: 200px;
  color: black;
  cursor: pointer;
  padding: 5px;
  border: 2px solid black;
  border-radius: 5px;
  margin-left: 10px;
  font-weight: bold;
  font-size: 24px;

}

.custom-button:hover {
  background-color: black;
  color: white;
  border: 1px solid white;
}

.otpinput {
  font-size: 12px;
  border-radius: 1px;
  border-color: transparent;
  border-width: 0 0 2px 0;
  border-color: black;
  border-style: solid;
  width: 35%;
  height: 35px;
  margin-left: 10px;
  margin-bottom: 12px;
  text-align: center;
  font-size: 24px;
  outline: none;
}

.Enterotps {
  font-weight: bold;
  font-size: 24px;
  text-align: left;
}


.verifyotps {
  height: 40px;
  width: 150px;
  margin-top: 9px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 13px;
  margin-bottom: 10px;
}

.verifieds {
  top: 0;
  left: 0;
  width: fit-content;
  justify-self: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #39b259;
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 0px 0px 4px #39b259, 0px 0px 3px #39b259 inset;
  border-radius: 5px;
  font-size: 20px;
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
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 0px 0px 4px #39b259, 0px 0px 3px #39b259 inset;
}

.notequal1 {
  height: 20px;
  width: 100%;
  text-align: center;
  color: black;


}

.notequal {
  top: 0;
  left: 0;
  width: 200px;
  justify-self: center;
  display: flex;
  flex-direction: column;
  border: 1px solid red;
  padding: 10px;
  margin-top: 12px;
  margin-left: 60px;
  border-radius: 10px;
  box-shadow: 0px 0px 4px red, 0px 0px 3px red inset;

}
</style>