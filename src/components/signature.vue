<template>
  <div style="justify-content: center; align-items: center; background-color: transparent; display: flex; margin-top: 200px;">
  <div class="sign1">
      <div class="sign1"  v-if="!OTPsent">
          <label for="fileInput" class="custom-button"  >Upload Signature</label>
          <input class="buttonz" type="file" accept="image/*" id="fileInput" ref="fileInput" style="display: none;" @change="handleFileUpload">
          <img class="uploaded-image" :src="uploadedImageUrl" alt="Uploaded Image" v-if="uploadedImageUrl">

          <div  v-if="OTPsuccesful" class="succesfullyotp"> 
                <a class="succesfullyotp1">
                  OTP loaded successfully
                </a>
              </div>
          <button class="submit-button" @click="sendOTP" v-if="hideUpload">Submit</button>
      </div>

      

      <div v-if="OTPsent">
      <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
          <label for="otpInput" class="Enterotps">Enter OTP:</label>
          <input class="otpinput" type="text" id="otpInput" v-model="otp" @keydown.enter="verifyOTP">
          
          <div  v-if="verifiedotps" class="verifieds"> 
                <a class="verifieds1">
                  Success Verified OTP
                </a>
              </div>
          
          <button class="verifyotps" @click="verifyOTP">Verify OTP</button>
          <button class="verifyotps" @click="sendOTP">Resend OTP</button>
      </div>
  </div>
  
  </div>
</div>
</template>



<script setup>
import { ref } from 'vue';
import axios from 'axios';

const uploadedImageUrl = ref('');
const accountId = localStorage.getItem('accountId');
const OTPsent = ref(false);
const otp = ref('');//ge type
const OTPverified = ref(false);
const otpData = ref([]);//confirm
const hideUpload = ref(false);
const OTPsuccesful = ref (false)
const verifiedotps = ref (false)


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
  await axios.post(`http://172.31.10.148:8000/send-otp/${accountId}`);
  
  
  OTPsuccesful.value = true;
  await fetchOTPData();
  setTimeout(() => {
    OTPsuccesful.value = false;
    OTPsent.value = true;
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
  await axios.post(`http://172.31.10.148:8000/update_account/${accountId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
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
if (otpData.value.length > 0) {
  if (parseInt(otpData.value[0].code) === parseInt(otp.value)) {
    // OTPverified.value = true;
    verifiedotps.value = true;
    submitImage();
    setTimeout(() => {
          window.location.reload();
          }, 2000);
  } else {
  }   
} else {
  console.error('OTP data not preloaded.');
  return;
}
};

const fetchOTPData = async () => {
try {
  const response = await axios.get('http://172.31.10.148:8000/get_otp_json');
  otpData.value = response.data.filter(result => result.account_id == accountId);
} catch (error) {
  console.error('Error fetching OTP data:', error);
}
};



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

</style>