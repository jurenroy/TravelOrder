<template>
   <div>
      <div>
         <alerz v-if="showHeader1"/>
         <alerz1 v-if="showHeader2"/>
         
         <div class="sig">
            <signature v-if="acc.signature === null"/>
            <div v-else>
               <div v-if="!isRegistrationClicked">
                  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                     <div>
                     <p class="travel" >Travel Order</p>
                     </div>
                     <div>
                        <button class="add" @click="toggleForm">{{ isVisible ? 'Close form' : 'Add form' }}</button>
                        <button v-show="!isVisible" class="reg" @click="toggleRegistration">{{ 'Registration' }}</button>
                      </div>
                  </div>   
                  
                  <div style="display: flex; justify-content: center;" v-if="isVisible" >
                     <formzz ></formzz>
                  </div>
                  <div style="display: flex; justify-content: center;" v-if="!isVisible">
                     <tablez></tablez>
                  </div>
               </div>

               <div style="flex-direction: column; justify-content: center;" v-if="isRegistrationClicked">
                  <yow></yow>
               </div>

               <div style="flex-direction: column; justify-content: center;" v-if="isEdits">
                  <editzz></editzz>
               </div>

            </div>
         </div>
         <div class="logssss" v-if="isButssClicked">
            <logsss></logsss>
         </div>     
      </div>
   </div>
</template>


  <script setup>
  import alerz from '../components/heder.vue'
  import signature from '../components/signature.vue'
  import alerz1 from '../components/heder2.vue'
  import formzz from './form.vue';
  import tablez from './table.vue';
  import yow from './regis.vue';
  import logsss from '../components/logout.vue'
  import editzz from '../views/editpage.vue'
  </script>
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  const acc = ref ([]);
const accountId = localStorage.getItem('accountId');
 const isVisible = ref(false);
const isRegistrationClicked = ref(false);
const isButssClicked = ref (false);
const isEdits = ref (false)

//header
const showHeader1 = ref (true)
const showHeader2 = ref (false)


// visible sa  Add form
const toggleForm = () => {
    isVisible.value = !isVisible.value;
  };

// makita ang registration
const toggleRegistration = () => {
  isRegistrationClicked.value = true;
};

//ma back ang registration
const backButton = () =>{
   isRegistrationClicked.value = false;
   isVisible.value = false;
};

//makita ang logout
const logButton = () =>{
   isButssClicked.value = true;
};

const noButton = () => {
   isButssClicked.value = false;
   showHeader1.value = true;
   showHeader2.value = false
};

const showEditss = () => {
   isEdits.value = true
}

const fetchAccounts= async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/get_accounts_json/');
        // Filter the fetched OTP data based on the accountId
        acc.value = response.data.find(result => result.account_id == accountId);
        console.log('OTP data loaded successfully:', acc.value);
    } catch (error) {
        console.error('Error fetching OTP data:', error);
    }
};

fetchAccounts()




export { isVisible,  isRegistrationClicked, isButssClicked,showHeader1,showHeader2 ,isEdits , noButton, toggleForm, toggleRegistration,  backButton, logButton, showEditss};
  </script>
  
  
  <style scoped>
  .travel{
     font-weight: bold;
     font-size: 40px;
     margin-top: 10px;
  }
  .add{
      margin-top:-19px;
      margin-bottom:13px ;
      height: auto;
      width: 150px;
      padding:5px;
      border-radius: 10px;
      font-size: 20px;
      font-weight: bold;
      box-shadow: 7px 7px 12px black;
      cursor: pointer;
  }
  .back{
      margin-top:-19px;
      margin-top:13px ;
      height: auto;
      width: 95px;
      padding:5px;
      border-radius: 10px;
      font-size: 20px;
      font-weight: bold;
      /* box-shadow: 7px 7px 12px black; */
      cursor: pointer;
  }
  .reg{
      margin-top:-19px;
      margin-bottom:13px ;
      margin-left: 20px;
      height: auto;
      width: 150px;
      padding:5px;
      border-radius: 10px;
      font-size: 20px;
      font-weight: bold;
      box-shadow: 7px 7px 12px black;
      cursor: pointer;
  }
  .logssss{
   flex-direction: column; 
   justify-content: center;
   /* align-items: center; */
   top: 0px;
   width: auto
  }
  .sig{
   margin-top: 80px;
 
  }
  </style>
  
  
  