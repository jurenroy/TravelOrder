<template>
   <div class="zero">
     <div class="first">
       <div class="second">
         <div class="message-cont">
            <div class="empty-field-cont" >
               <div class="error" v-if="isValid">
                  <div >
                     <img class="warn-icon" src="./../assets//warning-icon.webp">
                  </div>
                  <div>
                     <a class="errormsg1"> Warning! Please Fill out all fields</a>
                  </div>
               </div>
            </div>
               
            <div class="wrong-email-cont">
               <div class="wronge" v-if="isEmail">
                  <div >
                     <img class="warn-icon" src="./../assets//warning-icon.webp">
                  </div>
                  <div>
                     <a class="wronge1"> Error Alert! </a>
                     <a class="wronge2">
                        {{ error }}
                     </a>
                  </div>
               </div>

               <div class="logincorrect" v-else-if="pleaseWait">
                  <div>
                     <img class="warn-icon success" src="./../assets//success.gif">
                  </div>
                  <div>
                     <a class="logincorrect1">Success!</a>
                  </div>
               </div>
            </div>
         </div>
         
         
        
         <img class="logo-pinas" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Bagong_Pilipinas_logo.png"></img>
         
         <div class="inside">
           <div class="box">
             <TextField
             :imgSrc="emailIcon"
             label="Username"
             type="text"
             v-model="email"
             id="email"
             required
             @enter="login_submit"
             @input="resetRed"
             :hasError="isRed && email === ''"
             placeholder="Email"
             />
             <TextField
               :imgSrc="passwordIcon"
               label="Password"
               type="password"
               v-model="password"
               id="password"
               required
               @enter="login_submit"
               @input="resetRed"
               :hasError="isRed && password === ''"
               placeholder="Password"
 
             />
           </div>
         </div>
 

 
         <div class="buttonss">
           <CustomButton label="LOGIN" :disabled="isSubmitting" @click="login_submit"></CustomButton>
         </div>
       </div>
       <div class="image-cont"></div>
     </div>
   </div>
 </template>
 
 <script setup>
 import { ref } from "vue";
 import axios from "axios";
 import { useAuthStore } from "../store/auth";
 import CryptoJS from "crypto-js";
 import TextField from "./../components/TextField.vue";
 import CustomButton from './../components/CustomButton.vue'
 import emailIcon from '@/assets/email.png';
 import passwordIcon from '@/assets/password.png';
 
 
 const email = ref("");
 const password = ref("");
 const accounts = ref([]);
 const employees = ref([]);
 const isValid = ref(false);
 const isEmail = ref(false);
 const pleaseWait = ref(false);
 const submitting = ref(false);
 const first = ref(true);
 const error = ref("");
 const authStore = useAuthStore();
 const decryptedPassword = ref("");
 const empi = ref("");
 
 const isRed = ref(false);
 
 const accountIdz = localStorage.getItem("accountId");
 
 const resetRed = () => {
   isRed.value = false;
 };
 
 const login_submit = () => {
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passvalid = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;
    const account = accounts.value.find(acc => acc.email === email.value);
    if (account) {
       empi.value = employees.value.find(emp => emp.name_id === account.name_id).isActive;
       decryptedPassword.value = CryptoJS.AES.decrypt(account.password, 'jUr3ñr0yR@br4g@n').toString(CryptoJS.enc.Utf8);
    }
 
 
    isRed.value = true
 
    if (email.value === '' && password.value === '') {
       isValid.value = true;
       isRed.value = true
       setTimeout(() => {
          isValid.value = false;
       }, 2000);
    } else if (email.value === '') {
       error.value = 'Input Email';
       isValid.value = true;
       isRed.value = true
       setTimeout(() => {
          isValid.value = false;
       }, 2000);
    // } else if (emailPattern.test(email.value) === false) {
    //    error.value = 'Not Valid Email';
    //    isEmail.value = true;
    //    isRed.value = true
    //    setTimeout(() => {
    //       isEmail.value = false;
    //    }, 2000);
    } else if (!account) {
       error.value = 'Email not Found';
       isEmail.value = true;
       isRed.value = true
       setTimeout(() => {
          isEmail.value = false;
       }, 2000);
    } else if (password.value === '') {
       isValid.value = true;
       isRed.value = true
       setTimeout(() => {
          isValid.value = false;
       }, 2000);
    } else if (passvalid.test(password.value) === false) {
       error.value = 'Invalid Password Format';
       isEmail.value = true;
       isRed.value = true
       setTimeout(() => {
          isEmail.value = false;
       }, 2000);
    } else if (decryptedPassword.value !== password.value) {
       if (first.value) {
          first.value = false
          login_submit();
       } else {
          error.value = 'Wrong Password';
       }
       isEmail.value = true;
       isRed.value = true
       setTimeout(() => {
          isEmail.value = false;
       }, 2000);
    } else if (empi.value == 'out') {
       error.value = 'Account inactive';
       isEmail.value = true;
       isRed.value = true
       setTimeout(() => {
          isEmail.value = false;
       }, 2000);
    } else {
       email.value = '';
       password.value = '';
       authStore.login(account.account_id);
       localStorage.setItem('isLoggedIn', true);
       localStorage.setItem('accountId', account.account_id);
       submitting.value = true;
       isRed.value = false
       pleaseWait.value = true;
 
       setTimeout(() => {
          window.location.reload();
       }, 2000);;
    }
 };
 
 const fetchAccounts = () => {
   axios
     .get("http://172.21.96.1:8000/get_accounts_json")
     .then((response) => {
       accounts.value = response.data;
       axios
         .get("http://172.21.96.1:8000/get_employees_json")
         .then((response) => {
           employees.value = response.data;
         });
     })
     .catch((error) => {
       console.error("Error fetching accounts:", error);
     });
 };
 
 fetchAccounts();
 
 const emil = () => {
   return this.email !== "";
 };
 
 const pas = () => {
   return this.password !== "";
 };
 
 
 </script>
 
 <!-- IMPORTING STYLES -->
 <script>
 import "./../styles/login.css";
 
 export default {
   name: "Login",
 };
 </script>
 