<template>
   <div>
      <div style="flex-direction: column; justify-content: center;" v-if="isEdits && isRegistrationClicked">
         <editss></editss>
      </div>
      <div style="flex-direction: column; justify-content: center;" v-if="isRegistrationClicked && !isEdits">
         <registrationform></registrationform>
      </div>
      <div>
         <alerz v-if="showHeader1" />
         <alerz1 v-if="showHeader2" />
         <div v-if="!isRegistrationClicked">
            <alerz v-if="showHeader1" />
            <alerz1 v-if="showHeader2" />
            <div class="sig">
               <signature v-if="acc.signature === null" />
               <div v-else>
                  <div v-if="!isRegistrationClicked">
                     <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <div>
                           <p class="travel">Travel Order</p>
                        </div>
                        <div>
                           <button class="add" @click="toggleForm">{{ isVisible ? 'Close form' : 'Add form' }}</button>
                           <button v-show="!isVisible && acc.type_id == 1" class="reg" @click="toggleRegistration">{{
         'Registration' }}</button>
                        </div>
                     </div>

                     <div style="display: flex; justify-content: center;" v-if="isVisible">
                        <addforms></addforms>
                     </div>
                     <div style="display: flex; justify-content: center;" v-if="!isVisible">
                        <tablez></tablez>
                     </div>
                  </div>





               </div>
            </div>
            <div class="logssss" v-if="isButssClicked">
               <logsss></logsss>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import alerz from '../components/heder.vue'
import signature from '../components/signature.vue'
import alerz1 from '../components/heder2.vue'
import addforms from './form.vue';
import tablez from './table.vue';
import registrationform from './regis.vue';
import logsss from '../components/logout.vue'
import editss from '../views/editpage.vue'
</script>

<script>
import { ref } from 'vue';
import axios from 'axios';
const accountId = localStorage.getItem('accountId');
const isVisible = ref(false);
const isRegistrationClicked = ref(false);
const isButssClicked = ref(false);
const isEdits = ref(false);
const acc = ref([]);

//header
const showHeader1 = ref(true)
const showHeader2 = ref(false)



// visible sa  Add form
const toggleForm = () => {
   isVisible.value = !isVisible.value;
};

// makita ang registration
const toggleRegistration = () => {
   isRegistrationClicked.value = true;
};

//ma back ang registration
const backButton = () => {
   isRegistrationClicked.value = false;
   isVisible.value = false;
};

//makita ang logout
const logButton = () => {
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

// Fetch OTP data function
const fetchAccounts = async () => {
   try {
      const response = await axios.get('http://172.31.10.148:8000/get_accounts_json/');
      // Filter the fetched OTP data based on the accountId
      acc.value = response.data.find(result => result.account_id == accountId);
   } catch (error) {
      console.error('Error fetching OTP data:', error);
   }
};

fetchAccounts()




export { isVisible, isRegistrationClicked, isButssClicked, showHeader1, showHeader2, isEdits, noButton, toggleForm, toggleRegistration, backButton, logButton, showEditss };
</script>


<style scoped>
.travel {
   font-weight: bold;
   font-size: 40px;
   margin-top: 10px;
}

.add {
   margin-top: -19px;
   margin-bottom: 13px;
   height: auto;
   width: 150px;
   padding: 5px;
   border-radius: 10px;
   font-size: 20px;
   font-weight: bold;
   box-shadow: 7px 7px 12px black;
   /* box-shadow: 7px 7px 12px black, 0px 0px 10px black inset; */
   cursor: pointer;
}

.back {
   margin-top: -19px;
   margin-top: 13px;
   height: auto;
   width: 95px;
   padding: 5px;
   border-radius: 10px;
   font-size: 20px;
   font-weight: bold;
   cursor: pointer;
}

.reg {
   margin-top: -19px;
   margin-bottom: 13px;
   margin-left: 20px;
   height: auto;
   width: 150px;
   padding: 5px;
   border-radius: 10px;
   font-size: 20px;
   font-weight: bold;
   box-shadow: 7px 7px 12px black;
   /* box-shadow: 7px 7px 12px black, 0px 0px 10px black inset; */
   cursor: pointer;
}

.logssss {
   flex-direction: column;
   justify-content: center;
   /* align-items: center; */
   top: 0px;
   width: auto
}

.sig {
   margin-top: 100px;

}
</style>