<template>
   <div class="registration-container">
     <div class="registration-card">
       <h2 class="registration-title">Registration Form</h2>
 
       <div class="registration-form">
         <!-- Account Type Selection -->
         <div class="form-field">
           <label for="accountType">Account Type:</label>
           <select
             v-model="account_type"
             id="accountType"
             class="form-input"
             required
             @click="disablenames"
             @keydown.enter="regis_submit"
           >
             <option v-for="type in types" :key="type.type_id" :value="type.type_id">
               {{ type.type_name }}
             </option>
           </select>
         </div>
 
         <!-- Name Selection -->
         <div class="form-field">
           <label for="name">Name:</label>
           <select
             v-model="name"
             id="name"
             class="form-input"
             required
             :disabled="disablename"
             @keydown.enter="regis_submit"
           >
             <option v-for="name in namez" :key="name.name_id" :value="name.name_id">
               {{ name.last_name }}, {{ name.first_name }} {{ name.middle_init }}
             </option>
           </select>
         </div>
 
         <!-- Username Input -->
         <div class="form-field">
           <label for="email">Username:</label>
           <input
             type="text"
             v-model="email"
             id="email"
             class="form-input"
             required
             :class="{ 'input-error': isRed && email === '' }"
             @input="resetRed"
             @keydown.enter="regis_submit"
           />
         </div>
 
         <!-- Password Input -->
         <div class="form-field">
           <label for="password">Password:</label>
           <input
             type="password"
             v-model="password"
             id="password"
             class="form-input"
             required
             :class="{ 'input-error': isRed && password === '' }"
             @input="resetRed"
             @keydown.enter="regis_submit"
           />
         </div>
 
         <!-- Password Requirements -->
         <div class="password-requirements" v-if="!regiss">
           <div v-if="!upper">*At least one Upper Case</div>
           <div v-if="!lower">*At least one Lower Case</div>
           <div v-if="!charz">*At least 8 characters long</div>
         </div>
 
         <!-- Alerts for Validation and Loading -->
         <div v-if="isValid" class="alert-warning">Please fill out the text fields</div>
         <div v-else-if="isEmail" class="alert-error">Wrong Input: {{ valid }} {{ valid3 }}</div>
         <div v-if="loadingregis" class="loading-indicator"></div>
         <div v-else-if="pleaseWait" class="alert-success">Account Registered!!</div>
 
         <!-- Button Group -->
         <div class="button-group">
           <button class="action-button" :disabled="submit2" @click="regis_submit">Register</button>
         </div>
       </div>
     </div>
   </div>
 </template>
 
 <script setup>
 import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';
 import axios from 'axios';
 import CryptoJS from 'crypto-js';
 import { API_BASE_URL } from '../config';
 
 const props = defineProps({
   show: {
     type: Boolean,
     required: true,
   },
 });
 
 const emit = defineEmits();
 const account_type = ref('');
 const name = ref('');
 const email = ref('');
 const password = ref('');
 const types = ref([]);
 const namez = ref([]);
 const loadingregis = ref(false);
 const pleaseWait = ref(false);
 const isValid = ref(false);
 const isEmail = ref(false);
 const valid = ref('');
 const valid3 = ref('');
 const disablename = ref(true);
 const isRed = ref(false);
 const regiss = ref(false);
 
 const handleBack = () => {
   emit('handleBack', false);
 };
 
 const fetchData = async () => {
   try {
     const [namesResponse, typesResponse] = await Promise.all([
       fetch(`${API_BASE_URL}/get_names_json/`),
       fetch(`${API_BASE_URL}/get_type_json/`),
     ]);
 
     namez.value = await namesResponse.json();
     types.value = await typesResponse.json();
   } catch (error) {
     console.error('Error fetching data:', error);
   }
 };
 
 onMounted(fetchData);
 
 watch(account_type, (newVal) => {
   // Logic to update namez based on account_type
 });
 
 const regis_submit = async () => {
   const passvalid = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{8,}$/;
 
   if (!account_type.value || !name.value || !email.value || !password.value) {
     isRed.value = true;
     isValid.value = true;
     setTimeout(() => {
       isValid.value = false;
     }, 3000);
     return;
   }
 
   if (passvalid.test(password.value) === false) {
     isRed.value = true;
     isEmail.value = true;
     valid.value = 'Password';
     setTimeout(() => {
       isEmail.value = false;
     }, 3000);
     return;
   }
 
   loadingregis.value = true;
   const encryptedPassword = CryptoJS.AES.encrypt(password.value, 'jUr3ñr0yR@br4g@n').toString();
   const formData = {
     type_id: account_type.value,
     name_id: name.value,
     email: email.value,
     password: encryptedPassword,
   };
 
   try {
     const response = await axios.post(`${API_BASE_URL}/add_account/`, formData);
     if (response.status === 200) {
       pleaseWait.value = true;
       // Reset form fields
       setTimeout(() => {
         window.location.reload();
       }, 3000);
     }
   } catch (error) {
     console.error('Error submitting form:', error);
   } finally {
     loadingregis.value = false;
   }
 };
 
 const resetRed = () => {
   isRed.value = false;
 };
 
 const disablenames = () => {
   disablename.value = false;
 };
 </script>
 
 <style scoped>
 .registration-container {
   display: flex;
   justify-content: center;
   margin-top: 50px; /* Adjusted for better visibility */
 }
 
 .registration-card {
   width: 90%; /* Adjusted for better responsiveness */
   max-width: 500px;
   background: linear-gradient(80deg, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
   border: 2px solid #ccc; /* Lighter border color */
   border-radius: 15px; /* Slightly rounded corners */
   padding: 20px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Softer shadow */
   transition: border 0.3s; /* Smooth transition for border */
 }
 
 .registration-card.no-border {
   border: none; /* Remove border for mobile */
 }
 
 .registration-title {
   font-weight: bold;
   font-size: 24px; /* Slightly larger title */
   text-align: center;
   margin-bottom: 20px; /* Space below title */
 }
 
 .registration-form {
   display: flex;
   flex-direction: column; /* Stack form elements vertically */
 }
 
 .form-field {
   margin-bottom: 15px; /* Space between form fields */
 }
 
 .form-input {
   width: 100%;
   height: 40px; /* Increased height for better usability */
   border: 2px solid #ccc; /* Lighter border color */
   border-radius: 5px;
   padding: 5px; /* Padding inside inputs */
   font-size: 16px; /* Increased font size for better readability */
   transition: border-color 0.3s; /* Smooth transition for border color */
 }
 
 .form-input:focus {
   border-color: #007bff; /* Change border color on focus */
   outline: none; /* Remove default outline */
 }
 
 .input-error {
   border-color: red; /* Red border for error state */
 }
 
 .password-requirements {
   color: red;
   margin-bottom: 10px;
 }
 
 .alert-warning {
   padding: 10px;
   margin: 10px 0;
   border-radius: 10px;
   text-align: center;
   border: 1px solid #f8a837;
   background-color: #fff3cd;
 }
 
 .alert-error {
   padding: 10px;
   margin: 10px 0;
   border-radius: 10px;
   text-align: center;
   border: 1px solid #c95e58;
   background-color: #f8d7da;
 }
 
 .alert-success {
   padding: 10px;
   margin: 10px 0;
   border-radius: 10px;
   text-align: center;
   border: 1px solid #39b259;
   background-color: #d4edda;
 }
 
 .loading-indicator {
   display: flex;
   margin-top: 8px;
   position: relative;
 }
 
 .button-group {
   display: flex;
   justify-content: space-between;
   margin-top: 10px;
 }
 
 .action-button {
   border-radius: 10px;
   width: 100%;
   font-weight: bold;
   font-size: 18px; /* Adjusted font size */
   cursor: pointer;
   padding: 10px; /* Added padding for buttons */
   background-color: #000000; /* Button background color */
   color: white; /* Button text color */
   transition: background-color 0.3s; /* Smooth transition for background color */
   border: solid white 1px;
 }
 
 .action-button:hover {
   background-color: #868686; /* Darker shade on hover */
 }
 
 .loading-indicator::before {
   content: "";
   position: absolute;
   background: black;
   top: 0;
   left: 0;
   width: 0%;
   height: 4px;
   border-radius: 30px;
   animation: loading 1s ease-in-out infinite;
 }
 
 @keyframes loading {
   50% {
     width: 100%;
   }
   100% {
     width: 0;
   }
 }
 
 /* Mobile Styles */
 @media (max-width: 768px) {
   .registration-card {
     border: none; /* Remove border for mobile */
   }
 }
 </style>