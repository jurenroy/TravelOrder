<template>
  <div class=update1 style="display: flex; justify-content: center; margin-top: 90px;">
     <div class="update2">
        <div class="update3">
           <p class="updateform">{{ name.first_name }} {{ name.middle_init }} {{ name.last_name }}</p>

              <div class="updateinside">
                 <div style="display: flex; flex-direction: column;  width: 100%;">
                    <label class="updatelabel old">Old Email:</label>
                    <input @keydown.enter='sendOTP' type="email" v-model="email"  class ='updateinput'  id = 'oldemail' required readonly >
                    
                    <label class="updatelabel old">Enter Old Password: </label>
                    <input @keydown.enter='sendOTP' type="password" v-model="passwords" class ='updateinput'  id = 'oldpassword' required :disabled="notClikable1" >

                
                    <label class="updatelabel new">Enter New Email: </label>
                    <input @keydown.enter='sendOTP' type="email" class ='updateinput' v-model="newEmail"  id = 'newEmail' required :disabled="notClikable1">
                    <label class="updatelabel new" >Enter New Password: </label>
                    <input @keydown.enter='sendOTP' type="password" class ='updateinput' v-model="newPassword" id = 'newPassword' :disabled="isDisabledinput || notClikable1" required title="Please Input Old Password First">
                    <!-- <signature/> -->
                    <div class="uploadpicsignature">
                    <label for="fileInput" class="uploadsignature" v-if="uploads" >Upload Signature</label>
                    <input @keydown.enter='sendOTP' class="buttonz" type="file" accept="image/*" id="fileInput" ref="fileInput" style="display: none;" @change="handleFileUpload" v-if="uploads">
                    <img class="uploadimagesig" :src="uploadedImageUrl" alt="Uploaded Image" v-if="uploadedImageUrl">
                    </div>
                 </div>
                 
              </div>

              <div v-if="isNotEqual" class="notequal">
                  <a class="notequal1">
                     Error!!
                  </a>
                  <a class="notequal2">
                     Not Equal to Old Password
                  </a>
               </div>

               <div v-else-if="isEditemail" class="editwronge">
                  <a class="editwronge1">
                     Error Alert!!
                  </a>
                  <a class="editwronge2">
                     Invalid {{ validation }} Input
                  </a>
               </div>

               
               

              <div class="verifyOTPS">
               <label for="otpInput" class="Enterotp" v-if="showotp" >Enter OTP: </label>
                <input @keydown.enter='verifyOTP' class="otpedit" type="text" id="otpInput" v-model="otp" v-if="showotp">
                <button class="verifyotp" @click="verifyOTP" v-if="showotp" :disabled="isVerify" >Verify OTP</button>       
              </div>

                <div  v-if="succesful" class="succesfully"> 
                  <a class="succesfully1">
                    OTP loaded successfully
                  </a>
                </div>
                <div  v-if="verifiedotp" class="verified"> 
                  <a class="verified1">
                    Success Verified OTP
                  </a>
                </div>


              <div class="buttonss">
                <button class="button yes" @click="sendOTP" :disabled="isDisabled" v-if="isbackDisabled">Update</button>
                   <button class="button no" @click="cli" v-if="isbackDisabled">Back</button>
                
              </div>
              
        </div>   
     </div>
  </div>
 </template>


<script setup>
 import { ref, computed } from 'vue';
//  import signature from '@/components/signature.vue';
 import axios from 'axios';
 
 const accountIdz = localStorage.getItem('accountId');
 
 const uploadedImageUrl = ref('');
 const accounts = ref([]);
 const names = ref([]);
 const name = ref('')
 const email = ref ('')
 const newEmail = ref('')
 const oldPass = ref ('')
 const passwords = ref('')
 const newPassword = ref ('')
 const signature = ref ('')
 const hakdog = ref ('')
 const isNotEqual = ref(false)
 const otp = ref('');//ge type
 const otpData = ref([]);//confirm
 const showotp = ref (false)
 const uploads = ref (true)
 const succesful = ref (false);
 const verifiedotp = ref (false)
 const isEditemail = ref (false)
 const validation = ref ('')
 const notClikable1 = ref(false)
