<template>
    <div style="justify-content: center; align-items: center; background-color: transparent; display: flex;">
    <div class="sign1">
        <div class="sign1"  v-if="!OTPsent">
            <label for="fileInput" class="custom-button"  >Upload Signature</label>
            <input class="buttonz" type="file" accept="image/*" id="fileInput" ref="fileInput" style="display: none;" @change="handleFileUpload">
            <img class="uploaded-image" :src="uploadedImageUrl" alt="Uploaded Image" v-if="uploadedImageUrl">

            <button class="submit-button" @click="sendOTP" v-if="hideUpload">Submit</button>
        </div>
        <div v-if="OTPsent">
        <p>OTP Sent to Email Successfully</p>
        <div>
            <label for="otpInput">Enter OTP:</label>
            <input class="otpinput" type="text" id="otpInput" v-model="otp" @keydown.enter="verifyOTP">
            <button class="verifyotp" @click="verifyOTP">Verify OTP</button>
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
      console.log('Uploaded image file:', file.name);
    };
    reader.readAsDataURL(file);
  }
};

const sendOTP = async () => {
  try {
    await axios.post(`http://127.0.0.1:8000/send-otp/${accountId}`);
    OTPsent.value = true;
    console.log('OTP Sent to Email Successfully');
    await fetchOTPData();
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
    await axios.post(`http://127.0.0.1:8000/update_account/${accountId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Image uploaded successfully!');
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
    console.log('wews',parseInt(otpData.value[0].code))
    console.log(otp.value)
    if (parseInt(otpData.value[0].code) === parseInt(otp.value)) {
      console.log('OTP Verified Successfully');
      OTPverified.value = true;
      submitImage();
      window.location.reload();
    } else {
      console.log('Invalid OTP');
    }   
  } else {
    console.error('OTP data not preloaded.');
    return;
  }
};

const fetchOTPData = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/get_otp_json');
    otpData.value = response.data.filter(result => result.account_id == accountId);
    console.log('OTP data loaded successfully:', otpData.value);
  } catch (error) {
    console.error('Error fetching OTP data:', error);
  }
};



</script>

<script>

</script>

  
<style scoped>
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
    height: 50px;
    width: auto;
     font-size: 13px;
  color: black;
  cursor: pointer;
  border-radius: 5px;
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
    margin-bottom: 9px;
}

</style>