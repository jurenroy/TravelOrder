<template>
  <div class=update1 style="display: flex; justify-content: center; margin-top: 90px;">

    <div class="update2">
      <label style="margin-bottom: 10px; font-weight: bold; font-size: 40px;">Edit Page</label>
      <div class="update3">
        <p class="updateform">{{ name.first_name }} {{ name.middle_init }} {{ name.last_name }}</p>

        <div class="updateinside">
          <div style="display: flex; flex-direction: column;  width: 100%; ">
            <label class="updatelabel old"> Username:</label>
            <input @keydown.enter='sendOTP' type="email" v-model="email" class='updateinput' id='oldemail' required
              readonly>

            <label class="updatelabel old">Enter Old Password: </label>
            <input @keydown.enter='sendOTP' type="password" v-model="passwords" class='updateinput' id='oldpassword'
              required :disabled="notClikable1">


            <!-- <label class="updatelabel new">Enter New Username: </label>
            <input @keydown.enter='sendOTP' type="email" class='updateinput' v-model="newUsername" id='newUsername' required
              :disabled="notClikable1">-->

            <label class="updatelabel new">Enter New Password: </label>
            <input @keydown.enter='sendOTP' type="password" class='updateinput' v-model="newPassword" id='newPassword'
              :disabled="isDisabledinput || notClikable1" required title="Please Input Old Password First">
            <!-- <signature/> -->
            <!-- <div class="uploadpicsignature">
              <label for="fileInput" class="uploadsignature" v-if="uploads">Upload Signature</label>
              <input @keydown.enter='sendOTP' class="buttonz" type="file" accept="image/*" id="fileInput"
                ref="fileInput" style="display: none;" @change="handleFileUpload" v-if="uploads">
              <img class="uploadimagesig" :src="uploadedImageUrl" alt="Uploaded Image" v-if="uploadedImageUrl">
            </div> -->
          </div>

        </div>

        <div v-if="isNotEqual" class="notequal">
          <a class="notequal1">
            Error!!
          </a>
          <a class="notequal2">
            Not Equal to Old Password
          </a>
        </div>

        <div v-else-if="isEditemail" class="editwronge">
          <a class="editwronge1">
            Error Alert!!
          </a>
          <a class="editwronge2">
            Invalid {{ validation }} Input
          </a>
        </div>

        <div v-if="sendingOTP" class="succesfully">
          <a class="succesfully1">
            Sending OTP....
          </a>
        </div>



        <div class="verifyOTPS">
          <label for="otpInput1" class="Enterotp" v-if="showotp">Enter OTP Verification: {{ otppp }}</label>
          <div style="display: flex; flex-direction: row; justify-content: center;">


            <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 1, 0)"
              @input="moveToNextField($event, 2)" class="otpedit" type="text" id="otpInput1" v-model="otp1"
              v-if="showotp" maxlength="1" autofocus>
            <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 2, 1)"
              @input="moveToNextField($event, 3)" class="otpedit" type="text" id="otpInput2" v-model="otp2"
              v-if="showotp" maxlength="1">
            <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 3, 2)"
              @input="moveToNextField($event, 4)" class="otpedit" type="text" id="otpInput3" v-model="otp3"
              v-if="showotp" maxlength="1">
            <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 4, 3)"
              @input="moveToNextField($event, 5)" class="otpedit" type="text" id="otpInput4" v-model="otp4"
              v-if="showotp" maxlength="1">
            <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 5, 4)"
              @input="moveToNextField($event, 6)" class="otpedit" type="text" id="otpInput5" v-model="otp5"
              v-if="showotp" maxlength="1">
            <input @keydown.enter='verifyOTP' @keydown="moveToPrevField($event, 6, 5)"
              @input="moveToNextField($event, 0)" class="otpedit" type="text" id="otpInput6" v-model="otp6"
              v-if="showotp" maxlength="1">
          </div>
          <button class="verifyotp" @click="verifyOTP" v-if="showotp" :disabled="isVerify || verifydisab">Verify
            OTP</button>
          <button class="verifyotp VO" @click="sendOTP" v-if="showotp" :disabled="resed">Resend OTP</button>
        </div>

        <!-- pag send sa otp -->
        <div v-if="succesful" class="succesfully">
          <a class="succesfully1">
            OTP loaded successfully
          </a>
        </div>

        <!-- Loading verify otp -->
        <div v-if="veryOTP" class="succesfully">
          <a class="succesfully1">
            Verifying OTP....
          </a>
        </div>

        <!-- verryfied otp -->
        <div v-if="verifiedotp" class="verified">
          <a class="verified1">
            Success Verified OTP
          </a>
        </div>

        <!-- wrong otp -->
        <div v-if="wrongOTPs" class="notequal">
          <a class="notequal1">
            Incorrect Input OTP
          </a>
        </div>

        <!-- expired1 OTP -->
        <div v-if="expi" class="notequal">
          <a class="notequal1">
            OTP Expired
          </a>
        </div>

        <div class="buttonss">
          <button class="button yes" @click="sendOTP" :disabled="isDisabled" v-if="isbackDisabled">Update</button>
          <button class="button no" @click="handleBack2" v-if="1==1">Back</button>

        </div>

      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { API_BASE_URL } from '../config'

  // Define props
  const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(); // Add this line
