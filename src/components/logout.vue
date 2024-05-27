<template>
   <div class=zerologout style="display: flex; justify-content: center; z-index: 999;">
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
import { noButton, isButssClicked, showHeader1, showHeader2 } from '@/views/dashboard.vue';
import { showEdit } from './heder.vue';
import { regis_logout } from '@/views/regis.vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const router = useRouter();


const authStore = useAuthStore();

const accountIdz = localStorage.getItem('accountId');


const logout = () => {
   authStore.logout();
   localStorage.setItem('isLoggedIn', 'false');
   localStorage.removeItem('accountId');
   router.push("/")
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
.firstlogout {
   top: 0px;
   position: absolute;
   width: 100%;
   height: 103vh;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   backdrop-filter: blur(10px);
}

.secondlogout {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   border-radius: 25px;
   background-color: white;
   width: 75w;
   max-width: 500px;
   height: auto;
   padding: 20px;
   color: #212121;
   border: 2px solid black;
   box-shadow: 0px 0px 4px black, 0px 0px 3px black inset;
}

.secondlogout.zoomed {
   transform: scale(2);
}

.logoutform {
   font-weight: bold;
   font-size: 25px;
   margin-top: 20px;
}

.buttonsslogout {
   display: flex;
   position: relative;
   flex-direction: row;
   height: 40px;
   justify-content: space-between;
   margin-top: 8px;


}

.buttonlogout {
   border-radius: 10px;
   width: 100px;
   font-weight: bold;
   font-size: 20px;
   cursor: pointer;

}

.yeslogout {
   margin-left: -20px;

}

.nologout {
   margin-left: 50px;
}

@media (max-width: 768px) {
   .zerologout {
      top: -3000px
   }
}
</style>