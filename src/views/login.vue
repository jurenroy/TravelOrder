<template>
   <div class=zero style="display: flex; justify-content: center; margin-top: 90px;">
      <div class="first">
         <alerz></alerz>
         <div class="second">
            <p class="form">Login Form</p>

               <div class="inside">
                  <div style="display: flex; flex-direction: column;  width: 100%;">
                     <label class="n">Email:    </label>
                     <input type="email" v-model="email"  class ='inputsss'  id = 'email' required >

                     <label class="p"> Password: </label>
                     <input type="password" v-model="password" class ='inputsss'  id = 'password' required >


                  </div>
                  
               </div>
                          
               <div v-if="isValid" class="error">
                  <a class="errormsg1">
                     Warning Alert!!
                  </a>
                  <a class="errormsg">
                     Please Fill out the Text Fields
                  </a>
               </div>

               <div v-if="isEmail" class="wronge">
                  <a class="wronge1">
                     Error Alert!!
                  </a>
                  <a class="wronge2">
                     {{ error }}
                  </a>
               </div>

               <div v-else-if="pleaseWait" class="logincorrect">
                  <a class="logincorrect1">
                     Login!!
                  </a>
                  <a class="logincorrect2">
                     Please wait for a moment....
                  </a>
                 
               </div>

               <div class="buttonss">
                  <button class="button" :disabled="submitting" @click="submit">Login</button>
                 
               </div>
               
         </div>   
      </div>
   </div>
  </template>
  
  
  <script setup>
  import alerz from '../components/heder2.vue'
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

const email = ref('');
const password = ref('');
const accounts = ref([]);
const isValid = ref(false);
const isEmail = ref(false);
const pleaseWait = ref(false);
const submitting = ref (false);
const error = ref('');
const authStore = useAuthStore();

const accountIdz = localStorage.getItem('accountId');

const submit = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passvalid = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;
    const account = accounts.value.find(acc => acc.email === email.value);

    if (email.value === '' && password.value === '') {
        isValid.value = true;
        setTimeout(() => {
            isValid.value = false;
        }, 3000);
    } else if (email.value === '') {
        error.value = 'Input Email';
        isValid.value = true;
        setTimeout(() => {
            isValid.value = false;
        }, 3000);
    } else if (emailPattern.test(email.value) === false) {
        error.value = 'Not Valid Email';
        isEmail.value = true;
        setTimeout(() => {
            isEmail.value = false;
        }, 3000);
    } else if (!account) {
        error.value = 'Email not Found';
        isEmail.value = true;
        setTimeout(() => {
            isEmail.value = false;
        }, 3000);
    } else if (password.value === '') {
        isValid.value = true;
        setTimeout(() => {
            isValid.value = false;
        }, 3000);
    } else if (passvalid.test(password.value) === false) {
        error.value = 'Invalid Password Format';
        isEmail.value = true;
        setTimeout(() => {
            isEmail.value = false;
        }, 3000);
    } else if (account.password !== password.value) {
        error.value = 'Wrong Password';
        isEmail.value = true;
        setTimeout(() => {
            isEmail.value = false;
        }, 3000);
    } else {
        email.value = '';
        password.value = '';
        authStore.login(account.account_id);
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('accountId', account.account_id);
        submitting.value = true;
        pleaseWait.value = true;
        
        setTimeout(() => {
               window.location.reload();
               submitting.value = false; // Set submitting back to false after timeout
               }, 2000);;
    }
};

const fetchAccounts = () => {
    axios.get('http://127.0.0.1:8000/get_accounts_json')
        .then(response => {
            accounts.value = response.data;
            
        })
        .catch(error => {
            console.error('Error fetching accounts:', error);
        });
};

fetchAccounts();
</script>


<style scoped>
.first{
   width: 20%;
   min-height: 10vh;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
}
.second{
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   border-radius: 25px;
   background-color: white;
   width: 80vw; /* Set width to a percentage of the viewport width */
   max-width: 500px; /* Set a maximum width */
   height: auto; /* Let the height adjust based on content */
   padding: 20px;
   color: #212121;
   border: 2px solid black;
   box-shadow: 0px 0px 35px -2px black;
}
.second.zoomed {  
  transform: scale(2); /* Zoom in by a factor of 2 */
}

.form{
   font-weight:bold;
   font-size: 25px;
   margin-top: -5px;
}
.inputsss
{
   font-size: 18px;
   border-radius: 5px;
   width: 90%;
   height: 30px;
}

.inputss{
   border-radius: 5px;
   font-size: 18px;
   width: 95%;
   height: 30px;
}

.n,.p,.dd,.d,.pt,
.da,.ds,.os,.ad,
.per,.al,.at,.r{
   text-align: left;
   font-weight: bold;
   font-size: 22px;
}

.inside {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.buttonss{
   display: flex; 
   position: relative;
   flex-direction: row;
   height: 40px;
   justify-content: space-around;
   margin-top: 8px;

}

.button{
   border-radius: 10px;
   width: 100%;
   font-weight: bold;
   font-size: 20px;
   cursor: pointer;
}

.error{
   width: fit-content; /* Adjust width based on content */
   justify-self: center;
   display: flex;
   flex-direction: column;
   border: 1px solid #212121;
   background-color: #f8a837;
   padding: 10px;
   margin: 10px auto;
   border-radius: 10px;
   box-shadow: 0px 0px 35px -2px #f8a837;
}

.logincorrect{
   top:0;
   left:0;
   width: fit-content; /* Adjust width based on content */
   justify-self: center;
   display: flex;
   flex-direction: column;
   border: 1px solid #212121;
   background-color: #39b259;
   padding: 10px;
   margin: 10px auto;
   border-radius: 10px;
   box-shadow: 0px 0px 35px -2px #39b259;
}

.errormsg1{
   height: 20px;
   width: 100%;
   text-align: center;
   color:black;
   
}

.errormsg,.wronge2{
   height: 20px;
   width: 100%;
   text-align: center;
}

.wronge{
   width: fit-content; /* Adjust width based on content */
   justify-self: center;
   display: flex;
   flex-direction: column;
   border: 1px solid #212121;
   background-color: #c95e58;
   padding: 10px;
   margin: 10px auto;
   border-radius: 10px;
   box-shadow: 0px 0px 35px -2px #c95e58;
}

.wronge1{
   height: 20px;
   width: 100%;
   text-align: center;
   color:white;
   
}
.wronge2,.logincorrect1,.logincorrect2{
   color: white;
}



@media (max-width: 768px) {
  .first{
   margin-top: -320px;
   height: 130vh;
  }
   .inside {
    flex-direction: column;
   }
  .inputss{
      border-radius: 5px;
      width: 90%;
      height: 30px;
   }

.zero{
   top:-3000px   
}
}

</style>
  
  
  