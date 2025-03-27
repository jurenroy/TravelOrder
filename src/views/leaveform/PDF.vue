<template>
   <div class="a4-containerz">
       <div class="a4-contentz">
           <div style="display: flex; flex-direction: row; justify-content: center;">
               <img :src="image1" alt="Background Image" class="pic1">
               <div style="text-align: center;">
                   <p style=" font-size: 11px;">Republic of the Philippines</p>
                   <p style=" font-size: 11px;">Department of Environment and Natural Resources</p>
                   <p style=" font-size: 13px; font-weight: bold;">MINES AND GEOSCIENCE BUREAU REGIONAL OFFICE NO. X
                   </p>
                   <p style=" font-size: 11px;">DENR-X Compound, Puntod, Cagayan de Oro City</p>
               </div>
               <img :src="image2" alt="Bago Image" class="pic2">
           </div>
           <h3 style="text-align: center">APPLICATION FOR LEAVE</h3>
           <div>
               <div style="border: 2px solid black; padding: 5px;">
                   <div
                       style="display: flex; flex-direction: row; font-size: 10px; justify-content: space-evenly; margin-top: -10px; margin-bottom: -15px;">
                       <p style="margin-left: -30px;">1. OFFICE/DEPARTMENT</p>
                       <p style="margin-left: 70px;">2. NAME</p>
                       <p style="margin-left: 70px;">(Last)</p>
                       <p style="margin-left: 120px;">(First)</p>
                       <p style="margin-left: 100px;">(Middle)</p>
                   </div>
                   <div style="display: flex; flex-direction: row; align-items: center;  margin-bottom: -10px;">
                       <p style="font-size: 10px;">Mines and Geosciences Bereau Regional Office No. X</p>
                       <text style="margin-left: auto; font-size: 12px; font-weight: bold">{{ name.last_name }}</text>
                       <text style="margin-left: auto; font-size: 12px; font-weight: bold">{{ name.first_name }}</text>
                       <text style="margin-left: auto; margin-right: 5%; font-size: 12px; font-weight: bold">{{
           name.middle_init
       }}</text>
                   </div>
               </div>
               <div
                   style="display: flex; flex-direction: row; border: 2px solid black; margin-top: -2px; justify-content: space-between; font-size: 10px; padding: 1px">
                   <p style="margin-left: 5px">3. DATE OF FILING: 
                       <label style="border: none; border-bottom: 1px solid black;">{{ datetoday }}</label>
                   </p>

                   <p>4. POSITION: <label style="border: none; border-bottom: 1px solid black;">{{ position }}</label>
                   </p>

                   <p style="margin-right: 5px">5. SALARY:
                       <input readonly
                           style="height: 10px; width: 100px; outline: none; border: none; border-bottom: 1px solid black; font-size: 10px; "
                           v-model="formattedSalary"/>
                   </p>
               </div>
           </div>
           <div style="border: 2px solid black;margin-top: 2px;text-align: center; font-size: 12px; font-weight: bold">
               <p style="margin: 0.5px;">6. DETAILS OF APPLICATION</p>
           </div>
           <div>
               <div style="display: grid; grid-template-columns: repeat(2, 1fr); ">
                   <div style="border: 2px solid black;margin-top: 2px;font-size: 10px;">
                       <p style="margin-left: 10px">6.A TYPE OF LEAVE TO BE AVAILED OF</p>
                       <div style="margin-left: 20px;">

                           <!-- vacation -->
                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[0]"  >
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Vacation Leave</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[1]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Mandatory/Forced Leave</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[2]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Sick Leave</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[3]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Maternity Leave</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[4]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Paternity Leave</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[5]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Special Privilege Leave</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[6]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Solo Parent Leave</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[7]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Study Leave</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[8]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>10-Day VAWC Leave</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[9]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Rehabilitation Privilege</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[10]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Special Leave Benefits for Women</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[11]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Special Emergency(Calamity) Leave</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="selectedLeavetype" :value="leavetype[12]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Adoption Leave</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <p style="margin-left: 15px; margin-top: 15px;font-style: italic;">Others:</p>
                           </div>

                           <input readonly :disabled="selectedLeavetype != ''"
                               style="height: 10px; width: 300px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-left: 10px; margin-right: 33px; font-size: 10px"
                               v-model="LeaveType">
                       </div>

                   </div>
                   <div style="border: 2px solid black;margin-top: 2px;font-size: 10px; margin-left: -2px;">
                       <p style="margin-left: 10px">6.B TYPE OF LEAVE TO BE AVAILED OF</p>
                       <div style="margin-left: 20px;">
                           <p style="margin-left: 5px; margin-top: -5px;font-style: italic;">In case of
                               Vacation/Special Privilege Leave:</p>
                           <div
                               style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                               <div style="display: flex; flex-direction: row;">
                                   <label class="containerlist">
                                       <input readonly type="checkbox"  disabled  :disabled="![0, 5].some(value => selectedLeavetype.includes(value))"
                                           v-model="vacationleavedetails" :value="vacationdetails[0]">
                                       <svg viewBox="0 0 64 64" height="2em" width="2em">
                                           <path
                                               d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                               pathLength="575.0541381835938" class="path"></path>
                                       </svg>
                                   </label>
                                   <p>Within the Philippines</p>
                               </div>

                               <div>
                                   <input readonly
                                       style="height: 10px; width: 150px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                       :disabled="![0, 5].some(value => selectedLeavetype.includes(value))  || !vacationleavedetails.includes(1)"
                                       v-model="vacation1"
                                      >
                               </div>
                           </div>
                           <div
                               style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                               <div style="display: flex; flex-direction: row;">
                                   <label class="containerlist" >
                                       <input readonly type="checkbox"  disabled  :disabled="![0, 5].some(value => selectedLeavetype.includes(value))"
                                           v-model="vacationleavedetails" :value="vacationdetails[1]">
                                       <svg viewBox="0 0 64 64" height="2em" width="2em">
                                           <path
                                               d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                               pathLength="575.0541381835938" class="path"></path>
                                       </svg>
                                   </label>
                                   <p>Abroad(Specify)</p>
                               </div>

                               <div>
                                   <input readonly
                                       style="height: 10px; width: 150px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                       :disabled="![0, 5].some(value => selectedLeavetype.includes(value)) || !vacationleavedetails.includes(2)"
                                       v-model="vacation2"
                                      >
                               </div>
                           </div>
                           <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">In case of Sick Leave:</p>
                           <div
                               style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                               <div style="display: flex; flex-direction: row;">
                                   <label class="containerlist">
                                       <input readonly type="checkbox"  disabled  :disabled="!selectedLeavetype.includes(2)"
                                           v-model="sickleavedetails" :value="sickdetails[0]">
                                       <svg viewBox="0 0 64 64" height="2em" width="2em">
                                           <path
                                               d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                               pathLength="575.0541381835938" class="path"></path>
                                       </svg>
                                   </label>
                                   <p>In Hospital (Specify Illness)</p>
                               </div>

                               <div>
                                   <input readonly
                                       style="height: 10px; width: 150px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                       :disabled="!selectedLeavetype.includes(2) || !sickleavedetails.includes(1)"
                                       v-model="sick1"
                                      >
                               </div>
                           </div>
                           <div
                               style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                               <div style="display: flex; flex-direction: row;">
                                   <label class="containerlist" >
                                       <input readonly type="checkbox"  disabled  :disabled="!selectedLeavetype.includes(2)"
                                           v-model="sickleavedetails" :value="sickdetails[1]">
                                       <svg viewBox="0 0 64 64" height="2em" width="2em">
                                           <path
                                               d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                               pathLength="575.0541381835938" class="path"></path>
                                       </svg>
                                   </label>
                                   <p>Out Patient (Specify Illness)</p>
                               </div>

                               <div>
                                   <input readonly
                                       style="height: 10px; width: 150px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                       :disabled="!selectedLeavetype.includes(2) || !sickleavedetails.includes(2)"
                                       v-model="sick2"
                                      >
                               </div>
                           </div>

                           <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">In case of Special Leave
                               Benefits for Women:</p>
                           <div style="display: flex; flex-direction: row; justify-content: space-between">
                               <p style="margin-left: 5px; margin-top: -0px">(Specify Illness)</p>
                               <input readonly
                                   style="height: 10px; width: 150px; margin-top: -3px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                   :disabled="!selectedLeavetype.includes(10)" v-model="leaveforwoman"
                                   >
                           </div>

                           <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">In case of Study Leave:
                           </p>
                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist" >
                                   <input readonly type="checkbox"  disabled  :disabled="!selectedLeavetype.includes(7)"
                                       v-model="studyleavedetails" :value="studydetails[0]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Completion of Master's Degree</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  :disabled="!selectedLeavetype.includes(7)"
                                       v-model="studyleavedetails" :value="studydetails[1]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>BAR/Board Examination Review Other</p>
                           </div>

                           <div style="display: flex; flex-direction: row; justify-content: space-between">
                               <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">Other purpose:</p>

                               <input readonly
                                   style="height: 10px; width: 150px; margin-top: -3px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                    v-model="otherPurpose" :disabled="!selectedLeavetype.includes(7)" >
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -5px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="monetization" :value="terminalleave[0]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Monetization of Leave Credits</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="monetization" :value="terminalleave[1]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Terminal Leave</p>
                           </div>

                       </div>
                   </div>
               </div>
               <div style="display: grid; grid-template-columns: repeat(2, 1fr);">
                   <div style="border: 2px solid black;margin-top: -2px;font-size: 10px;">
                       <p style="margin-left: 10px; margin-bottom: 5px">6.C Number OF WORKING DAYS APPLIED FOR</p>
                       <div style="margin-left: 20px;">
                           <!-- pag naay value pero isa ra kabuok -->
                           <p style="margin-top: 25px;"></p>
                           <input readonly v-if="!isSingleDate" v-model="dayszz" 
                               style="position: relative; left:24px;top: -10px; margin-bottom: -20px; font-size: 10px; border:none; outline: none ">
                           <p
                               style="height: 10px; width: 300px; border: none; border-bottom: 1.5px solid black; outline: none; margin-right: 10px; font-size: 10px; position: relative; left:10px; margin-top: -15px;">
                           {{ dayszz }}
                            </p>


                           <p style=" margin-bottom: 5px">INCLUSIVE DATES</p>
                           <p style="margin-bottom: -20px; margin-left: 10px;">{{ dateszz }}</p>

                           <p v-if="!isSingleDate && startDate && !endDate && selectedDate"
                               style="margin-right: 10px; font-size: 10px; margin-bottom: -20px; position: relative; left:10px;">
                               <input readonly v-model="dateszz"
                                   style="border:none; background-color: transparent; font-size: 10px; margin-bottom: -20px; position: relative; left: 10px " />
                           </p>


                           <!-- pag naa nay value -->
                           <p v-if="!isSingleDate && startDate && !endDate && selectedDate"
                               style="height: 10px; width: 300px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px; position: relative; left:10px">
                           </p>

                           <p v-if="!selectedDate"
                               style="height: 10px; width: 300px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px; position: relative; left:10px;">
                           </p>

                           <p v-if="!isSingleDate && startDate && endDate"
                               style="margin-right: 10px; font-size: 10px; margin-bottom: -20px; position: relative; left:10px;  ">
                               <input readonly v-model="formattedDateRange"
                                   style="border:none; background-color: transparent; font-size: 10px; margin-bottom: -20px; position: relative; left: 10px " />
                           </p>

                           <p v-if="!isSingleDate && startDate && endDate"
                               style="height: 10px; width: 300px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px; position: relative; left: 10px">
                           </p>


                           <div>
                               <input readonly type="date" id="date-input" v-model="selectedDate" @change="handleDateChange"
                                   style="width: 16px; height: 20px; outline: none; border: none; position: relative; top: -32px; left:290px;" />
                           </div>
                       </div>
                   </div>
                   <div style="border: 2px solid black;margin-top: -2px;font-size: 10px;margin-left: -2px;">
                       <p style="margin-left: 10px;">6.D COMMUTATION</p>
                       <div style="margin-left: 20px;">
                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="commutationLeavetype" :value="commutationtype[0]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Not Requested</p>
                           </div>

                           <div style="display: flex; flex-direction: row; margin-top: -15px">
                               <label class="containerlist">
                                   <input readonly type="checkbox"  disabled  v-model="commutationLeavetype" :value="commutationtype[1]">
                                   <svg viewBox="0 0 64 64" height="2em" width="2em">
                                       <path
                                           d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                           pathLength="575.0541381835938" class="path"></path>
                                   </svg>
                               </label>
                               <p>Requested</p>
                           </div>

                       </div>
                       <div style="width: 100%; display: flex; justify-items: center; align-items: center; flex-direction: column;">
                        <img :src="signature3" class="signatizz" v-if="signature3" 
                             style="width: auto; height: 50px; position: absolute; margin-top: -25px;" @contextmenu.prevent />
                        </div>
                       <input readonly disabled
                           style="border:1px solid black; border:none; outline:none; border-bottom:1.5px solid black; width:330px; position: relative; left:35px;" />
                       <p style="text-align: center;">(Signature of Applicant)</p>
                   </div>
               </div>
           </div>
           <div style="border: 2px solid black;margin-top: 2px;text-align: center; font-size: 12px; font-weight: bold">
               <p style="margin: 0.5px;">7. DETAILS OF ACTION ON APPLICATION</p>
           </div>
           <div>
               <div style="display: grid; grid-template-columns: repeat(2, 1fr); font-size: 10px;">
                   <div style="border: 2px solid black;margin-top: 2px;font-size: 10px;">
                       <p style="margin-left: 10px;">7.A CERTIFICATION OF LEAVE CREDITS</p>
                       <div style="display: flex;flex-direction: row; justify-content: center; margin-left: 90px">
                           <p>As of</p>
                           <input readonly
                               style="height: 10px; width: 230px; border: none; border-bottom: 1.5px solid black;outline: none; font-size: 10px; margin-top: 7px; margin-left: 3px" v-model="leavecredits">
                       </div>
                       <div>
                           <div class="grid-container">
                               <div class="grid-item"></div>
                               <div class="grid-item">Vacation Leave</div>
                               <div class="grid-item">Sick Leave</div>
                               <div class="grid-item">Total Earned</div>
                               <div class="grid-item">
                                   <input readonly type="text" class="leavecredits" v-model="totalvacation">
                               </div>
                               <div class="grid-item">
                                   <input readonly type="text" class="leavecredits" v-model="totalsick">
                               </div>
                               <div class="grid-item">Less this Application</div>
                               <div class="grid-item">
                                   <input readonly type="text" class="leavecredits" v-model="lessvacation">
                               </div>
                               <div class="grid-item">
                                   <input readonly type="text" class="leavecredits" v-model="lesssick">
                               </div>
                               <div class="grid-item">Balance</div>
                               <div class="grid-item">
                                   <input readonly type="text" class="leavecredits" v-model="balancevacation">
                               </div>
                               <div class="grid-item">
                                   <input readonly type="text" class="leavecredits" v-model="balancesick">
                               </div>
                           </div>
                       </div>
                       <div style="width: 100%; display: flex; justify-items: center; align-items: center; flex-direction: column;">
                        <img :src="signature2" class="signatizz" v-if="signature2"
                             style="width: auto; height: 80px; position: absolute; margin-top: -15px;" @contextmenu.prevent />
                        </div>
                       <p
                           style="text-align: center; margin-top: 15px; border: none; outline: none; width: auto; z-index: 9; font-size: 10px; font-weight: bold;">
                           {{ secch }}
                       </p>
                       <p
                           style="height: 10px; width: 350px; margin-top: -19px; z-index: 1; border: none; border-bottom: 1px solid black;outline: none; margin-left: 20px; font-size: 10px">
                       </p>
                       <p style="text-align: center; position: relative; top:-6px; font-size:9px;">{{ secchpos }}</p>
                   </div>
                   <div style="border: 2px solid black;margin-top: 2px;font-size: 10px;margin-left: -2px;">
                       <p style="margin-left: 10px;">7.B RECOMMENDATION</p>
                       <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
                           <label class="containerlist">
                               <input readonly type="checkbox"  disabled  v-model="recommendationLeavetype" :value="recommendationtype[0]">
                               <svg viewBox="0 0 64 64" height="2em" width="2em">
                                   <path
                                       d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                       pathLength="575.0541381835938" class="path"></path>
                               </svg>
                           </label>
                           <p>For approval</p>
                       </div>

                       <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
                           <label class="containerlist">
                               <input readonly type="checkbox"  disabled  v-model="recommendationLeavetype" :value="recommendationtype[1]">
                               <svg viewBox="0 0 64 64" height="2em" width="2em">
                                   <path
                                       d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                       pathLength="575.0541381835938" class="path"></path>
                               </svg>
                           </label>
                           <p>For disapproval due to:</p>
                       </div>
                       

                       <textarea @keydown.enter.prevent v-model="text" id="myTextarea" :rows="rows"
                          
                           disabled readonly
                           style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 350px; margin-left: 20px; font-size: 10px; text-decoration: underline; margin-bottom: 30px;"></textarea>
                           <div style="width: 100%; display: flex; justify-items: center; align-items: center; flex-direction: column;" v-if="!isChief">
                        <img :src="signature1" class="signatizz" v-if="signature1"
                             style="width: auto; height: 80px; position: absolute; margin-top: -45px;" @contextmenu.prevent />
                        </div>
                        <div style="width: 100%; display: flex; justify-items: center; align-items: center; flex-direction: column;" v-if="isChief">
                        <img :src="signature" class="signatizz" v-if="signature"
                             style="width: auto; height: 80px; position: absolute; margin-top: -35px;" @contextmenu.prevent />
                        </div>
                       <p style="text-align: center;margin-bottom: -20px;z-index: 9;">{{ reco }}</p>

                       <p
                           style="height: 10px; width: 350px; z-index: 1; border: none; border-bottom: 1px solid black;outline: none; margin-left: 20px; font-size: 10px; color: transparent;">
                       </p>
                       <p style="text-align: center">{{ recopost }}</p>
                   </div>
               </div>
           </div>
           <div style="border: 2px solid black;margin-top: -2px; font-size: 10px;">
               <div>
                   <div style="display: grid; grid-template-columns: repeat(2, 1fr);">
                       <div>
                           <p style="margin-left: 10px;">7.C APPROVED FOR</p>
                           <div style="margin-left: 20px;">
                               <div style="display: flex; flex-direction: row; margin-top: -5px;">
                                   <input readonly
                                       style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                       v-model="withpay"
                                       >
                                   <p style="font-size: 10px;">days with pay</p>
                               </div>
                               <div style="display: flex; flex-direction: row; margin-top: -5px;">
                                   <input readonly
                                       style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                       v-model="withoutpay">
                                   <p>days without pay</p>
                               </div>
                               <div style="display: flex; flex-direction: row; margin-top: -5px;">
                                   <input readonly
                                       style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                       v-model="othersSpecify">
                                   <p>others (Specify)</p>
                               </div>
                           </div>
                       </div>
                       <div>
                           <p style="margin-left: 10px;">7.D DISAPPROVED DUE TO:</p>
                           <textarea @keydown.enter.prevent v-model="text2" id="myTextarea" :rows="rows2" disabled readonly
                               style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 350px; margin-left: 20px; font-size: 10px; text-decoration: underline;"></textarea>
                       </div>
                   </div>
               </div>
               <div>
                <div style="width: 100%; display: flex; justify-items: center; align-items: center; flex-direction: column;">
                        <img :src="signature" class="signatizz" v-if="signature && !isChief"
                             style="width: auto; height: 80px; position: absolute; margin-top: -35px;" @contextmenu.prevent />
                        </div>
                        <p v-if="rd !== ''" style="text-align: center; background-color: white; color: black;">{{ rd }}</p>
                        <p v-else style="text-align: center; background-color: white; color: transparent;">&nbsp;</p>
                                            
                        <p v-if="rdpos !== ''" style="text-align: center; background-color: white; color: black;">{{ rdpos }}</p>
                        <p v-else style="text-align: center; background-color: white; color: transparent;">&nbsp;</p>
               </div>
           </div>
           <div>
          <div class="cuearez">
          <img :src="qrCodeUrl" alt="QR Code" v-if="qrCodeUrl" class="bigzz" @contextmenu.prevent>
          <img :src="imageSrc" alt="QR Code" v-if="qrCodeUrl" class="centzz" @contextmenu.prevent>
          <p class="qrquotez" style="font-size: 9px;">This is an official Leave Form approved digitally and generated from <br/>the MGB-X Online Leave Form. No original signature is required.</p>
          </div>
        </div>
          <!-- <div class="leavebuttonss">
              <button class="leavebutton" @click="submitForm"> Submit
           </button>
          </div>  -->
       </div>

   </div>