const handleBack2 = () => {
  emit('handleBack2', false); // Emit the ID as 0
  console.log('damn')
  // Reset form fields if necessary
};


const accountIdz = localStorage.getItem('accountId');

const uploadedImageUrl = ref('');
const accounts = ref([]);
const names = ref([]);
const name = ref('')
const email = ref('')
const newUsername = ref('')
const oldPass = ref('')
const passwords = ref('')
const newPassword = ref('')
const signature = ref('')
const hakdog = ref('')
const isNotEqual = ref(false)
const otp = ref('');
const otpData = ref([]);
const showotp = ref(false)
const uploads = ref(true)
const succesful = ref(false);
const verifiedotp = ref(false)
const isEditemail = ref(false)
const validation = ref('')
const notClikable1 = ref(false)
const sendingOTP = ref(false)
const buttdis = ref(false);
const veryOTP = ref(false);
const wrongOTPs = ref(false);
const resed = ref(true)
const expi = ref(false)
const verifydisab = ref(false);
const otp1 = ref('');
const otp2 = ref('');
const otp3 = ref('');
const otp4 = ref('');
const otp5 = ref('');
const otp6 = ref('');
const otppp = ref('');


// const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passvalids = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;

const isDisabled = computed(() => {
  return newUsername.value === '' && newPassword.value === '' && signature.value === '' && !uploadedImageUrl.value;
});

const decr = computed(() => {
  const decrypted = CryptoJS.AES.decrypt(oldPass.value, 'jUr3ñr0yR@br4g@n');
  return decrypted.toString(CryptoJS.enc.Utf8);
})

const isDisabledinput = computed(() => {
  return passwords.value !== decr.value;

})

const isbackDisabled = computed(() => {
  return showotp.value === false && uploads.value === true
});


const isVerify = computed(() => {
  return otp1.value === '' || otp2.value === '' || otp3.value === '' || otp4.value === '' || otp5.value === '' || otp6.value === '';
});


const clickableDisable = () => {
  notClikable1.value = true

}
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



const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageUrl.value = e.target.result;
      signature.value = dataURItoBlob(uploadedImageUrl.value);
    };
    reader.readAsDataURL(file);
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



const sendOTP = async () => {
  resed.value = true;
  sendingOTP.value = true;
  verifydisab.value = false;

  otp1.value = ''
  otp2.value = ''
  otp3.value = ''
  otp4.value = ''
  otp5.value = ''
  otp6.value = ''
  try {

    await axios.post(`${API_BASE_URL}/send-otp/${accountIdz}`);
    if ((newUsername.value) === false && newUsername.value !== '') {
      isEditemail.value = true;
      validation.value = 'Email'
      setTimeout(() => {
        isEditemail.value = false;
      }, 3000);
    } else if (passvalids.test(newPassword.value) === false && newPassword.value !== '') {
      isEditemail.value = true;
      validation.value = 'Password'
      setTimeout(() => {
        isEditemail.value = false;
      }, 3000);

    } else {
      sendingOTP.value = false;
      succesful.value = true;
      await fetchOTPData();
      setTimeout(() => {

        succesful.value = false;
        showotp.value = true;
        uploads.value = false;
        uploadedImageUrl.value = ''

        clickableDisable()
        handleFileUpload()
      }, 2000);

    }



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
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

const verifyOTP = () => {
  const fullOTP = otp1.value + otp2.value + otp3.value + otp4.value + otp5.value + otp6.value;
  verifydisab.value = true;
  veryOTP.value = true;
  isVerify.value = true;
  setTimeout(() => {
    veryOTP.value = false;
    if (otpData.value.length > 0) {
      const currentTime = getCurrentTimeAdjusted();
      const backendExpiryTime = otpData.value[0].expires_at;



      const expiryTimeAdjusted = adjustExpiryTime(backendExpiryTime);
      if (expiryTimeAdjusted > currentTime) {

        verifydisab.value = false;
        wrongOTPs.value = true
        setTimeout(() => {
          wrongOTPs.value = false
          otp1.value = "";
          otp2.value = "";
          otp3.value = "";
          otp4.value = "";
          otp5.value = "";
          otp6.value = "";
        }, 2000);
        verifydisab.value = false
        if (parseInt(otpData.value[0].code) === parseInt(fullOTP)) {
          wrongOTPs.value = false;
          submitImage();
          updateProfile();
        } else {

          wrongOTPs.value = true;
          setTimeout(() => {
            wrongOTPs.value = false
          }, 3000);
        }
      } else {

        expi.value = true
        resed.value = false
        setTimeout(() => {
          expi.value = false
          verifydisab.value = true
        }, 2000);


      }
    } else {
      console.error('OTP data not preloaded.');
      return;
    }
  }, 3000);

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

const updateProfile = () => {
  const formData = new FormData();
  try {

    if (newUsername.value !== '') {
      formData.append('email', newUsername.value);

    } else {
    }

    if (passwords.value !== '' && newPassword.value !== '') {
      const encryptedNewPassword = CryptoJS.AES.encrypt(newPassword.value, 'jUr3ñr0yR@br4g@n').toString();
      formData.append('password', encryptedNewPassword.value);
    } else {
    }

    if (signature.value !== '') {
      formData.append('signature', signature.value);
    } else {
    }

    axios.post(`${API_BASE_URL}/update_account/${accountIdz}`, formData)
      .then(response => {
        verifiedotp.value = (true)
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        console.error('Invalid data:', error);
      });
  } catch (error) {
  }
}

const fetchAccounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_accounts_json`);

    accounts.value = await response.data.filter(result => result.account_id == accountIdz);
    email.value = accounts.value[0].email
    oldPass.value = accounts.value[0].password
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
};
const nameLoaded = ref(true)

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

const convert = async () => {
  name.value = name.value.toUpperCase()
};

const fetchOTPData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_otp_json`);
    otpData.value = response.data.filter(result => result.account_id == accountIdz);
    otppp.value = otpData.value[0].code
  } catch (error) {
    console.error('Error fetching OTP data:', error);
  }
};

