<template>
   <div class=zero style="display: flex; justify-content: center; margin-top: 250px;">

      <div class="first">
         <div style="z-index: 999;" v-if="regis_logout">
            <logout></logout>
         </div>
         <div class="second">

            <p class="form">Registration Form</p>

            <div class="inside">
               <div style="display: flex; flex-direction: column;  width: 100%;">
                  <label class="n">Account Type:</label>

                  <select v-model="account_type" class='regsinput' id='namein'
                     style="height: 35px; border: 2px solid black; width: 93%;" required @click="disablenames"
                     @keydown.enter='regis_submit'>
                     <option v-for="type in types" :key="type.type_id" :value="type.type_id">{{ type.type_name }}
                     </option>
                  </select>

                  <label class="p"> Name:</label>
                  <select v-model="name" class='regsinput' id='namein'
                     style="height: 35px; border: 2px solid black; width: 93%;" required :disabled='disablename'
                     @keydown.enter='regis_submit'>
                     <option v-for="name in namez" :key="name.name_id" :value="name.name_id">{{ name.last_name }}, {{
            name.first_name }} {{ name.middle_init }}</option>
                  </select>

                  <label class="n">Username:</label>
                  <input type="text" v-model="email" class='regsinput' id='email' required
                     :class="{ 'red-border': isRed && email === '' }" @input="resetRed" @keydown.enter='regis_submit'>

                  <label class="p"> Password: </label>
                  <input type="password" v-model="password" class='regsinput' id='password' required
                     :class="{ 'red-border': isRed && password === '' }" @input="resetRed"
                     @keydown.enter='regis_submit'>

                  <div style=" color: red;">
                     <div v-if="!upper && !regiss">*At least one Upper Case</div>
                     <div v-if="!lower && !regiss">*At least one Lower Case</div>
                     <div v-if="!charz && !regiss">*At least 8 characters long</div>
                  </div>

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

            <div v-else-if="isEmail" class="wronge">
               <a class="wronge1">
                  Error Alert!!
               </a>
               <a class="wronge2">
                  Wrong Input {{ valid }}
               </a>
               <a class="wronge2" v-if='valid3 !== ""'>
                  {{ valid3 }}
               </a>
            </div>

            <div v-if="loadingregis" class="loadid">
               <div class="loader"></div>

            </div>

            <div v-else-if="pleaseWait" class="correct">
               <a class="correct1">
                  Account Registered!!
               </a>

            </div>

            <div class="buttonss">
               <button class="button re" :disabled="submit2" @click="regis_submit">Register</button>
               <button class="button bax" :disabled="submit2" @click="backButton">Back</button>
               

            </div>

         </div>
      </div>
   </div>
</template>

<script setup>
import { isRegistrationClicked, isVisible, backButton } from './dashboard.vue';
import {  isregisclick} from './leaveform.vue';
import { showEdit } from '@/components/heder.vue';
import logout from '@/components/logout.vue';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { showleavehome } from './leaveform.vue';

</script>

