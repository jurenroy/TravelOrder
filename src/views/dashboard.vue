<template>
   <div>
    <alerz/>
    
     <div>
        <p class="travel" >Travel Order</p>
        <button class="add" @click="toggleForm">{{ isVisible ? 'Close form' : 'Add form' }}</button>
     </div>   
     
     <div style="display: flex; justify-content: center;" v-if="isVisible">
        <formzz ></formzz>
     </div>
  
   </div>
  </template>
  
  <script setup>
  import alerz from '../components/heder.vue'
  import formzz from './form.vue';
  </script>
  
  <script>
  import { ref } from 'vue';
  
  const isVisible = ref(false);
  
  const toggleForm = () => {
    isVisible.value = !isVisible.value;
  };
  
  export { isVisible, toggleForm };
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
  </style>
  
  
  