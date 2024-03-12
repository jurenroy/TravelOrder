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
  import { onMounted } from 'vue';
  
  const uploadedImageUrl = ref('');
  const accountId = localStorage.getItem('accountId');
  const OTPsent = ref(false); // Initialize OTPsent as a boolean value
    const otp = ref('');
    const OTPverified = ref(false); // Initialize OTPverified as a boolean value
  const otpData = ref([]);
  
  const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
              uploadedImageUrl.value = e.target.result;
              console.log('Uploaded image file:', file.name);
          };
          reader.readAsDataURL(file);
      }
  };

  const sendOTP = async () => {
    try {
        await axios.post(`http://127.0.0.1:8000/send-otp/${accountId}`);
        OTPsent.value = true; // Update OTPsent to true after sending OTP
        console.log('OTP Sent to Email Successfully');
        await fetchOTPData(); // Wait for fetchOTPData to complete before continuing
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
  
  // Function to convert Data URL to Blob
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
    // Check if otpData has been preloaded
    if (otpData.value.length > 0) {
        // Filter OTPs by accountId and latest created date
        console.log('wews',parseInt(otpData.value[0].code))
        console.log(otp.value)
            // Check if the entered OTP matches the latest OTP
            if (parseInt(otpData.value[0].code) === parseInt(otp.value)) {
                console.log('OTP Verified Successfully');
                OTPverified.value = true; // Update OTPverified to true after OTP verification
                submitImage(); // Call submitImage function if OTP is verified successfully
            } else {
                console.log('Invalid OTP');
                // Handle invalid OTP
            }   
    }else{
        console.error('OTP data not preloaded.');
        return;
    }
};

// Fetch OTP data function
const fetchOTPData = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/get_otp_json');
        // Filter the fetched OTP data based on the accountId
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
  