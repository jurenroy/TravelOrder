<template>
    <div style="justify-content: center; align-items: center; background-color: white; display: flex; margin-top: 10px; position: absolute; z-index:999">
        <div  v-if="OTPsuccesful" class="succesfullyotp"> 
                <a class="succesfullyotp1">
                  OTP loaded successfully
                </a>
              </div>
              <div  v-if="!OTPsuccesful && !OTPsent && ANSAK" class="unsuccesfullyotp"> 
                <a class="succesfullyotp1">
                  OTP loaded unsuccessfully
                </a>
              </div>
        <div v-if="OTPsent">
        <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
            <label for="otpInput" class="Enterotps">Enter OTP: </label>
            <input class="otpinput" type="text" id="otpInput" v-model="otp" @keydown.enter="verifyOTP">
            
            <div  v-if="verifiedotps" class="verifieds"> 
                  <a class="verifieds1">
                    Success Verified OTP
                  </a>
                </div>

                <div  v-if="expired" class="expireds"> 
                  <a class="verifieds1">
                  OTP Expired
                  </a>
                </div>
            
            <button class="verifyotps" v-if="!expired" @click="verifyOTP">Verify OTP</button>
            <button class="verifyotps" v-if="expired"@click="sendOTP">Resend OTP</button>
        </div>
    </div>
    
    </div>
  </template>
  
  
  
  <script setup>
  import axios from 'axios';
  import { ref } from 'vue';
  import { useAuthStore } from '../store/auth';

  const authStore = useAuthStore();
  
  const uploadedImageUrl = ref('');
  const accountId = localStorage.getItem('accountId');
  const otp = ref('');//ge type
  const OTPverified = ref(false);
  const OTPsent = ref(false);
  const otpData = ref([]);//confirm
  const hideUpload = ref(false);
  const OTPsuccesful = ref (false)
  const verifiedotps = ref (false)
  const ANSAK = ref (false)
  const expired = ref (false)

  // Function to update the value of verifiedotps and emit the event
  const updateVerifiedOTPs = (value) => {
    verifiedotps.value = value;
    emits('update:verifiedotps', value);
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
  try {
    OTPsent.value = false;
    verifiedotps.value = false;
    console.log('sending OTP')
    await axios.post(`http://172.31.10.148:8000/send-otp/${accountId}`);
    OTPsuccesful.value = true;
    expired.value = false
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
    if (otpData.value.length > 0) {
      const currentTime = getCurrentTimeAdjusted();
      const backendExpiryTime = otpData.value[0].expires_at;
      console.log(currentTime)
      console.log(backendExpiryTime)

        // Adjust backend expiry time by adding 8 hours
        const expiryTimeAdjusted = adjustExpiryTime(backendExpiryTime);
        console.log(expiryTimeAdjusted)
        if (expiryTimeAdjusted > currentTime) {
            console.log('OTP still valid');
            if (parseInt(otpData.value[0].code) === parseInt(otp.value)){
              // OTPverified.value = true;
              verifiedotps.value = true;
              console.log('sakto ka')
              authStore.updateVerifiedOTPs('true'); // Update state using Pinia store
              localStorage.setItem('verifiedOTPs', 'true');

            //   setTimeout(() => {
            //         window.location.reload();
            //         }, 2000);
            } else{
              console.log('wa jud ta nagkadimao bai')
            }  
        } else {
            console.log('OTP expired');
            expired.value = true
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
    const response = await axios.get('http://172.31.10.148:8000/get_otp_json');
    otpData.value = response.data.filter(result => result.account_id == accountId);
    console.log(otpData.value[0].id)
    console.log(otpData.value[0].code)
    console.log(otpData.value[0].account_id)
    console.log(otpData.value[0].created_at)
    console.log(otpData.value[0].expires_at)
    console.log(getCurrentTimeAdjusted())
  } catch (error) {
    console.error('Error fetching OTP data:', error);
  }
  };

  
  sendOTP()
  </script>
  
  <script>
  
  </script>
  
  
  <style scoped>
  .succesfullyotp{
   top:0;
   left:0;
   width: fit-content; /* Adjust width based on content */
   justify-self: center;
   display: flex;
   flex-direction: column;
   border: 1px solid #212121;
   background-color: #39b259;
   padding: 10px;
   margin: 10px auto;
   border-radius: 10px;
   box-shadow: 0px 0px 35px -2px #39b259;
  }
  .unsuccesfullyotp{
   top:0;
   left:0;
   width: fit-content; /* Adjust width based on content */
   justify-self: center;
   display: flex;
   flex-direction: column;
   border: 1px solid #212121;
   background-color: #d23636;
   padding: 10px;
   margin: 10px auto;
   border-radius: 10px;
   box-shadow: 0px 0px 35px -2px #d73e3e;
  }
  .succesfullyotp1,.verifieds1{
   height: 20px;
   width: 100%;
   text-align: center;
   color: white;
  }
  
  .sign1{
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: auto;
    width:200px;
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
    font-weight:bold;
    font-size: 13px;
  
  }
  
  .custom-button:hover {
  background-color: black;
  color: white;
  border: 1px solid white;
  }
  .otpinput{
  font-size: 12px;
   border-radius: 5px;
   width: 50%;
   height: 15px;
   margin-bottom: 12px;
  
  }
  .Enterotps{
  font-weight:bold;
    font-size: 18px;
    text-align: left;
  }
  
  
  .verifyotps{
  height: 20px;
    width: 100px; 
    margin-top:-5px; 
    cursor: pointer;
    border-radius:5px;
    font-size: 13px;
    margin-bottom: 10px;
  }
  .verifieds{
    top:0;
   left:0;
   width: fit-content; /* Adjust width based on content */
   justify-self: center;
   display: flex;
   flex-direction: column;
   border: 1px solid #212121;
   background-color: #39b259;
   padding: 10px;
   margin: 10px auto;
   border-radius: 10px;
   box-shadow: 0px 0px 35px -2px #39b259;
  }
  .expireds{
    top:0;
   left:0;
   width: fit-content; /* Adjust width based on content */
   justify-self: center;
   display: flex;
   flex-direction: column;
   border: 1px solid #212121;
   background-color: #d12727;
   padding: 10px;
   margin: 10px auto;
   border-radius: 10px;
   box-shadow: 0px 0px 35px -2px #cf4545;
  }
  
  </style>