//  const isNewPassword = ref (false)

 const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passvalids = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;

 const isDisabled = computed(() => {
      return newEmail.value ==='' && newPassword.value ==='' && signature.value === '' && !uploadedImageUrl.value;
      });

const isDisabledinput = computed(() => {
  return oldPass.value !== passwords.value;
})

const isbackDisabled = computed(() => {
      return showotp.value === false && uploads.value === true 
    });

    const isVerify = computed(() => {
      return otp.value ===''
    });

const clickableDisable = () => {
  notClikable1.value = true

}

 
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageUrl.value = e.target.result;
      signature.value = dataURItoBlob(uploadedImageUrl.value);
    };
    reader.readAsDataURL(file);
  }
};

const dataURItoBlob = (dataURI) => {
const byteString = atob(dataURI.split(',')[1]);
const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
const arrayBuffer = new ArrayBuffer(byteString.length);
const uint8Array = new Uint8Array(arrayBuffer);
for (let i = 0; i < byteString.length; i++) {
  uint8Array[i] = byteString.charCodeAt(i);
}
return new Blob([arrayBuffer], { type: mimeString });
};


  
const sendOTP = async () => {
  try {
    await axios.post(`http://172.31.10.148:8000/send-otp/${accountIdz}`);

    if (regex.test(newEmail.value) === false && newEmail.value !== ''){
         isEditemail.value = true; // Set isEmail to true to show the error message
         validation.value = 'Email'
         setTimeout(() => {
         isEditemail.value = false; // Reset isValid to false after 3 seconds
      }, 3000);
    }else if (passvalids.test(newPassword.value) === false  && newPassword.value !== ''){
         isEditemail.value = true; // Set isEmail to true to show the error message
         validation.value = 'Password'
         setTimeout(() => {
         isEditemail.value = false; // Reset isValid to false after 3 seconds
      }, 3000);
    }else {
      succesful.value = true; 
      await fetchOTPData();
      setTimeout(() => {
        succesful.value = false; 
        showotp.value = true;
        uploads.value = false;
        uploadedImageUrl.value = ''
        clickableDisable()
        handleFileUpload()
      }, 2000);

    }
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};

const verifyOTP = () => {
  if (otpData.value.length > 0) {
    
    if (parseInt(otpData.value[0].code) === parseInt(otp.value)) {
      updateProfile()
      
    } else {
    }   
  } else {
    console.error('OTP data not preloaded.');
    return;
  }
};
 

const updateProfile = () => {
  const formData = new FormData();
  try {
    
    if (newEmail.value !== '') {
    formData.append('email', newEmail.value);
    
    }else{
    }

    if (passwords.value !== '' && newPassword.value !== '') {
        formData.append('password', newPassword.value);
    }else{
    }

    if (signature.value !== '') {
        formData.append('signature', signature.value);
    }else{
    }

    axios.post(`http://172.31.10.148:8000/update_account/${accountIdz}`, formData)
        .then(response => {
            verifiedotp.value = (true)
            setTimeout(() => {
            window.location.reload();
            }, 2000);
        })
        .catch(error => {
            console.error('Invalid data:', error);
        });
}catch(error){
}
}

 const fetchAccounts = async () => {
   try {
     const response = await axios.get('http://172.31.10.148:8000/get_accounts_json');

     accounts.value = await response.data.filter(result => result.account_id == accountIdz);
     email.value = accounts.value[0].email
     oldPass.value = accounts.value[0].password
   } catch (error) {
     console.error('Error fetching accounts:', error);
   }
 };
 
 const fetchNames = async () => {
   try {
     const response = await axios.get('http://172.31.10.148:8000/get_names_json');
     names.value = response.data;
 
     const account = accounts.value.find(acc => acc.account_id === parseInt(accountIdz));
 
   if (account) {
     const nameId = account.name_id;
     const foundName = names.value.find(name => name.name_id === nameId);
     if (foundName) {
       name.value = foundName;
       nameLoaded.value = true; // Set the flag to true when the name is found
     } else {
     }
   } else {
   }
   } catch (error) {
     console.error('Error fetching names:', error);
   }
 };

 const convert = async () => {
   name.value = name.value.toUpperCase()
 };

 const fetchOTPData = async () => {
  try {
    const response = await axios.get('http://172.31.10.148:8000/get_otp_json');
    otpData.value = response.data.filter(result => result.account_id == accountIdz);
  } catch (error) {
    console.error('Error fetching OTP data:', error);
  }
};
 
 fetchAccounts();
 fetchNames();
 convert();
 
 </script>


<script>
import { Usernames, showEdit, } from '@/components/heder.vue'; 
import { isEdits, isRegistrationClicked,isVisible } from '@/views/dashboard.vue';


   export default {

    
      methods: {
      cli() {
         showEdit.value = false;
         isEdits.value = false
         Usernames.value = true
         isRegistrationClicked.value = false;
          isVisible.value=false
      },

     
       
      
    }
  }
</script>

<style>

.update2{
    top: 0px;
    position:absolute;
   width:100%;
   height: 100vh;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   background-color: white;
   /* backdrop-filter: blur(10px); */
}
.update3{
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   border-radius: 25px;
   background-color: white;
   width: 400px; /* Set width to a percentage of the viewport width */
   max-width: 500px; /* Set a maximum width */
   height: auto; /* Let the height adjust based on content */
   padding: 20px;
   color: #212121;
   border: 2px solid black;
   box-shadow: 0px 0px 35px -2px black;
}
.update3.zoomed {  
  transform: scale(2); /* Zoom in by a factor of 2 */
}
.updateform{
   font-weight:bold;
    font-size: 25px;
    margin-top: 20px;
}
.updateinside {
  display: flex;
  width: 300px;
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
    width: 100px;
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

 .updateinput
{
   font-size: 18px;
   border-radius: 5px;
   width: 96%;
   height: 30px;
   margin-bottom: 12px;
}

.updatelabel{
  font-weight:bold;
    font-size: 18px;
    text-align: left;
}

.notequal{
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

.notequal1{
   height: 20px;
   width: 100%;
   text-align: center;
   color:black;
   
}
.notequal2{
   height: 20px;
   width: 100%;
   text-align: center;
}

.uploadimagesig {
  margin-top: 10px;
  max-width: 100%;
  height: 100px;
  width: auto;
  border: 1px solid black;
}
.uploadsignature {
    height: 20px;
    width: 100px;
    font-size: 13px;
    color: black;
    cursor: pointer;
    padding: 5px;
    border: 1px solid black;
    border-radius: 5px;
    margin-left: 10px;
    font-weight:bold;
    font-size: 13px;

}
.uploadsignature:hover {
  background-color: black;
  color: white;
  border: 1px solid white;
}

.uploadpicsignature{
  display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.succesfully{
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
.succesfully1,.verified1{
   height: 20px;
   width: 100%;
   text-align: center;
   color: white;
}

.verifyOTPS{
  display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.verified{
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

.verifyotp{
  height: 20px;
    width: 100px; 
    margin-top:-5px; 
    cursor: pointer;
    border-radius:5px;
     font-size: 13px;
}
.otpedit{
   font-size: 12px;
   border-radius: 5px;
   width: 50%;
   height: 15px;
   margin-bottom: 12px;
}

.editwronge{
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

.editwronge1{
   height: 20px;
   width: 100%;
   text-align: center;
   color:white;
   
}
.editwronge2,.correct1,.correct2{
   color: white;
}

.Enterotp{
  font-weight:bold;
    font-size: 18px;
    text-align: left;
}
@media (max-width: 768px) {

   .updateinside {
    flex-direction: column;
   }
.update1{
    top:-3000px   
 }}


</style>