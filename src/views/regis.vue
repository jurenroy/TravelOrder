<template>
    <div class=zero style="display: flex; justify-content: center; margin-top: 90px;">
       <div class="first">
          <alerz></alerz>
          <div class="second">
             <p class="form">Registration Form</p>
 
                <div class="inside">
                   <div style="display: flex; flex-direction: column;  width: 100%;">
                        <label class="n">Account Type:</label>
                        <input type="type" v-model="account_type"  class ='inputsss'  id = 'account_type' required >
 
                        <label class="p"> Name: </label>
                        <input type="type" v-model="name" class ='inputsss'  id = 'name' required >

                        <label class="n">Email:</label>
                        <input type="email" v-model="email"  class ='inputsss'  id = 'email' required >
 
                        <label class="p"> Password: </label>
                        <input type="password" v-model="password" class ='inputsss'  id = 'password' required >
 
                   </div>
                   
                </div>
                           
                <div v-if="isValid"  class="error">
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
                     Wrong input Password and Username
                  </a>
               </div>
 
                <div class="buttonss">
                   <button class="button re" @click="submit">Register</button>
                   <button class="button ba" @click="cancelButton">Back</button>
                  
                </div>
                
          </div>   
       </div>
  <!-- <footer style="background-color: lightgray; padding: 5px; text-align: center; height: 15px; ">
         <p style="margin-top: -5px">Team Kokkak</p>
       </footer> -->
    </div>
   </template>
   
   <script setup>
   import alerz from '../components/heder2.vue'
   import { isRegistrationClicked, isVisible, cancelButton } from './dashboard.vue';
 
   </script>
   
   <script>
   
    export default {
      // props:{
      //    isRegistrationClicked:Boolean,
      //    isVisible:Boolean
      // },

      cancelButton () {
         isRegistrationClicked.value = false;
         isVisible.value = false;
      },

    data() {
       return {
        email: '',
        password: '',
         
        isValid: false,
        isEmail:false,
 
       };
    },
    methods: {
      

      submit() {
       const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       const passvalid = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;
 
       if (this.email === '' && this.password === ''&& this.account_type === ''&& this.name === '') {
 
          console.log('wlay sulod');
          this.isValid = true; 
          setTimeout(() => {
          this.isValid = false; 
       }, 3000);
 
        

        } else if (this.account_type === '') {
          console.log('wlay sulod ang imong account type');
          this.isValid = true; 
          setTimeout(() => {
          this.isValid = false; 
       }, 3000);

        } else if (this.name === '') {
          console.log('wlay sulod ang imong name');
          this.isValid = true; 
          setTimeout(() => {
          this.isValid = false; 
       }, 3000);
       
       } else if (this.email === '') {
            console.log('wlay sulod ang imong email');
            this.isValid = true; 
            setTimeout(() => {
            this.isValid = false; 
        }, 3000);

      } else if (emailPattern.test(this.email) === false) {
         console.log('mali ang imong email')
         this.isEmail = true; // Set isEmail to true to show the error message
         setTimeout(() => {
         this.isEmail = false; // Reset isValid to false after 3 seconds
      }, 3000);
 
       }else if (this.password === '') {
          console.log('wlay sulod ang imong password')
          this.isValid = true; 
          setTimeout(() => {
          this.isValid = false; 
       }, 3000);
       
       } else if (passvalid.test(this.password) === false) {
          console.log('mali ang imong password')
          this.isEmail = true; 
          setTimeout(() => {
          this.isEmail = false; 
       }, 3000);
       } else {
         console.log("account type: ", this.account_type)
         console.log("name: ",this.name)
          console.log("email: ",this.email);
          console.log("password: ",this.password);

          this.account_type=''
          this.name=''
          this.email=''
          this.password=""
         
       }
 
 }
    },
  };
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

 .re{
   margin-left: -20px;
 }

 .ba{
   margin-left: 50px;
 }

 

.error{
   top:0;
   left:0;
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
   top:0;
   left:0;
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
.wronge2{
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
   
   
   