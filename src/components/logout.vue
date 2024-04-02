<template>
  <div class=zerologout style="display: flex; justify-content: center;" >
      <div class="firstlogout">
         <div class="secondlogout">
            <p class="logoutform">Are you sure you want to logout?</p>
               <div class="buttonsslogout">
                   <button class="button yeslogout" @click="logout">Yes</button>
                   <button class="button nologout" @click="noButton">No</button>
               </div>
         </div>   
      </div>

   </div>
</template>

<script setup>
import { noButton, isButssClicked,showHeader1,showHeader2 } from '@/views/dashboard.vue';
import { useAuthStore } from '../store/auth';



const authStore = useAuthStore();
 
 const accountIdz = localStorage.getItem('accountId');
 

 const logout = () => {
   authStore.logout(); // Call the logout method from your authentication store
   localStorage.setItem('isLoggedIn', 'false'); // Update the isLoggedIn key in localStorage
   localStorage.removeItem('accountId'); // Remove any other relevant data from localStorage
   window.location.reload();
 }
 

</script>

<script>

   export default {
      methods: {
    noButton() {
      isButssClicked.value = false;
      showHeader1.value = true;
      showHeader2.value = false
    },
  },
   }
</script>

<style>

.firstlogout{
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
.secondlogout{
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
   /* box-shadow: 0px 0px 35px -2px black; */
   box-shadow: 0px 0px 10px black, 0px 0px 10px black inset;
}
.secondlogout.zoomed {  
  transform: scale(2); /* Zoom in by a factor of 2 */
}
.logoutform{
   font-weight:bold;
    font-size: 25px;
    margin-top: 20px;
}
.buttonsslogout{
    display: flex; 
    position: relative;
    flex-direction: row;
    height: 40px;
    justify-content: space-between;
    margin-top: 8px;
    
 
 }
 
 .buttonlogout{
    border-radius: 10px;
    width: 100px;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
    
 }

 .yeslogout{
   margin-left: -20px;
   
 }

 .nologout{
   margin-left: 50px;
 }

@media (max-width: 768px) {
.zerologout{
    top:-3000px   
 }}


</style>