fetchAccounts();
fetchNames();
convert();

</script>


<script>
import { Usernames, showEdit, hideedit } from '@/components/heder.vue';
import { isEdits, isRegistrationClicked, isVisible } from '@/views/dashboard.vue';
import { leaveedit, isaddleave } from './leaveform.vue';


export default {


  methods: {
    cli() {
      leaveedit.value = false
      showEdit.value = false;
      isEdits.value = false
      Usernames.value = true
      isRegistrationClicked.value = false;
      isVisible.value = false
      hideedit.value = true
      isaddleave.value = false
    },




  }
}
</script>

<style>
.update2 {
  top: 0px;
  position: absolute;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.update3 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  background-color: white;
  width: 400px;
  max-width: 500px;
  height: auto;
  padding: 20px;
  color: #212121;
  border: 2px solid black;
  box-shadow: 0px 0px 4px black, 0px 0px 3px black inset;
}

.update3.zoomed {
  transform: scale(2);
}

.updateform {
  font-weight: bold;
  font-size: 25px;
  margin-top: 20px;
}

.updateinside {
  display: flex;
  width: 300px;
  flex-direction: row;
  justify-content: space-around;
}

.buttonss {
  display: flex;
  position: relative;
  flex-direction: row;
  height: 40px;
  
  justify-content: space-between;
  margin-top: 8px;

}

.button {
  border-radius: 10px;
  width: 100px;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
}

.yes {
  margin-left: -20px;
}

.no {
  margin-left: 50px;
}

.updateinput {
  font-size: 18px;
  border-radius: 5px;
  width: 96%;
  height: 30px;
  margin-bottom: 12px;
}

.updatelabel {
  font-weight: bold;
  font-size: 18px;
  text-align: left;
}

.notequal {
  top: 0;
  left: 0;
  width: fit-content;
  justify-self: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #c95e58;
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 0px 0px 4px #c95e58, 0px 0px 3px #c95e58 inset;
  ;
}

.notequal1 {
  height: 20px;
  width: 100%;
  text-align: center;
  color: black;

}

.notequal2 {
  height: 20px;
  width: 100%;
  text-align: center;
}

.uploadimagesig {
  margin-top: 10px;
  max-width: 100%;
  height: 100px;
  width: auto;
  border: 1px solid black;
}

.uploadsignature {
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

.uploadsignature:hover {
  background-color: black;
  color: white;
  border: 1px solid white;
}

.uploadpicsignature {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.succesfully {
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
  ;
}

.succesfully1,
.verified1 {
  height: 20px;
  width: 100%;
  text-align: center;
  color: black;
}

.verifyOTPS {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.verified {
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
  ;
}

.verifyotp {
  height: 20px;
  width: 100px;
  margin-top: -5px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 13px;
}

.VO {
  margin-top: 1px;
}

.otpedit {
  font-size: 12px;
  border-radius: 1px;
  border-color: transparent;
  border-width: 0 0 2px 0;
  border-color: black;
  border-style: solid;
  width: 10%;
  height: 35px;
  margin-left: 9px;
  margin-bottom: 12px;
  text-align: center;
  font-size: 24px;
  outline: none;
}

.editwronge {
  top: 0;
  left: 0;
  width: fit-content;
  justify-self: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #c95e58;
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 0px 0px 4px #c95e58, 0px 0px 3px #c95e58 inset;
  ;
}

.editwronge1 {
  height: 20px;
  width: 100%;
  text-align: center;
  color: black;

}

.editwronge2,
.correct1,
.correct2 {
  color: black;
}

.Enterotp {
  font-weight: bold;
  font-size: 18px;
  text-align: left;
}


@media (max-width: 768px) {

  .updateinside {
    flex-direction: column;
  }

  .update1 {
    top: -3000px
  }
}
</style>