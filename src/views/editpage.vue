<template>
  <div class=zero23 style="display: flex; justify-content: center;" >
      <div class="first21">
         <div class="second21">
            <p class="logoutform">{{ name.first_name }} {{ name.middle_init }} {{ name.last_name }}</p>
            <p>{{ email }}</p>
            <p>{{ oldPass }}</p>
            <p>{{ password }}</p>
            <p>{{ oldPass === password ? 'oldPass is equal to password' : 'oldPass is not equal to password' }}</p>
            <input placeholder="password" type="password" v-model="password">
            <div class="inside">
                  <!-- <div style="display: flex; flex-direction: column;  width: 100%;">
                     <label class="n">Email:  {{ accountIdz }}</label>
                     <input type="email" v-model="email"  class ='inputsss'  id = 'email' required >

                     <label class="p"> Password: </label>
                     <input type="password" v-model="password" class ='inputsss'  id = 'password' required >


                  </div> -->
                  
               </div>
               <div class="buttonss">
                   <button class="button yes" @click="logout">Yes</button>
                   <button class="button no" @click="cli">back</button>
               </div>
         </div>   
      </div>

   </div>
</template>


<script setup>
 import { ref } from 'vue';
 import { useAuthStore } from '../store/auth';
 import axios from 'axios';
 
 const authStore = useAuthStore();
 
 const accountIdz = localStorage.getItem('accountId');
 
 const accounts = ref([]);
 const names = ref([]);
 const name = ref('')
 const email = ref('')
 const oldPass = ref ('')
 const password = ref('')

 
 const fetchAccounts = async () => {
   try {
     const response = await axios.get('http://127.0.0.1:8000/get_accounts_json');

     accounts.value = await response.data.filter(result => result.account_id == accountIdz);
     console.log('hakdog')
     console.log(accounts.value);
     email.value = accounts.value[0].email
     oldPass.value = accounts.value[0].password
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
import { Usernames, showEdit } from '@/components/heder.vue'; 
import { isEdits } from '@/views/dashboard.vue';
   export default {
     
      methods: {
      cli() {
         showEdit.value = false;
         isEdits.value = false
         Usernames.value = true
      },
      
    }
  }
</script>

<style>

.first21{
    top: 0px;
    position:absolute;
   width:200vh;
   height: 100vh;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   background-color: white;
   /* backdrop-filter: blur(10px); */
}
.second21{
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   border-radius: 25px;
   background-color: white;
   width: 75w; /* Set width to a percentage of the viewport width */
   max-width: 500px; /* Set a maximum width */
   height: auto; /* Let the height adjust based on content */
   padding: 20px;
   color: #212121;
   border: 2px solid black;
   box-shadow: 0px 0px 35px -2px black;
}
.second21.zoomed {  
  transform: scale(2); /* Zoom in by a factor of 2 */
}
.logoutform{
   font-weight:bold;
    font-size: 25px;
    margin-top: 20px;
}
.buttonss{
    display: flex; 
    position: relative;
    flex-direction: row;
    height: 40px;
    justify-content: space-between;
    margin-top: 8px;
 
 }
 
 .button{
    border-radius: 10px;
    width: 100px;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
 }

 .yes{
   margin-left: -20px;
 }

 .no{
   margin-left: 50px;
 }

@media (max-width: 768px) {
.zero23{
    top:-3000px   
 }}


</style>