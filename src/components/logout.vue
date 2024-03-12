<template>
  <div class=zero23 style="display: flex; justify-content: center;" >
      <div class="first21">
         <div class="second21">
            <p class="logoutform">Are you sure you want to logout?</p>
               <div class="buttonss">
                   <button class="button yes" >Yes</button>
                   <button class="button no" @click="noButton">No</button>
               </div>
         </div>   
      </div>

   </div>
</template>

<script setup>
import { noButton, isButssClicked } from '@/views/dashboard.vue';
</script>

<script>
   export default {
      noButton () {
         isButssClicked.value = false;
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
   /* background-color: black; */
   backdrop-filter: blur(10px);
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
    width: 100%;
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