<template>
    <div class=zero style="display: flex; justify-content: center; margin-top: 90px;">
       <div class="first">
          <div class="second">
             <p class="form">Registration Form</p>
 
                <div class="inside">
                   <div style="display: flex; flex-direction: column;  width: 100%;">
                        <label class="n">Account Type:</label>

                        <select v-model="account_type" class='regsinput' id='namein' style="height: 35px; border: 2px solid black; width: 93%;" required>
                           <option v-for="type in types" :key="type.type_id" :value="type.type_id">{{ type.type_name }}</option>
                        </select>

                        <label class="p"> Name:</label>
                        <select v-model="name" class='inputsss' id='namein' style="height: 35px; border: 2px solid black; width: 93%;" required>
                           <option v-for="name in namez" :key="name.name_id" :value="name.name_id">{{ name.last_name }}, {{ name.first_name }} {{ name.middle_init }}</option>
                        </select>
                        <select v-model="name" class='regsinput' id='namein' style="height: 35px; border: 2px solid black; width: 93%;" required>
                           <option v-for="name in names" :key="name.name_id" :value="name.name_id">{{ name.last_name }}, {{ name.first_name }} {{ name.middle_init }}</option>
                        </select>

                        <label class="n">Email:</label>
                        <input type="email" v-model="email"  class ='regsinput'  id = 'email' required >
 
                        <label class="p"> Password: </label>
                        <input type="password" v-model="password" class ='regsinput'  id = 'password' required >
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

               <div v-else-if="pleaseWait" class="correct">
                  <a class="correct1">
                    Registered!!
                  </a>
                  <a class="correct2">
                     Please wait for a moment....
                  </a>
                 
               </div>
 
                <div class="buttonss">
                   <button class="button re" :disabled="submit2" @click="submit">Register</button>
                   <button class="button ba" @click="backButton">Back</button>
                  
                </div>
                
          </div>   
       </div>
      </div>
   </template>
   
   <script setup>
   import { isRegistrationClicked, isVisible, backButton } from './dashboard.vue';
   import axios from 'axios';
   </script>
   
   <script>
   
    export default {
    

      backButton () {
         isRegistrationClicked.value = false;
         isVisible.value = false;
      },

    data() {
       return {
         types:[],
         names:{},
         namez:[],
         employees: [],
         name:'',
         account_type:'',
        email: '',
        password: '',
        submit2:false,
        isValid: false,
        isEmail:false,
        pleaseWait:false
 
       };
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
      submit() {
       const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       const passvalid = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;
 
       if (this.email === '' && this.password === ''&& this.account_type === ''&& this.name === '') {
 
          this.isValid = true; 
          setTimeout(() => {
          this.isValid = false; 
       }, 3000);
 
        

        } else if (this.account_type === '') {
          this.isValid = true; 
          setTimeout(() => {
          this.isValid = false; 
       }, 3000);

        } else if (this.name === '') {
          this.isValid = true; 
          setTimeout(() => {
          this.isValid = false; 
       }, 3000);
       
       } else if (this.email === '') {
            this.isValid = true; 
            setTimeout(() => {
            this.isValid = false; 
        }, 3000);

      } else if (emailPattern.test(this.email) === false) {
         this.isEmail = true; // Set isEmail to true to show the error message
         setTimeout(() => {
         this.isEmail = false; // Reset isValid to false after 3 seconds
      }, 3000);
 
       }else if (this.password === '') {
          this.isValid = true; 
          setTimeout(() => {
          this.isValid = false; 
       }, 3000);
       
       } else if (passvalid.test(this.password) === false) {
          this.isEmail = true; 
          setTimeout(() => {
          this.isEmail = false; 
       }, 3000);
       } else {
         const formData = {
            type_id:'' + this.account_type,
            name_id: '' + this.name,
            email:''+this.email,
            password:''+this.password
         
        };
      
      axios.post('http://127.0.0.1:8000/add_account/', formData)
         .then(response => {
            if (response.status === 200) {
               this.submit2 = true; 
               this.pleaseWait = true;
               this.account_type = '';
               this.name = '';
               this.email = '';
               this.password = '';

               // Set a 3-second timer before reloading the page
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
       }
 
   },
   fetchData() {
      fetch('http://127.0.0.1:8000/get_names_json/')
        .then(response => response.json())
        .then(data => {
          this.names = data;
        })
        .catch(error => {
          console.error('Error fetching names:', error);
        });

      fetch('http://127.0.0.1:8000/get_type_json/')
      .then(response => response.json())
      .then(data => {
        this.types = data;
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });

      fetch('http://127.0.0.1:8000/get_employees_json/')
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
 .regsinput
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

.correct{
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

.errormsg,.wronge2,.correct2{
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
.wronge2,.correct1,.correct2{
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
   
   
   