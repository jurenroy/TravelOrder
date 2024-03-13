<template>
  <div class=update1 style="display: flex; justify-content: center; margin-top: 90px;">
     <div class="update2">
        <div class="update3">
           <p class="updateform">{{ name.first_name }} {{ name.middle_init }} {{ name.last_name }}</p>

              <div class="updateinside">
                 <div style="display: flex; flex-direction: column;  width: 100%;">
                    <label class="updatelabel old">Old Email:</label>
                    <input type="email" v-model="email"  class ='updateinput'  id = 'email' required readonly>
                    <label class="updatelabel old">Enter Old Password: </label>
                    <input type="password" v-model="password" class ='updateinput'  id = 'password' required >
             
                    <label class="updatelabel new">Enter Email: </label>
                    <input type="email" class ='updateinput'  id = 'password' required >
                    <label class="updatelabel new">Enter Password: </label>
                    <input type="password" class ='updateinput'  id = 'password' required >
                    <signature/>
                 </div>
                 
              </div>

              <div class="buttonss">
                <button class="button yes" @click="updatebutss">Update</button>
                   <button class="button no" @click="cli">Back</button>
                
              </div>
              
        </div>   
     </div>
  </div>
 </template>


<script setup>
 import { ref } from 'vue';
 import { useAuthStore } from '../store/auth';
 import signature from '@/components/signature.vue';
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
import { Usernames, showEdit, } from '@/components/heder.vue'; 
import { isEdits, isRegistrationClicked,isVisible } from '@/views/dashboard.vue';
   export default {
     
      methods: {
      cli() {
         showEdit.value = false;
         isEdits.value = false
         Usernames.value = true
         isRegistrationClicked.value = false;
          isVisible.value=false
      },
      
    }
  }
</script>

<style>

.update2{
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
.update3{
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   border-radius: 25px;
   background-color: white;
   width: 400px; /* Set width to a percentage of the viewport width */
   max-width: 500px; /* Set a maximum width */
   height: auto; /* Let the height adjust based on content */
   padding: 20px;
   color: #212121;
   border: 2px solid black;
   box-shadow: 0px 0px 35px -2px black;
}
.update3.zoomed {  
  transform: scale(2); /* Zoom in by a factor of 2 */
}
.updateform{
   font-weight:bold;
    font-size: 25px;
    margin-top: 20px;
}
.updateinside {
  display: flex;
  width: 300px;
  flex-direction: row;
  justify-content: space-around;
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

 .updateinput
{
   font-size: 18px;
   border-radius: 5px;
   width: 96%;
   height: 30px;
   margin-bottom: 12px;
}

.updatelabel{
  font-weight:bold;
    font-size: 18px;
    text-align: left;
}

@media (max-width: 768px) {

   .updateinside {
    flex-direction: column;
   }
.update1{
    top:-3000px   
 }}


</style>