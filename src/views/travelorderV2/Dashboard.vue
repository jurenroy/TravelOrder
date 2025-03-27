<template>
    <div class="title">
        <div class="navigationz">
            <p class="headerzz">Travel Order</p>
            <button class="add-button" @click="toggleForm">{{ isVisible ? 'Close Form' : 'Add Form' }}</button>
            
        </div>
    </div>
    <tablez class="tablex" v-if="!isVisible"/>
    <addforms class="formz" v-if="isVisible"/>
    <signature class="sig" v-if="!acc.signature" />
 </template>
 
 
 <script setup>
 import signature from '../../components/signature.vue'
 import addforms from './Form.vue';
 import tablez from './Table.vue';
 import { useAuthStore } from '@/store/auth';
 const acc = useAuthStore();
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
 
 .title {
    width: 100%; /* Ensure the title takes full width */
    color: #000000;
    margin-top: 20px;
}

.navigationz {
    display: flex;
    justify-content: center; /* Space between header and button */
    align-items: center; /* Center items vertically */
    padding: 10px; /* Add some padding */
    margin-top: -40px;
    margin-bottom: -40px;
    gap: 20PX;
}

 .formz{
    display: flex;
    justify-content:center; 
    margin-top: 0px;
 }
 .add-button{
    height: 50px;
    width: 150px;
    font-size: 18px;
    font-family: 'Playfair Display', serif; /* Luxurious font */
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #ffffff;
    background: #000000; /* Deep charcoal */
    border: 2px solid ; /* Luxurious gold border */
    border-radius: 10px;
    cursor: pointer;
    outline: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease-in-out; /* Smooth transition */
    cursor: pointer;
 }
 .headerzz {

}

/* Media Query for Mobile Devices */
@media (max-width: 768px) {
    .navigationz {
        flex-direction: column; /* Stack items vertically */
        align-items: center; /* Center items */
        text-align: center; /* Center text for mobile */
    }

    .headerzz {
        margin-bottom: -20px; /* Add space below the header */
    }

    .add-button {
        width: 100%; /* Make button full width on mobile */
        margin-bottom: 20px;
    }
}

@media print{
   .title{
      display: none;
   }
}

 </style>