<script>
export const regis_logout = false;
const routers = localStorage.getItem('routerz')
export default {


   backButton() {
      isRegistrationClicked.value = false;
      isVisible.value = false;
      showEdit.value = false
  isregisclick.value = false;

   },


   data() {
      return {
        
         isRed: false,
         types: [],
         names: {},
         namez: [],
         employees: [],
         name: '',
         account_type: '',
         email: '',
         password: '',
         submit2: false,
         isValid: false,
         isEmail: false,
         pleaseWait: false,
         valid: '',
         valid3: '',
         disablename: true,
         lods: false,
         regiss: false,
         loadingregis: false,
         encryptedPassword: '',

      };
   },
   computed: {
      upper() { return /[A-Z]/.test(this.password) },
      lower() { return /[a-z]/.test(this.password) },
      num() { return /\d/.test(this.password) },
      charz() { return this.password.length >= 8 },
   },
   mounted() {
      this.fetchData();
   },
   watch: {
      account_type(newVal) {
         if (newVal === 3) {
            const employeeNameIds = this.employee.map(employees => employees.name_id);
            this.namez = this.names.filter(name => employeeNameIds.includes(name.name_id));
         } else {
            this.namez = this.names
         }
      }
   },
   methods: {
      emai() {
         return this.email !== ''
      },
      pasw() {
         return this.password !== ''
      },
      resetRed() {
         this.isRed = false; 
      },
      disablenames() {
         this.disablename = false;
      },
      resetRed() {
         this.isRed = false; 
      },

      regis_submit() {

         // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         const passvalid = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;

         if (this.email === '' && this.password === '' && this.account_type === '' && this.name === '') {
            this.isRed = true
            this.loadingregis = false;
            this.isValid = true;
            setTimeout(() => {
               this.isValid = false;
            }, 3000);



         } else if (this.account_type === '') {
            this.isRed = true
            this.loadingregis = false;
            this.isValid = true;
            setTimeout(() => {
               this.isValid = false;
            }, 3000);

         } else if (this.name === '') {
            this.isRed = true
            this.loadingregis = false;
            this.isValid = true;
            setTimeout(() => {
               this.isValid = false;
            }, 3000);

         } else if (this.email === '') {
            this.isRed = true
            this.loadingregis = false;
            this.isValid = true;
            setTimeout(() => {
               this.isValid = false;
            }, 3000);

         // } else if (emailPattern.test(this.email) === false) {
         //    this.isRed = true
         //    this.loadingregis = false;
         //    this.isEmail = true;
         //    this.valid = 'Email'; 
         //    this.valid3 = '';
         //    setTimeout(() => {
         //       this.isEmail = false; 
         //    }, 3000);

         } else if (this.password === '') {
            this.isRed = true
            this.loadingregis = false;
            this.isValid = true;
            setTimeout(() => {
               this.isValid = false;
            }, 3000);

         } else if (passvalid.test(this.password) === false) {
            this.isRed = true
            this.loadingregis = false;
            this.isEmail = true;
            this.valid = 'Password';
            setTimeout(() => {
               this.isEmail = false;
               this.lods = true
            }, 3000);
         } else {
            this.loadingregis = true;
            this.submit2 = true;
            this.encryptedPassword = CryptoJS.AES.encrypt(this.password, 'jUr3ñr0yR@br4g@n').toString();
            setTimeout(() => {
               const formData = {
                  type_id: '' + this.account_type,
                  name_id: '' + this.name,
                  email: '' + this.email,
                  password: '' + this.encryptedPassword

               };


               axios.post('http://172.21.96.1:8000/add_account/', formData)
                  .then(response => {
                     if (response.status === 200) {
                        this.loadingregis = false;

                        this.pleaseWait = true;
                        this.account_type = '';
                        this.name = '';
                        this.email = '';
                        this.password = '';
                        this.regiss = true;

                        setTimeout(() => {
                           window.location.reload();

                           this.submit2 = false;
                        }, 3000);

                     } else {
                        throw new Error('Failed to submit form');
                     }
                  })
                  .catch(error => {
                     console.error('Error submitting form:', error);
                     this.submit2 = false;
                  });
            }, 2000);
         }


      },
      fetchData() {
         fetch('http://172.21.96.1:8000/get_names_json/')
            .then(response => response.json())
            .then(data => {
               this.names = data;
            })
            .catch(error => {
               console.error('Error fetching names:', error);
            });

         fetch('http://172.21.96.1:8000/get_type_json/')
            .then(response => response.json())
            .then(data => {
               this.types = data;
            })
            .catch(error => {
               console.error('Error fetching employees:', error);
            });

         fetch('http://172.21.96.1:8000/get_employees_json/')
            .then(response => response.json())
            .then(data => {
               this.employee = data.filter(emp => emp.chief > 0)
            })
            .catch(error => {
               console.error('Error fetching employees:', error);
            });
      },


   },
};


</script>


<style scoped>
.loadid {
   display: flex;
   position: relative;
   margin-top: 8px;
}