</template>

<script>
import modeCtrGladman from 'crypto-js/mode-ctr-gladman';
import image1 from '../../assets/background_image.png'
import image2 from '../../assets/bago.png'
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import mgbx from '../../assets/mgbx.png'
import QRCode from 'qrcode'

export default {
    props: {
      leaveform_id: {
        type: String,
        required: true,
      },
      isChief: {
        type: Boolean,
        required: true,
      },
    },
   data() {
       return {
        qrCodeUrl: '',
      imageSrc: mgbx,
        leaveForms:[],
           leaveshowhome:true,
           image1: image1,
           image2: image2,
           datetoday: '',
           secch: 'JOANNE ROSE O. ALVAREZ',
           secchpos: 'Administrative Officer V (HRMO)',
           reco: '',
           recopost: '',
           rd: 'RODANTE B. FELINA',
           rdpos: 'OIC, REGIONAL DIRECTOR',
           name: {
            last_name: '',
            first_name: '',
            middle_init: '',
           },
           text: '',
           rows: 1,
           text2: '',
           rows2: 1,
           isSingleDate: true,
           selectedDate: '',
           startDate: null,
           endDate: null,
           weekdaysCount: 1,

           selectedLeavetype: [],
           vacationleavedetails: [],
           sickleavedetails: [],
           studyleavedetails: [],
           commutationLeavetype: [],
           recommendationLeavetype: [],
           monetization: [],

           LeaveType: '',
           leavetype: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

           vacationdetails: [1, 2],
           vacation1: '',
           vacation2: '',

           sickdetails: [1, 2],
           sick1: '',
           sick2: '',
           studydetails: [1, 2],
           otherPurpose: '',

           leaveforwoman: '',

           commutationtype: [1, 2],

           recommendationtype: [1, 2],
           terminalleave: [1, 2],

           totalvacation: '',
           totalsick: '',
           lessvacation: '',
           lesssick: '',
           balancevacation: '',
           balancesick: '',
           withpay: '',
           withoutpay: '',
           othersSpecify: '',
           leavecredits:'',
           signature: '',
           signature1: '',
           signature2: '',
           signature3: '',
           accounts: [],
           accountIdz: localStorage.getItem('accountId'),
           name: [],
           names: [],
           position: '',
           positions: [],
           employees: [],
           name_id: '',
           salary: '',
           division: '',
           signatories: [
               "JANICE B. FUROG",
               "LIBERTY B. DAITIA",
               "OSIN A. SINSUAT JR.",
               "ALVIN M. VILLANUEVA",
               "RODANTE B. FELINA",
               "LIBERTY B. DAITIA",
               "JOY CHRISTINE V. ASIS",
           ],
           designations: [
               "Chief, MMD",
               "Chief, FAD",
               "Chief, GD",
               "Chief, MSESDD",
               "OIC, Regional Director",
               "Chief Administrative Officer",
               "OIC, Geoscicnce Division",
           ],
           dayszz: '',
           dateszz: '',
       };
   },
   watch: {
    leaveform_id(newVal) {
      // Check if the new value is not null, then populate fields
      if (newVal !== 0) {
        this.fetchLeaveForms(newVal, this.isChief);
      }
    },
       text() {
           this.updateRows();
       },
       text2() {
           this.updateRows2();
       },
       selectedLeavetype(newValue, oldValue) {
           this.LeaveType = '';
           if (newValue.length > 1) {
               this.selectedLeavetype = [newValue[newValue.length - 1]]
               this.vacationleavedetails = [];
               this.sickleavedetails = [];
               this.monetization = [];
               this.vacation1 = '';
               this.vacation2 = '';
               this.sick1 = '';
               this.sick2 = '';
               this.leaveforwoman = '';
               this.otherPurpose = ''

           }
       },
       vacationleavedetails(newValue, oldValue) {
           if (newValue.length > 1) {
               this.vacationleavedetails = [newValue[newValue.length - 1]]
               this.vacation1 = '';
               this.vacation2 = '';
           }
       },

       sickleavedetails(newValue, oldValue) {
           if (newValue.length > 1) {
               this.sickleavedetails = [newValue[newValue.length - 1]]
               this.sick1 = '';
               this.sick2 = '';

           }
       },

       studyleavedetails(newValue, oldValue) {
           if (newValue.length > 1) {
               this.studyleavedetails = [newValue[newValue.length - 1]]
               this.study1 = '';
               this.otherPurpose = ''

           }
       },
       commutationLeavetype(newValue, oldValue) {
           if (newValue.length > 1) {
               this.commutationLeavetype = [newValue[newValue.length - 1]]
           }
       },

       recommendationLeavetype(newValue, oldValue) {
           if (newValue.length > 1) {
               this.recommendationLeavetype = [newValue[newValue.length - 1]]
               this.text = '';
           }
       },

       monetization(newValue, oldValue) {
           if (newValue.length > 1) {
               this.monetization = [newValue[newValue.length - 1]]
               this.selectedLeavetype = [];
           }
       },
   },

   mounted() {
       this.fetchAccounts();
       this.fetchNames();
       this.fetchemployee();
       this.comparePosition();
   },

   methods: {
        navigatez(){
            window.location.pathname = '/leaveform';
        },
        async generateQRCode() {
            console.log('damn')
      const textToEncode = `MGBX LEAVE FORM ${this.name.first_name} ${this.name.middle_init} ${this.name.last_name}` ;
      try {
        this.qrCodeUrl = await QRCode.toDataURL(textToEncode);
        console.log(this.qrCodeUrl)
      } catch (err) {
        console.error(err);
      }
    },
        
       async fetchAccounts() {

           try {
               const response = await axios.get(`${API_BASE_URL}/get_accounts_json`);

               this.accounts = response.data  

           } catch (error) {
               console.error('Error fetching accounts:', error);
           }
       },

       async fetchNames() {
           try {
               const response = await axios.get(`${API_BASE_URL}/get_names_json`);
               this.names = response.data;
           } catch (error) {
               console.error('Error fetching names:', error);
           }
       },
       getPositionById(id, arrayName) {
           const array = this[arrayName];
           if (!array) {
               return ''; // Return an empty string if the array is not found
           }
           const item = array.find(item => item.position_id === id);
           return item ? item.position_name : '';
       },
       fetchemployee() {
           fetch(`${API_BASE_URL}/get_employees_json/`)
               .then(response => response.json())
               .then(data => {
                   this.employees = data
               })
               .catch(error => {
                   console.error('Error fetching employees:', error);
               });
           // Fetch positions data
           fetch(`${API_BASE_URL}/get_positions_json/`)
               .then(response => response.json())
               .then(data => {
                   this.positions = data
               })
               .catch(error => {
                   console.error('Error fetching positions:', error);
               });
       },
       fetchLeaveForms(leaveformID) {
      axios.get(`${API_BASE_URL}/get_leave_json/${leaveformID}`)
        .then(response => {

            this.selectedLeavetype = []; // Ensure it's cleared before setting a new type
            this.vacationleavedetails = []; // Ensure it's cleared before setting a new type
            this.vacation1 = []; // Ensure it's cleared before setting a new type
            this.vacation2 = []; // Ensure it's cleared before setting a new type

            this.sickleavedetails = []; // Ensure it's cleared before setting a new type
            this.sick1 = []; // Ensure it's cleared before setting a new type
            this.sick2 = []; // Ensure it's cleared before setting a new type

            this.studyleavedetails = []; // Ensure it's cleared before setting a new type
            this.otherPurpose = []; // Ensure it's cleared before setting a new type

            
          this.leaveForms = response.data
          console.log(response.data)

          
          if (this.leaveForms){
            this.generateQRCode(this.leaveForms)
            this.comparePosition()
            this.name_id = this.leaveForms.name_id
            

            this.division = this.employees.find(emp => emp.name_id == this.leaveForms.name_id).division_id

                    if ([15, 21, 45, 48, 3].includes(this.name_id)) {
                       this.reco = this.isChief ?  this.signatories[4] : ''
                       this.recopost = this.isChief ?  this.designations[4] : ''
                       this.rd = this.isChief ? '' : this.signatories[4]
                       this.rdpos = this.isChief ?  '' : this.designations[4]
                   } else if (this.name_id == 20) {
                       this.reco = ''
                       this.recopost = ''
                       this.rd = ''
                       this.rdpos = ''
                   }
                   else if (this.division == 1) {
                       {
                           this.reco = this.signatories[0]
                           this.recopost = this.designations[0]
                           if (this.leaveForms.appby == 20 || this.leaveForms.appby == null){
                           this.rd = 'RODANTE B. FELINA'
                           this.rdpos = 'OIC, REGIONAL DIRECTOR'
                           } else if (this.leaveForms.appby == 21) {
                               this.rd = this.signatories[0]; // "JANICE B. FUROG"
                               this.rdpos = this.designations[0]; // "Chief, MMD"
                           } else if (this.leaveForms.appby == 15) {
                               this.rd = this.signatories[5]; // "LIBERTY B. DAITIA"
                               this.rdpos = this.designations[5]; // "CAO"
                           } else if (this.leaveForms.appby == 45) {
                               this.rd = this.signatories[2]; // "OSIN A. SINSUAT JR."
                               this.rdpos = this.designations[2]; // "Chief, GD"
                           } else if (this.leaveForms.appby == 48) {
                               this.rd = this.signatories[3]; // "ALVIN M. VILLANUEVA"
                               this.rdpos = this.designations[3]; // "Chief, MSESDD"
                           }
                       }
                   } else if (this.division == 2) {
                       {
                        console.log('fad')
                           this.reco = this.signatories[1]
                           this.recopost = this.designations[1]
                           if (this.leaveForms.appby == 20 || this.leaveForms.appby == null){
                           this.rd = 'RODANTE B. FELINA'
                           this.rdpos = 'OIC, REGIONAL DIRECTOR'
                           } else if (this.leaveForms.appby == 21) {
                               this.rd = this.signatories[0]; // "JANICE B. FUROG"
                               this.rdpos = this.designations[0]; // "Chief, MMD"
                           } else if (this.leaveForms.appby == 15) {
                               this.rd = this.signatories[5]; // "LIBERTY B. DAITIA"
                               this.rdpos = this.designations[5]; // "CAO"
                           } else if (this.leaveForms.appby == 45) {
                               this.rd = this.signatories[2]; // "OSIN A. SINSUAT JR."
                               this.rdpos = this.designations[2]; // "Chief, GD"
                           } else if (this.leaveForms.appby == 48) {
                               this.rd = this.signatories[3]; // "ALVIN M. VILLANUEVA"
                               this.rdpos = this.designations[3]; // "Chief, MSESDD"
                           }
                       }
                   } else if (this.division == 3) {
                       
                        console.log('gd?')
                        
                        if (this.leaveForms.recommendation && this.leaveForms.recommendation.split('/').pop() === 'urAs0SbQ7kw0y6LI4B9dyOpQxKI8cL4q4aEbsFSh.png'){
                            this.reco = this.signatories[2]
                           this.recopost = this.designations[2]
                           console.log('sirjo')
                        } else {
                            this.reco = this.signatories[6]
                           this.recopost = this.designations[6]
                           console.log('mamjo')
                        }

                           if (this.leaveForms.appby == 20 || this.leaveForms.appby == null){
                           this.rd = 'RODANTE B. FELINA'
                           this.rdpos = 'OIC, REGIONAL DIRECTOR'
                           } else if (this.leaveForms.appby == 21) {
                               this.rd = this.signatories[0]; // "JANICE B. FUROG"
                               this.rdpos = this.designations[0]; // "Chief, MMD"
                           } else if (this.leaveForms.appby == 15) {
                               this.rd = this.signatories[5]; // "LIBERTY B. DAITIA"
                               this.rdpos = this.designations[5]; // "CAO"
                           } else if (this.leaveForms.appby == 45) {
                               this.rd = this.signatories[2]; // "OSIN A. SINSUAT JR."
                               this.rdpos = this.designations[2]; // "Chief, GD"
                           } else if (this.leaveForms.appby == 48) {
                               this.rd = this.signatories[3]; // "ALVIN M. VILLANUEVA"
                               this.rdpos = this.designations[3]; // "Chief, MSESDD"
                           }
                       
                   } else if (this.division == 4) {
                       {
                           this.reco = this.signatories[3]
                           this.recopost = this.designations[3]
                           if (this.leaveForms.appby == 20 || this.leaveForms.appby == null){
                           this.rd = 'RODANTE B. FELINA'
                           this.rdpos = 'OIC, REGIONAL DIRECTOR'
                           } else if (this.leaveForms.appby == 21) {
                               this.rd = this.signatories[0]; // "JANICE B. FUROG"
                               this.rdpos = this.designations[0]; // "Chief, MMD"
                           } else if (this.leaveForms.appby == 15) {
                               this.rd = this.signatories[5]; // "LIBERTY B. DAITIA"
                               this.rdpos = this.designations[5]; // "CAO"
                           } else if (this.leaveForms.appby == 45) {
                               this.rd = this.signatories[2]; // "OSIN A. SINSUAT JR."
                               this.rdpos = this.designations[2]; // "Chief, GD"
                           } else if (this.leaveForms.appby == 48) {
                               this.rd = this.signatories[3]; // "ALVIN M. VILLANUEVA"
                               this.rdpos = this.designations[3]; // "Chief, MSESDD"
                           }
                       }
                   } else if (this.division == 5) {
                       {
                           this.reco = ''
                           this.recopost = ''
                           if (this.leaveForms.appby == 20 || this.leaveForms.appby == null){
                           this.rd = 'RODANTE B. FELINA'
                           this.rdpos = 'OIC, REGIONAL DIRECTOR'
                           } else if (this.leaveForms.appby == 21) {
                               this.rd = this.signatories[0]; // "JANICE B. FUROG"
                               this.rdpos = this.designations[0]; // "Chief, MMD"
                           } else if (this.leaveForms.appby == 15) {
                               this.rd = this.signatories[5]; // "LIBERTY B. DAITIA"
                               this.rdpos = this.designations[5]; // "CAO"
                           } else if (this.leaveForms.appby == 45) {
                               this.rd = this.signatories[2]; // "OSIN A. SINSUAT JR."
                               this.rdpos = this.designations[2]; // "Chief, GD"
                           } else if (this.leaveForms.appby == 48) {
                               this.rd = this.signatories[3]; // "ALVIN M. VILLANUEVA"
                               this.rdpos = this.designations[3]; // "Chief, MSESDD"
                           }
                       }
                   } else {
                       this.reco = ''
                       this.recopost = ''
                       this.rd = ''
                       this.rdpos = ''
                   }
                   

            this.signature3 =`${API_BASE_URL}`+"/storage/"+`${this.accounts.find(acc=>acc.name_id==this.name_id).signature}`
            this.signature2 = this.leaveForms.certification ?  `${API_BASE_URL}`+"/storage/"+`${this.leaveForms.certification}` : null
            this.signature1 = this.leaveForms.recommendation ? `${API_BASE_URL}`+"/storage/"+`${this.leaveForms.recommendation}` : null
            this.signature = this.leaveForms.appsig ? `${API_BASE_URL}`+"/storage/"+`${this.leaveForms.appsig}` : null
            
            this.salary = this.leaveForms.applicant
            this.datetoday =this.trimDate(this.leaveForms.date)
            this.dayszz = this.leaveForms.days
            this.dateszz = this.leaveForms.dates

            if (this.leaveForms.commutation == "Not Requested"){
                this.commutationLeavetype = [1];
            }else if (this.leaveForms.commutation == "Requested"){
                this.commutationLeavetype = [2];
            }


            this.leavecredits = this.leaveForms.asof
            this.totalvacation = this.leaveForms.tevl
            this.totalsick = this.leaveForms.tesl
            this.lessvacation = this.leaveForms.ltavl
            this.lesssick = this.leaveForms.ltasl
            this.balancevacation = this.leaveForms.bvl
            this.balancesick = this.leaveForms.vsl
            this.withpay = this.leaveForms.dayswpay
            this.withoutpay = this.leaveForms.dayswopay
            this.othersSpecify = this.leaveForms.others

            if(this.leaveForms.reco == "1"){
                this.recommendationLeavetype.push(1);
            }else if(this.leaveForms.reco == "2"){
                this.recommendationLeavetype.push(2);
                this.text = this.leaveForms.recodesc
            }

            if (this.leaveForms.disapproved){
                this.text2 = this.leaveForms.disapproved
            }

            const nameId = this.leaveForms.name_id
            const foundName = this.names.find(name => name.name_id === nameId);
                   if (foundName) {
                       this.name = foundName;
                       this.nameLoaded = true;
                   } else {
                       // Handle case where name is not found
                   }

            if (this.leaveForms.type == 'Vacation Leave'){
                this.selectedLeavetype = [0];
            }else if (this.leaveForms.type == 'Mandatory/Forced Leave'){
                this.selectedLeavetype = [1];
            }else if (this.leaveForms.type == 'Sick Leave'){
                this.selectedLeavetype = [2];
            }else if (this.leaveForms.type == 'Maternity Leave'){
                this.selectedLeavetype = [3];
            }else if (this.leaveForms.type == 'Paternity Leave'){
                this.selectedLeavetype = [4];
            }else if (this.leaveForms.type == 'Special Privilege Leave'){
                this.selectedLeavetype = [5];
            }else if (this.leaveForms.type == 'Solo Parent Leave'){
                this.selectedLeavetype = [6];
            }else if (this.leaveForms.type == 'Study Leave'){
                this.selectedLeavetype = [7];
            }else if (this.leaveForms.type == '10-Day VAWC Leave'){
                this.selectedLeavetype = [8];
            }else if (this.leaveForms.type == 'Rehabilitation Privilege'){
                this.selectedLeavetype = [9];
            }else if (this.leaveForms.type == 'Special Leave Benefits for Women'){
                this.selectedLeavetype = [10];
            }else if (this.leaveForms.type == 'Special Emergency(Calamity) Leave'){
                this.selectedLeavetype = [11];
            }else if (this.leaveForms.type == 'Adoption Leave Leave'){
                this.selectedLeavetype = [12];
            }else{
                
            }



            if (this.leaveForms.detail.startsWith('Within the Philippines,')) {
                if (this.selectedLeavetype.includes(0) || this.selectedLeavetype.includes(5)) {
                    this.vacationleavedetails.push(1);
                    this.vacation1 = this.leaveForms.detail.replace('Within the Philippines,', '').trim();
                    return 'Within the Philippines, ' + this.vacation1;
                }
            } else if (this.leaveForms.detail.startsWith('Abroad (Specify),')) {
                if (this.selectedLeavetype.includes(0) || this.selectedLeavetype.includes(5)) {
                    this.vacationleavedetails.push(2);
                    this.vacation2 = this.leaveForms.detail.replace('Abroad (Specify),', '').trim();
                    return 'Abroad(Specify), ' + this.vacation2;
                }
            } else if (this.leaveForms.detail.startsWith('In Hospital (Specify Illness),')) {
                if (this.selectedLeavetype.includes(2)) {
                    this.sickleavedetails.push(1);
                    this.sick1 = this.leaveForms.detail.replace('In Hospital (Specify Illness),', '').trim();
                    return 'In Hospital (Specify Illness), ' + this.sick1;
                }
            } else if (this.leaveForms.detail.startsWith('Out Patient (Specify Illness),')) {
                if (this.selectedLeavetype.includes(2)) {
                    this.sickleavedetails.push(2);
                    this.sick2 = this.leaveForms.detail.replace('Out Patient (Specify Illness),', '').trim();
                    return 'Out Patient (Specify Illness), ' + this.sick2;
                }
            } else if (this.leaveForms.detail.startsWith(`Completion of Master's Degree,`)) {
                if (this.selectedLeavetype.includes(7)) {
                    this.studyleavedetails.push(1);
                    this.otherPurpose = this.leaveForms.detail.replace(`Completion of Master's Degree,`, '').trim();
                    return `Completion of Master's Degree, ` + this.otherPurpose;
                }
            } else if (this.leaveForms.detail.startsWith('BAR/Board Examination Review Other,')) {
                if (this.selectedLeavetype.includes(7)) {
                    this.studyleavedetails.push(2);
                    this.otherPurpose = this.leaveForms.detail.replace('BAR/Board Examination Review Other,', '').trim();
                    return 'BAR/Board Examination Review Other, ' + this.otherPurpose;
                }
            } else if (this.leaveForms.detail === this.leaveforwoman) {
                if (this.selectedLeavetype.includes(10)) {
                    return this.leaveforwoman;
                }
            } else if (this.leaveForms.detail === "Monetization of Leave Credits") {
                this.terminalleave = [0];
                this.monetization = [0];
                if (this.monetization.includes(1)) {
                     // Example push
                    return 'Monetization of Leave Credits';
                }
            } else if (this.leaveForms.detail === 'Terminal Leave') {
                this.terminalleave = [1];
                this.monetization = [1];
                if (this.monetization.includes(2)) {
                    // Example push
                    return 'Terminal Leave';
                }
            }

            

          }
          
          
        })
        .catch(error => {
          console.error('Error fetching leave forms:', error);
        });
    },
    isSignatureValid(item) {
        console.log(item)
      const filename = item.split('/').pop(); // Extract the filename
      console.log(filename)
      return filename === 'urAs0SbQ7kw0y6LI4B9dyOpQxKI8cL4q4aEbsFSh.png'; // Check if it matches your condition
    },
    comparePosition() {
      if (this.leaveForms && this.positions.length > 0) {
        const leaveForm = this.leaveForms;
        const positionsh = this.positions[leaveForm.position_id-1];
        this.position = positionsh.position_name
      }
      return null;
    },
    trimDate(datetime) {
      if (datetime) {
        return datetime.split(' ')[0];
      }
      return '';
    },

       updateRows() {
           this.rows = this.text ? this.text.length / 63 + 1 : 1
       },
       updateRows2() {
           this.rows2 = this.text2 ? this.text2.length / 63 + 1 : 1
       },
       handleDateChange() {
           const selectedDate = new Date(this.selectedDate);
           if (!this.startDate) {
               this.startDate = selectedDate;
               this.isSingleDate = false; // Switch to date range mode
           } else if (this.isSingleDate) {
               this.startDate = selectedDate;
               this.endDate = null;
           } else {
               if (selectedDate < this.startDate) {
                   this.startDate = selectedDate;
                   this.endDate = null;
               } else if (selectedDate > this.startDate) {
                   this.endDate = selectedDate;
                   this.weekdaysCount = this.calculateWeekdays(this.startDate, this.endDate);
               } else {
                   this.startDate = selectedDate;
                   this.endDate = null;
                   this.weekdaysCount = 0;
               }
           }
           if (this.startDate && this.endDate) {
               this.weekdaysCount = this.calculateWeekdays(this.startDate, this.endDate);
           } else {
               this.weekdaysCount = 1; // Reset to 1 for a single date or incomplete range
           }
       },
       calculateWeekdays(startDate, endDate) {
           let count = 0;
           let currentDate = new Date(startDate);
           endDate = new Date(endDate);
           while (currentDate <= endDate) {
               const dayOfWeek = currentDate.getDay();
               if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                   count++;
               }
               currentDate.setDate(currentDate.getDate() + 1);
           }
           return count;
       },
       formattedDate(dateTime) {
      return dateTime.split(' ')[0];
    },
   },

   computed: {
    
    formattedSalary: {
      get() {
        // Add commas to the salary value
        return this.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      set(newValue) {
        // Remove commas when the value is changed manually
        this.salary = parseInt(newValue.replace(/,/g, ""), 10);
      }
    },

       weekdaysCountWithSuffix: {
           get() {
               return `${this.weekdaysCount} ${this.weekdaysCount === 1 ? 'Day' : 'Days'}`;
           },
           set(value) {
               const count = parseInt(value, 10);
               if (!isNaN(count)) {
                   this.weekdaysCount = count;
               }
           }
       },


       formattedDate() {
           if (!this.selectedDate) return '';
           const date = new Date(this.selectedDate);
           return `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
       },
       formattedStartDate() {
           if (!this.startDate) return '';
           const startDate = new Date(this.startDate);
           const endDate = this.endDate ? new Date(this.endDate) : null;

           if (endDate && startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
               return `${startDate.toLocaleString('en-US', { month: 'long' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
           } else {
               return `${startDate.toLocaleString('en-US', { month: 'long' })} ${startDate.getDate()}, ${startDate.getFullYear()}`;
           }
       },

       formattedDateRange() {
           if (!this.startDate) return '';

           const startDate = new Date(this.startDate);
           const endDate = this.endDate ? new Date(this.endDate) : null;

           const formattedStart = `${startDate.toLocaleString('en-US', { month: 'long' })} ${startDate.getDate()}, ${startDate.getFullYear()}`;

           if (endDate) {
               if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
                   return `${startDate.toLocaleString('en-US', { month: 'long' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
               } else {
                   const formattedEnd = `${endDate.toLocaleString('en-US', { month: 'long' })} ${endDate.getDate()}, ${endDate.getFullYear()}`;
                   return `${formattedStart} - ${formattedEnd}`;
               }
           } else {
               return formattedStart;
           }
       }
   },
};


</script>

<style>
.leavebuttonss {
 display: flex;
 position: relative;
 flex-direction: row;
 height: 40px;
 justify-content: space-around;
 margin-top: 8px;

}
.leavebutton {
 border-radius: 10px;
 width: 20%;
 font-weight: bold;
 font-size: 20px;
 
}
.containerlist {
 
   position: relative;
   left: 4px;
   top: 10px;
   margin-right: 8px;
   cursor: default;

}

.containerlist input {
   display: none;
}

.containerlist svg {
   overflow: visible;
   height: 12px;
   width: 13px;
}



.containeremployee {
   
   display: flex;
   justify-content: center;

}

.containeremployee input {
   display: none;
}

.containeremployee svg {
   overflow: visible;
   height: 15px;
   width: 15px;
}

.path {

   fill: none;
   stroke: black;
   stroke-width: 6;
   stroke-linecap: round;
   stroke-linejoin: round;
   transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
   stroke-dasharray: 241 9999999;
   stroke-dashoffset: 0;
}

.containeremployee input:checked~svg .path,
.containerlist input:checked~svg .path {
   stroke-dasharray: 70.5096664428711 9999999;
   stroke-dashoffset: -262.2723388671875;
}

.a4-containerz {
   position: relative;
   width: 210mm;
   height: 296mm;
   margin: 0 auto;
   padding: 10px;
   border: 1px solid #ccc;
}

.a4-contentz {
   height: 295mm;
}

.pic1 {
   height: 80px;
   width: auto;
   margin: auto;
}

.pic2 {
   height: 100px;
   width: auto;
   margin: auto;
}

.grid-container {
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   grid-gap: 0px;
   width: 350px;
   margin: auto;
}

.grid-item {
   padding: 2px;
   border: 1px solid #ccc;
   text-align: left;
}

.leavecredits {
   height: 10px;
   width: 110px;
   font-size: 9px;
   border: none;
   outline: none;
   position: relative;
   top: 2px;
}

.cuearez{
  display: flex; flex-direction: column; position: absolute; bottom: 0; right: 0;
}

.bigzz{
  height: 100px; width: 100px; margin-left: 145px; margin-bottom: 5px; margin-top: -57px; position: absolute;
}
.centzz{
  height: 30px; width: 30px;  margin-top: -18px; margin-left: 185px; position: absolute; opacity: 50%;
}
.qrquotez {
    margin-top: 55px; margin-right: 10px;margin-bottom: 20px;
}

@media print {
    .leverage{
        display: none !important;
    }
    .qrquote {
    margin-top: 50px;
    }
    .a4-containerz {
    border: none;
    height: calc(100vh - 40px); /* Adjust height to fit one page */
    max-height: 100%;
    overflow: hidden; /* Prevent content overflow */
    position: absolute; /* Allows for precise positioning */
    top: 0px; /* Move the container down by 20mm */
    opacity: 100%;
    margin-top: 0px;
  }
  @page {
    size: A4;
    margin: 5%;
  }
  .a4-photo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    /* Place the photo behind other content */
  }
  .signatizz{
    z-index: 999;
  }

}



</style>