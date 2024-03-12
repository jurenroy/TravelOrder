<template>
  <div class="una">
    <div class="imagediv1">
       <img class="ima" src="../assets/logo.png" alt="Description of the image">
       <img class="ima ims" src="../assets/republic.png" alt="Description of the image">
       <img class="ima" src="../assets/bago.png" alt="Description of the image">
    </div>

    <div class="imagediv2">
      <div>
        <text class="ima2 usew" v-if="Usernames" @click="showEdits" style="user-select: none;">{{ name.first_name }} {{ name.middle_init }} {{ name.last_name }}</text>
        <button class="ima2 editbut imagediv1 tes" v-if="showEdit" @click="backUpdate">Edit</button>
      </div>
       <button class = "ima imabut" @click="closeAndLog">Logout</button>
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

 const convert = async () => {
   name.value = name.value.toUpperCase()
 };
 
 fetchAccounts();
 fetchNames();
 convert();
 
 </script>

<script>
  import { ref } from 'vue';
import { isButssClicked , showHeader1, showHeader2, isEdits } from '../views/dashboard.vue';

 

export const showEdit = ref (false)
export const Usernames = ref (true)




export default {
  inject: ['close'],
  methods: {
    logButtonz() {
      isButssClicked.value = true;
      showHeader1.value = false;
      showHeader2.value = true
      
    },
    closeAndLog() {
      if (typeof this.close === 'function') {
        this.close(); 
      }
      this.logButtonz(); 
    },



    showEdits() {
        showEdit.value = true;
    },

    clickEdit() {
      showEdit.value = false;
      isEdits.value = true
      Usernames.value = false
    },

    backUpdate() {
      if (typeof this.close === 'function') {
        this.close(); 
      }
      this.clickEdit(); 
    },


    clickOut() {
      showEdit.value = true;
      isEdits.value = false
      Usernames.value = true
    }

    
  }, 

};
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
 
 .imagediv1{
    display: flex;
    align-items: center;
 }

 .imagediv2{
    display: flex;
    align-items: center;
    height: inherit;
 }
 .ima{
    height: 50px;
    width: 50px; 
    margin-top:-5px; 
    margin-left: 10px;
    cursor: pointer;
 }
 .ima2{
    height: 20px;
    width: 50px; 
    margin-top:-5px; 
    margin-left: 10px;
    margin-bottom: -15px;
    cursor: pointer;
 }
 .imabut,.ima,.ima2{
     margin-right: 30px;
 }
 .tes{
  justify-content: center;
  position: relative;
  top: 6px;
  left: 35px;
 }
 
 .imabut{
     border-radius:10px;
     font-size: 13px;
     width: 60px;
     height: 40px;
 }
 .editbut{
    border-radius:5px;
     font-size: 13px;
 }
 .ims{
    width: 200px; 
 }
 .usew{
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
 }
 
 @media (max-width: 768px) {
   .imabut,.ima,.ima2{
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
 