.loader {
   display: flex;
   --height-of-loader: 4px;
   --loader-color: black;
   width: 210px;
   height: 4px;
   border-radius: 30px;
   background-color: rgba(0, 0, 0, 0.2);
   position: relative;
   margin-top: 10px;
   left: -10px;
}

.loader::before {
   content: "";
   position: absolute;
   background: var(--loader-color);
   top: 0;
   left: 0;
   width: 0%;
   height: 100%;
   border-radius: 30px;
   animation: moving 1s ease-in-out infinite;
   ;
}


@keyframes moving {
   50% {
      width: 100%;
   }

   100% {
      width: 0;
      right: 0;
      left: unset;
   }
}

.red-border {
   border: 2px solid red;
}

.first {
   width: 20%;
   min-height: 10vh;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
}

.second {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   border-radius: 25px;
   background-color: white;
   width: 80vw;
   max-width: 500px;
   height: auto;
   padding: 20px;
   color: #212121;
   border: 2px solid black;
   box-shadow: 0px 0px 4px black, 0px 0px 3px black inset;
}

.second.zoomed {
   transform: scale(2);
}

.form {
   font-weight: bold;
   font-size: 25px;
   margin-top: -5px;
}

.regsinput {
   font-size: 18px;
   border-radius: 5px;
   width: 90%;
   height: 30px;
}

.inputss {
   border-radius: 5px;
   font-size: 18px;
   width: 95%;
   height: 30px;
}

.n,
.p,
.dd,
.d,
.pt,
.da,
.ds,
.os,
.ad,
.per,
.al,
.at,
.r {
   text-align: left;
   font-weight: bold;
   font-size: 22px;
}

.inside {
   display: flex;
   flex-direction: row;
   justify-content: space-around;

}

.buttonss {
   display: flex;
   position: relative;
   flex-direction: row;
   height: 40px;
   justify-content: space-between;
   margin-top: 8px;

}

.button {
   border-radius: 10px;
   width: 100%;
   font-weight: bold;
   font-size: 20px;
   cursor: pointer;
}

.re {
   margin-left: -20px;
}

.bax {
   margin-left: 50px;
}



.error {
   top: 0;
   left: 0;
   width: fit-content;
   justify-self: center;
   display: flex;
   flex-direction: column;
   border: 1px solid #f8a837;
   padding: 10px;
   margin: 10px auto;
   border-radius: 10px;
   box-shadow: 0px 0px 4px #f8a837, 0px 0px 3px #f8a837 inset;
}

.correct {
   top: 0;
   left: 0;
   width: fit-content;
   justify-self: center;
   display: flex;
   flex-direction: column;
   border: 1px solid #39b259;
   padding: 10px;
   margin: 10px auto;
   border-radius: 10px;
   box-shadow: 0px 0px 4px #39b259, 0px 0px 3px #39b259 inset;
}

.errormsg1 {
   height: 20px;
   width: 100%;
   text-align: center;
   color: black;

}

.errormsg,
.wronge2,
.correct2 {
   height: 20px;
   width: 100%;
   text-align: center;
   color: black;
}



.wronge {
   top: 0;
   left: 0;
   width: fit-content;
   justify-self: center;
   display: flex;
   flex-direction: column;
   border: 1px solid #c95e58;
   padding: 10px;
   margin: 10px auto;
   border-radius: 10px;
   box-shadow: 0px 0px 4px #c95e58, 0px 0px 3px #c95e58 inset;
}

.wronge1 {
   height: 20px;
   width: 100%;
   text-align: center;
   color: black;
   font-weight: bold;

}

.wronge2,
.correct1,
.correct2 {
   color: black;
   font-weight: bold;
}

@media (max-width: 768px) {
   .first {
      margin-top: -320px;
      height: 130vh;
   }

   .inside {
      flex-direction: column;
   }

   .inputss {
      border-radius: 5px;
      width: 90%;
      height: 30px;
   }

   .zero {
      top: -3000px
   }
}
</style>