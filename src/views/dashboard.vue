<template>
   <div>
      <div>
    <alerz/>
      <div v-if="!isRegistrationClicked">
         <div>
            <p class="travel" >Travel Order</p>
            <button class="add" @click="toggleForm">{{ isVisible ? 'Close form' : 'Add form' }}</button>
            <button v-show="!isVisible" class="reg" @click="toggleRegistration">{{ 'Registration' }}</button>
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

   </div>

      <div class="logssss" v-if="isButssClicked">
         <logsss></logsss>
      </div>     
  
   </div>
  </template>


  <script setup>
  import alerz from '../components/heder.vue'
  import formzz from './form.vue';
  import tablez from './table.vue';
  import yow from './regis.vue';
  import logsss from '../components/logout.vue'
  </script>
  
  <script>
  import { ref } from 'vue';
 const isVisible = ref(false);
const isRegistrationClicked = ref(false);
const isButssClicked = ref (false);


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
}

//makita ang logout
const logButton = () =>{
   isButssClicked.value = true;
}

const noButton = () => {
   isButssClicked.value = false;
}

export { isVisible,  isRegistrationClicked, isButssClicked, noButton, toggleForm, toggleRegistration,  backButton, logButton, };
  </script>
  
  
  <style scoped>
  .travel{
     font-weight: bold;
     font-size: 40px;
     margin-top: 90px;
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
  </style>
  
  
  