<template>
   <div class="title">
       <div class="navigationz">
           <p class="headerzz">Special Order</p>
       </div>
   </div>
   <tablez class="tablex" v-if="!isVisible"/>
   <addforms class="formz" v-if="isVisible"/>
 </template>
 
 
 <script setup>
 import tablez from './table.vue';
 </script>
 
 <script>
 import { ref } from 'vue';
 const isVisible = ref(false);
 
 // visible sa  Add form
 const toggleForm = () => {
   isVisible.value = !isVisible.value;
 };
 </script>
 
 
 <style>
 
 </style>