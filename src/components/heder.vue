<template>
  <div class="una">
    <div class="imagediv1">
       <img class="ima" src="../assets/logo.png" alt="Description of the image">
       <img class="ima ims" src="../assets/republic.png" alt="Description of the image">
       <img class="ima" src="../assets/bago.png" alt="Description of the image">
    </div>
    <div class="imagediv1">
       <text class="ima usew">{{ name.first_name }} {{ name.middle_init }} {{ name.last_name }}</text>
       <button class="ima imabut" @click="logout">Logout</button>
       <text class="ima usew">username</text>
       <button class = "ima imabut" @click="logButtonz">Logout</button>
    </div>
   </div>
 </template>
 
 <script setup>
 import { ref } from 'vue';
 import { useAuthStore } from '../store/auth';
 import { isButssClicked } from '../views/dashboard.vue';
 import axios from 'axios';
 
 const authStore = useAuthStore();
 
 const accountIdz = localStorage.getItem('accountId');
 
 const accounts = ref([]);
 const names = ref([]);
 const name = ref('')
 
 const logout = () => {
   authStore.logout(); // Call the logout method from your authentication store
   localStorage.setItem('isLoggedIn', 'false'); // Update the isLoggedIn key in localStorage
   localStorage.removeItem('accountId'); // Remove any other relevant data from localStorage
   window.location.reload();
 }
 
 const logButtonz = () => {
    isButssClicked.value = true;
   }
 
 const fetchAccounts = async () => {
   try {
     const response = await axios.get('http://127.0.0.1:8000/get_accounts_json');
     accounts.value = response.data;
     console.log(accounts.value);
   } catch (error) {
     console.error('Error fetching accounts:', error);
   }
 };
 
 const fetchNames = async () => {
   try {
     const response = await axios.get('http://127.0.0.1:8000/get_names_json');
     names.value = response.data;
     console.log(names.value);
 
     const account = accounts.value.find(acc => acc.account_id === parseInt(accountIdz));
   console.log("Found account:", account);
 
   if (account) {
     const nameId = account.name_id;
     console.log("Found nameId:", nameId);
     const foundName = names.value.find(name => name.name_id === nameId);
     if (foundName) {
       console.log("Found name:", foundName);
       name.value = foundName;
       nameLoaded.value = true; // Set the flag to true when the name is found
     } else {
       console.log("Name not found for nameId:", nameId);
     }
   } else {
     console.log("Account not found for accountId:", accountIdz);
   }
   } catch (error) {
     console.error('Error fetching names:', error);
   }
 };
 
 fetchAccounts();
 fetchNames();
 
 </script>
 
 
 <style >
 
 .una{
    background-color: white;
    display: flex; 
    height: 70px; 
    position: fixed; 
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    justify-content: space-between;
    align-items: center ;
    border-bottom: 1px solid black;
    box-shadow: 0px 0px 35px -2px black;
 }
 
 .imagediv{
    display: flex;
    align-items: center
 }
 .ima{
    height: 50px;
    width: 50px; 
    margin-top:-5px; 
    margin-left: 10px;
    margin-bottom: 0px;
    cursor: pointer
 }
 .imabut,.ima{
     margin-right: 30px;
 }
 
 .imabut{
     border-radius:10px;
     font-size: 13px;
     width: 60px;
     height: 40px;
 }
 .ims{
    width: 200px; 
 }
 
 @media (max-width: 768px) {
   .imabut,.ima{
    margin-right: 0px;
   }
   .ims{
    width: 145.9px; 
 }
 .imabut{
     border-radius:10px;
     font-size: 13px;
     width: 50px;
     height: 30px;
     margin-right: 1px;
     
 }
 .usew{
    margin-right: -1px;
 }
 
 
 }
 </style>
 