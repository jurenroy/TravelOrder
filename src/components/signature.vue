<template>
    <div>
      <img class="uploaded-image" :src="uploadedImageUrl" alt="Uploaded Image" v-if="uploadedImageUrl">
      <input class="buttonz" type="file" accept="image/*" @change="handleFileUpload">
      <button class="submit-button" @click="sendOTP">Submit</button>
    </div>
    <div v-if="OTPsent">
      <p>OTP Sent to Email Successfully</p>
      <div>
        <label for="otpInput">Enter OTP:</label>
        <input type="text" id="otpInput" v-model="otp" @keydown.enter="verifyOTP">
        <button @click="verifyOTP">Verify OTP</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const uploadedImageUrl = ref('');
  const accountId = localStorage.getItem('accountId');
  const OTPsent = ref(false);
  const otp = ref('');
  const otpData = ref([]);
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append('signature', file);
      uploadedImageUrl.value = URL.createObjectURL(file); // Display uploaded image preview
      console.log(file)
      console.log(uploadedImageUrl.value)
    }
  };
  
  const sendOTP = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/send-otp/${accountId}`);
      OTPsent.value = true;
      await fetchOTPData();
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };
  
  const submitImage = async () => {
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    console.log(fileInput)
    console.log(file)
    try {
        const formData = new FormData();
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

  
  const verifyOTP = () => {
    if (otpData.value.length > 0) {
      if (parseInt(otpData.value[0].code) === parseInt(otp.value)) {
        console.log('OTP Verified Successfully');
        submitImage(); // Call submitImage function if OTP is verified successfully
      } else {
        console.log('Invalid OTP');
      }
    } else {
      console.error('OTP data not preloaded.');
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
  
  <style scoped>
  .buttonz {
    margin-top: 90px;
  }
  .uploaded-image {
    margin-top: 120px;
    max-width: 100%;
    height: 90px;
    width: auto;
  }
  .submit-button {
    margin-top: 20px;
  }
  </style>
  