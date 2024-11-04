<template>
  <div class="note" v-if="certif">
    <div class="title-bar">
      <div class="title">LEAVE CREDITS</div>
      <div class="close-icon" @click="certification">X</div>
    </div>

    <div class="content">
      <div style="border: 2px solid black;margin-top: 2px;font-size: 10px;">
        <p style="margin-left: 10px;">7.A CERTIFICATION OF LEAVE CREDITS</p>
        <div style="display: flex;flex-direction: row; justify-content: center; margin-left: 90px">
          <p>As of</p>
          <input
            style="height: 10px; width: 230px; border: none; border-bottom: 1.5px solid black;outline: none; font-size: 10px; margin-top: 7px; margin-left: 3px"
            v-model="leavecredits">
        </div>
        <div>
          <div class="grid-container">
            <div class="grid-item"></div>
            <div class="grid-item">Vacation Leave</div>
            <div class="grid-item">Sick Leave</div>
            <div class="grid-item">Total Earned</div>
            <div class="grid-item">
              <input type="text" class="leavecredits" v-model="totalvacation" @input="nonumber($event, 'totalvacation')">
            </div>
            <div class="grid-item">
              <input type="text" class="leavecredits" v-model="totalsick" @input="nonumber($event, 'totalsick')">
            </div>
            <div class="grid-item">Less this Application</div>
            <div class="grid-item">
              <input type="text" class="leavecredits" v-model="lessvacation" @input="nonumber($event, 'lessvacation')">
            </div>
            <div class="grid-item">
              <input type="text" class="leavecredits" v-model="lesssick" @input="nonumber($event, 'lesssick')">
            </div>
            <div class="grid-item">Balance</div>
            <div class="grid-item">
              <input type="text" class="leavecredits" v-model="balancevacation"
                @input="nonumber($event, 'balancevacation')">
            </div>
            <div class="grid-item">
              <input type="text" class="leavecredits" v-model="balancesick" @input="nonumber($event, 'balancesick')">
            </div>
          </div>
        </div>
        <div style="margin-left: 20px; margin-top: 10px;">
          <div style="display: flex; flex-direction: row; margin-top: -5px;">
            <input readonly
              style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
              v-model="withpay">
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
        <!-- <p
                            style="text-align: center; margin-top: 15px; border: none; outline: none; width: auto; z-index: 9; font-size: 10px; font-weight: bold;">
                            {{ secch }}
                        </p>
                        <p
                            style="height: 10px; width: 350px; margin-top: -19px; z-index: 1; border: none; border-bottom: 1px solid black;outline: none; margin-left: 20px; font-size: 10px">
                        </p>
                        <p style="text-align: center; position: relative; top:-6px; font-size:9px;">{{ secchpos }}</p> -->
      </div>

      <div class="butokz">
        <button @click="postCertification"
        :disabled="this.leavecredits == '' || this.totalvacation == '' || this.totalsick == '' || this.lessvacation == '' || this.lesssick == '' || this.balancevacation == '' || this.balancesick == '' "
        :style="{ cursor:this.leavecredits == '' || this.totalvacation == '' || this.totalsick == '' || this.lessvacation == '' || this.lesssick == '' || this.balancevacation == '' || this.balancesick == '' ? 'not-allowed' : 'pointer' }"
         >Save</button>
        <button @click="certification(certinum)">Cancel</button>
      </div>
    </div>
  </div>



  <div class="note" v-if="recoms">
    <div class="title-bar">
      <div class="title">Recommendation</div>
      <div class="close-icon" @click="recommendation">X</div>
    </div>

    <div class="content">
      <div style="border: 2px solid black;margin-top: 2px;font-size: 10px;margin-left: -2px;">
        <p style="margin-left: 10px;">7.B RECOMMENDATION</p>
        <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
          <label class="containerlist">
            <input type="checkbox" v-model="recommendationLeavetype" :value="recommendationtype[0]">
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
            <input type="checkbox" v-model="recommendationLeavetype" :value="recommendationtype[1]">
            <svg viewBox="0 0 64 64" height="2em" width="2em">
              <path
                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                pathLength="575.0541381835938" class="path"></path>
            </svg>
          </label>
          <p>For disapproval due to:</p>
        </div>

        <textarea @keydown.enter.prevent v-model="text" id="myTextarea" :rows="rows"
          :class="{ 'not': !recommendationLeavetype.includes(2) }" :disabled="!recommendationLeavetype.includes(2)"
          style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 350px; margin-left: 20px; font-size: 10px; text-decoration: underline;"></textarea>
        <!-- <p style="text-align: center;margin-bottom: -20px;z-index: 9;">{{ reco }}</p>

        <p
          style="height: 10px; width: 350px; z-index: 1; border: none; border-bottom: 1px solid black;outline: none; margin-left: 20px; font-size: 10px; color: transparent;">
        </p>
        <p style="text-align: center">{{ recopost }}</p> -->
      </div>

      <div class="butokz">
        <button @click="postRecommendation"
          :disabled="recommendationLeavetype < 1 || recommendationLeavetype.length === 0"
          :style="{ cursor: recommendationLeavetype < 1 || recommendationLeavetype.length === 0 ? 'not-allowed' : 'pointer' }">{{
            recommendationLeavetype == 2 ? 'disapprove' : 'approve' }}</button>
        <button @click="recommendation(reconum)">Cancel</button>
      </div>
    </div>
  </div>





  <div class="note" v-if="appr">
    <div class="title-bar">
      <div class="title">Approval</div>
      <div class="close-icon" @click="approve">X</div>
    </div>

    <div class="content">
      <div style="border: 2px solid black;margin-top: 2px;font-size: 10px;margin-left: -2px;">
        <p style="margin-left: 10px;">APPROVAL</p>
        <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
          <label class="containerlist">
            <input type="checkbox" v-model="approveLeavetype" :value="approvetype[0]">
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
            <input type="checkbox" v-model="approveLeavetype" :value="approvetype[1]">
            <svg viewBox="0 0 64 64" height="2em" width="2em">
              <path
                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                pathLength="575.0541381835938" class="path"></path>
            </svg>
          </label>
          <p>For disapproval due to:</p>
        </div>

        <textarea @keydown.enter.prevent v-model="text2" id="myTextarea" :rows="rows"
          :class="{ 'not': !approveLeavetype.includes(2) }" :disabled="!approveLeavetype.includes(2)"
          style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 350px; margin-left: 20px; font-size: 10px; text-decoration: underline;"></textarea>
        <!-- <p style="text-align: center;margin-bottom: -20px;z-index: 9;">{{ reco }}</p>

        <p
          style="height: 10px; width: 350px; z-index: 1; border: none; border-bottom: 1px solid black;outline: none; margin-left: 20px; font-size: 10px; color: transparent;">
        </p>
        <p style="text-align: center">{{ recopost }}</p> -->
      </div>

      <div class="butokz">
        <button @click="postApproval" :disabled="approveLeavetype < 1 || approveLeavetype.length === 0"
          :style="{ cursor: approveLeavetype < 1 || approveLeavetype.length === 0 ? 'not-allowed' : 'pointer' }">{{
            approveLeavetype == 2 ? 'disapprove' : 'approve' }}</button>
        <button @click="approve(apronum)">Cancel</button>
      </div>
    </div>
  </div>





  <div class="note" v-if="viewNote">
    <div class="title-bar">
      <div class="title">View note</div>
    </div>

    <!-- Content -->
    <div class="content">
      <textarea v-model="noteText" rows="3"></textarea>
      <div class="butokz">
        <button @click="postNote" v-if="siga || siga1 || acc.name_id == 76">Save</button>
        <button @click="closeNote">Close</button>
      </div>
    </div>
  </div>

  <div style="display: flex; flex-direction: column;">

    <h2 style="display: flex; flex-direction: column; align-items: center;" class="hist">History</h2>
    <div v-if="load" class="loadings">
      <img src='../assets/loading.gif' width="auto" height="100px" />
    </div>
    <div style="display: flex; flex-direction: column; align-items: center;" v-if="otp">
      <otpz />
    </div>
    <div style="display: flex; flex-direction: column; margin-top: 0px;">

      <div class="search"
        style="display: flex; flex-direction: row; justify-content: space-between; align-items: end; margin-top: 15px; margin-bottom: 10px; height: 35px; ">
        <div v-if="mawala"
          style="display: flex; border: 2px solid black; border-radius: 5px; align-items: center; height: 30px;position: relative;">
          <img class="`imgsearch" style=" height: 20px; width:20px; position: relative; padding-left: 5px;"
            src="../assets/search.png">
          <input class="pholder" type="text" v-model="searchQuery" placeholder="Search TO number or Name">
        </div>

      </div>
    </div>

    <div v-if="mawala" class="outer">
      <div class="scrollable-table">
        <table>
          <thead>
            <tr>
              <th style="text-align: center;">Name </th>
              <th style="text-align: center;">Type of Leave </th>
              <th style="text-align: center;">Leave Details </th>
              <th style="text-align: center;">Duration</th>
              <th style="text-align: center;">Commutation</th>
              <th style="text-align: center;">Date of filing</th>
              <!-- <th style="text-align: center;">Status</th> -->
              <th style="text-align: center;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in reversedFormData" :key="item.id">
              <td>{{ getName(item.name_id) }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.detail }}{{ item.description }}</td>
              <td>{{ item.dates }} ({{ item.days }})</td>
              <td>{{ item.commutation }}</td>
              <td>{{ formattedDate(item.date) }}</td>
              <!-- <td v-if="item.initial === null" style="color: red;">
                <img src="../assets/close.png" style="height: 10px; width: 10px;">
                For Initial
              </td>
              <td v-else style="color: green; ">

                <p v-if="![39, 2, 3, 8, 42, 34, 29, 36, 48, 5, 47, 15, 45, 21, 52, 51, 13, 10, 37, 62, 53, 75, 4, 56, 58, 55, 60, 59, 20].includes(item.name_id) && item.initial !== null"
                  style="color: green; margin-top: -8px;margin-bottom: -1px">
                  <img src="../assets/check.png" style="height: 10px; width: 10px;">

                </p>


                <p v-if="item.note === null" style="color: red; margin-top: 1px; margin-bottom: -15px">
                  <img src="../assets/close.png" style="height: 10px; width: 10px;">
                  To be Noted
                </p>
                <p v-else style="color: green; margin-top: 2px; margin-bottom: -15px;">
                  <img src="../assets/check.png" style="height: 10px; width: 10px;">
                  Noted
                </p>

                <p v-if="(item.signature1 === null && item.note !== null && ![15, 20, 21, 45, 48, 13, 10, 37, 62, 53, 75, 56, 58, 55, 60, 59].includes(item.name_id)) || (item.signature1 === null && item.note !== null && [15, 21, 45, 48].includes(item.name_id) && item.intervals == 1 && aor == 1)"
                  style="color: red; margin-bottom: -15px;">
                  <img src="../assets/close.png" style="height: 10px; width: 10px;">
                  For Recommendation
                </p>

                <p v-if="(item.note !== null && item.signature1 !== null && ![15, 20, 21, 45, 48, 13, 10, 37, 62, 53, 75, 56, 58, 55, 60, 59].includes(item.name_id)) || (item.signature1 !== null && item.note !== null && [15, 21, 45, 48].includes(item.name_id) && item.intervals == 1)"
                  style="color: green; margin-bottom: -15px;">
                  <img src="../assets/check.png" style="height: 10px; width: 10px;">
                  Recommended
                </p>


                <p v-if="(item.signature2 === null && item.signature1 !== null || (([15, 20, 21, 45, 48, 13, 10, 37, 62, 53, 75, 56, 58, 55, 60, 59].includes(item.name_id) && item.signature2 === null && item.note !== null)))"
                  style="color: red;">
                  <img src="../assets/close.png" style="height: 10px; width: 10px;">
                  For Approval
                </p>
                <p v-if="item.signature2 !== null && item.signature1 !== null && item.note !== null || ([15, 20, 21, 45, 48, 13, 10, 37, 62, 53, 75, 56, 58, 55, 60, 59].includes(item.name_id) && item.signature2 !== null)"
                  style="color: green;">
                  <img src="../assets/check.png" style="height: 10px; width: 10px;">
                  Approved
                </p>
              </td> -->

              <td style="display: flex; justify-content: center;">
                <button 
                  v-if="selectedTravelOrderId != item.leaveform_id"
                  @click="openPDF(item.leaveform_id)">PDF</button>
                <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.leaveform_id" @click="close"
                  style="width: 40px; height: 40px; cursor: pointer;" />
              </td>

              <td style="display: flex; justify-content: center;" v-if="acc.name_id == 24 || acc.name_id == 2">
                <button 
                  @click="certification(item.leaveform_id)"
                  :style="{
                    color: certinum === item.leaveform_id ? 'white' : 'black',
                    backgroundColor: certinum === item.leaveform_id ? 'black' : 'white',
                    padding: '10px 20px',
                    cursor: 'pointer'
                  }">
                  Certification
                </button>
              </td>
              <td style="display: flex; justify-content: center;" v-if="siga">
                <button 
                  @click="recommendation(item.leaveform_id)"
                  :style="{
                    color: reconum === item.leaveform_id ? 'white' : 'black',
                    backgroundColor: reconum === item.leaveform_id ? 'black' : 'white',
                    padding: '10px 20px',
                    cursor: 'pointer'
                  }">
                  Recommend
                </button>
              </td>
              <td style="display: flex; justify-content: center;" v-if="siga1">
                <button 
                  @click="approve(item.leaveform_id)"
                  :style="{
                    color: apronum === item.leaveform_id ? 'white' : 'black',
                    backgroundColor: apronum === item.leaveform_id ? 'black' : 'white',
                    padding: '10px 20px',
                    cursor: 'pointer'
                  }">
                  Approve
                </button>
              </td>


              <!-- <td v-if="siga && item.note !== null && item.signature1 == null && item.name_id !== acc.name_id"
                    style="display: flex; justify-content: center;"><button
                      @click="signature1(item.leaveform_id)">Recommend</button></td> -->

              <!-- <td
                    v-if="acc.name_id == 20 && item.note !== null && item.signature1 == null && item.aor == 1 && [15, 21, 45, 48].includes(item.name_id)"
                    style="display: flex; justify-content: center;"><button
                      @click="signature11(item.leaveform_id, item.name_id)">Recommend</button></td>
  
                  <td
                    v-if="((siga1 && item.note !== null) && ((item.signature1 !== null && item.division_id !== 5 && item.note !== null) || (item.signature1 === null && item.division_id === 5 && item.note !== null)) && item.name_id !== acc.name_id)"
                    style="display: flex; justify-content: center;"><button
                      @click="signature2(item.leaveform_id)">Approve</button></td> -->


              <!-- <td
                    v-if="isSectionChief(acc.name_id) && selectedTravelOrderId != item.leaveform_id && item.initial === null"
                    style="display: flex; justify-content: center;">
                    <button @click="initialize(item.leaveform_id)">
                      Initial
                    </button>
                    <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.leaveform_id" @click="close"
                      style="width: 40px; height: 40px; cursor: pointer;" />
                  </td> -->
            </tr>
          </tbody>
        </table>
        <h1 style="text-align: center; margin-bottom: 0px;" v-if="reversedFormData.length == 0">NO MATCH FOUND</h1>
      </div>
    </div>
  </div>
  <div v-show="selectedTravelOrderId" class="prent full-screen">
    <div class="buttons">
      <button @click="printzz">Download as PDF</button>
      <button @click="close">Close PDF</button>
    </div>
    <pdf :leaveform_id="selectedTravelOrderId"></pdf>
  </div>
</template>
  
<script>
import axios from 'axios';
import pdf from './leavepdfview.vue'
import otpz from '../components/otp.vue';
import { API_BASE_URL } from '../config'
import { useAuthStore } from '../store/auth';

export default {
  provide() {
    return {
      close: this.close,
    };
  },
  components: {
    pdf,
    otpz
  },
  mounted() {
    this.fetchAccounts();
    this.fetchEmployees();
    this.fetchNames();
  },
  data() {
    return {
      sectionChiefIds: [39, 2, 3, 8, 42, 34, 29, 36, 48, 5, 47],
      members: [
        [23, 25, 35, 70, 64],
        [30, 7, 26, 18, 67, 49, 24],
        [43, 40],
        [32, 50, 71],
        [33, 6],
        [41, 46, 1, 28],
        [38, 9, 65],
        [44, 22, 61, 27],
        [31, 11],
        [16, 63, 19],
        [12, 14, 72, 73]
      ],
      yearToday: new Date().getFullYear(),
      formData: [],
      names: {},
      employees: {},
      selectedTravelOrderId: 0,
      accountId: localStorage.getItem('accountId'),
      acc: [],
      imageUrl: '',
      siga: '',
      siga1: '',
      otp: false,
      verifiedOTPs: localStorage.getItem('verifiedOTPs'),
      load: true,
      mawala: false,
      certif: false,
      viewNote: false,
      notenum: 0,
      initnum: 0,
      noteText: '',
      sub: 0,
      bus: 0,
      searchQuery: '',
      csvformdata: [],
      recoms: false,
      recommendationtype: [1, 2],
      approvetype: [1, 2],
      recommendationLeavetype: [],
      approveLeavetype: [],
      totalvacation: '',
      totalsick: '',
      lessvacation: '',
      lesssick: '',
      balancevacation: '',
      balancesick: '',
      text: '',
      rows: 1,
      leavecredits: '',
      appr: false,
      text2: '',
      certinum: 0,
      reconum: 0,
      apronum: 0,
      withpay: '',
      withoutpay: '',
      othersSpecify: ''

    };
  },
  created() {
    window.addEventListener('storage', this.updateVerifiedOTPs);

  },
  destroyed() {
    window.removeEventListener('storage', this.updateVerifiedOTPs);
  },


  methods: {

    nonumber(event, field) {
      this[field] = event.target.value.replace(/[^\d.+-]/g, '');
    },

    updateRows() {
      this.rows = this.text.length / 63 + 1
    },
    formattedDate(dateTime) {
      return dateTime.split(' ')[0];
    },
    printzz() {
      window.print();
    },
    isSectionChief(name_id) {
      return this.sectionChiefIds.includes(name_id);
    },

    postCertification() {
      const formData = new FormData();
      formData.append('asof', '' + this.leavecredits); // Replace with your actual data properties
      formData.append('tevl', '' + this.totalvacation);
      formData.append('tesl', '' + this.totalsick);
      formData.append('ltavl', '' + this.lessvacation);
      formData.append('ltasl', '' + this.lesssick);
      formData.append('bvl', '' + this.balancevacation);
      formData.append('vsl', '' + this.balancesick);
      formData.append('dayswpay', this.withpay);
      formData.append('dayswopay', this.withoutpay);
      formData.append('others', '' + this.othersSpecify);
      formData.append('certification', 'this.certification');


      axios.post(`${API_BASE_URL}/updateleave_form/${this.certinum}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        
          this.fetchData();
          this.leavecredits = ''
          this.totalvacation = ''
          this.totalsick = ''
          this.lessvacation = ''
          this.lesssick = ''
          this.balancevacation = ''
          this.balancesick = ''
          this.withpay = ''
          this.withoutpay = ''
          this.othersSpecify = ''
          this.certif = false
        
      }).catch(error => {
        console.error('Error:', error);
      });
    },

    // Method to post recommendation
    postRecommendation() {
      const formData = new FormData();
      formData.append('reco', this.recommendationLeavetype);
      formData.append('recodesc', this.text);
      formData.append('recommendation', this.recommendation);

      axios.post(`${API_BASE_URL}/updateleave_form/${this.reconum}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        
        this.fetchData();
        this.recommendationLeavetype.length = 0
        this.text = ''
        this.recoms = false
        
      }).catch(error => {
        console.error('Error:', error);
      });
    },

    // Method to post approval
    postApproval() {
      const formData = new FormData();
      formData.append('disapproved', this.text2);
      formData.append('approval', this.approval);

      axios.post(`${API_BASE_URL}/updateleave_form/${this.apronum}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {

        this.fetchData();
        this.text2 = ''
        this.approveLeavetype.length = 0
        this.appr = false
      }).catch(error => {
        console.error('Error:', error);
      });
    },

    async signature1(form_id) {

      this.otp = true;

      await this.waitForVerifiedOTPs();
      this.otp = false;

      const formData = new FormData();
      formData.append('signature1', this.acc.signature);

      axios.post(`${API_BASE_URL}/update_form/${form_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.fetchData();
        this.selectedTravelOrderId = 0;
        useAuthStore().updateVerifiedOTPs('false');
        localStorage.setItem('verifiedOTPs', 'false');
        this.otp = false;
        window.location.reload();
      }).catch(error => {
        console.error('Error:', error);
      });
    },

    async signature2(form_id) {
      this.otp = true;
      await this.waitForVerifiedOTPs();
      this.otp = false;

      const formData = new FormData();
      formData.append('signature2', this.acc.signature);
      formData.append('sname', this.sub.name_id);
      formData.append('sdiv', this.sub.division_id);


      axios.post(`${API_BASE_URL}/update_form/${form_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.fetchData();
        this.selectedTravelOrderId = 0;
        useAuthStore().updateVerifiedOTPs('false');
        localStorage.setItem('verifiedOTPs', 'false');
        this.otp = false;
        window.location.reload()
      }).catch(error => {
        console.error('Error:', error);
      });
    },

    async waitForVerifiedOTPs() {
      while (this.verifiedOTPs == 'false') {
        await new Promise(resolve => setTimeout(resolve, 1000), this.verifiedOTPs = localStorage.getItem('verifiedOTPs'));
      }
    },

    // padWithZeroes(travel_order_id) {
    //   const idString = travel_order_id.toString();
    //   if (idString.length < 4) {
    //     return '0'.repeat(4 - idString.length) + idString;
    //   } else {
    //     return idString;
    //   }
    // },
    fetchAccounts() {
      axios.get(`${API_BASE_URL}/get_accounts_json`)
        .then(response => {
          this.acc = response.data.find(result => result.account_id == this.accountId);
          this.fetchData()
          if (this.acc) {
            this.imageUrl = `${API_BASE_URL}/storage/${this.acc.signature}`;
          }
          useAuthStore().updateVerifiedOTPs('false');
          localStorage.setItem('verifiedOTPs', 'false');
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },

    fetchData() {
      this.load = true
      axios.get(`${API_BASE_URL}/get_leave_json`)
        .then(response => {
          this.mawala = true;
          this.load = false
          this.sub = this.employees.find(emp => emp.name_id == this.acc.name_id)
          this.bus = this.employees.find(emp => emp.rd !== null)
          this.csvformdata = response.data

          if (this.sectionChiefIds.includes(this.acc.name_id)) {
            console.log(this.acc.name_id)
            const index = this.sectionChiefIds.indexOf(this.acc.name_id);
            console.log(index)
            const members = this.members[index];
            console.log(this.members[index])
            this.formData = response.data.filter(form => form.name_id == this.acc.name_id ||
              members.includes(form.name_id) && form.initial === null
            );
          }
          else if (this.acc.type_id == 1) {
            this.formData = response.data;
            this.siga = false
          }
          else if (this.acc.type_id == 2) {
            this.formData = response.data.filter(form => form.name_id == this.acc.name_id);
            this.siga = false
          } else if (this.bus.name_id == this.sub.name_id) {
            if (this.acc.name_id !== 20) {
              this.siga = true
            } else {
              this.siga = false
            }
            this.formData = response.data.filter(form => ((form.signature2 === null && form.signature1 !== null && form.note !== null && !(form.aor == 1 && [15, 21, 45, 48].includes(form.name_id))) || (form.division_id === 5 && form.signature2 == null && form.note !== null) || (form.division_id !== 5 && form.signature1 == null && form.note !== null && this.acc.name_id !== 20 && form.division_id == this.bus.division_id) || form.name_id == 20) || ([15, 21, 45, 48].includes(form.name_id) && form.aor == 1 && form.signature1 == null && form.intervals === 0));
            this.siga1 = true

          } else if (this.acc.type_id == 3) {
            const division_id = this.employees.find(name => name.name_id == this.acc.name_id).division_id;
            this.formData = response.data.filter(form => (form.division_id == division_id && form.signature1 === null && this.sub.name_id !== 20 && form.note !== null) || form.name_id === this.acc.name_id);
            this.siga = true
            if (this.sub.name_id == 20) {
              this.formData = response.data.filter(form => form.name_id == this.acc.name_id);
              this.siga = false
            }
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    fetchNames() {
      axios.get(`${API_BASE_URL}/get_names_json`)
        .then(response => {
          this.names = response.data;
        })
        .catch(error => {
          console.error('Error fetching names:', error);
        });
    },
    fetchEmployees() {
      axios.get(`${API_BASE_URL}/get_employees_json`)
        .then(response => {
          this.employees = response.data;
        })
        .catch(error => {
          console.error('Error fetching employeess:', error);
        });
    },
    getName(nameId) {
      const name = this.names[nameId - 1];
      if (name) {
        const { first_name, middle_init, last_name } = name;
        return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
      }
      return 'Unknown';
    },
    openPDF(travelOrderId) {
      this.selectedTravelOrderId = travelOrderId;
      useAuthStore().updateVerifiedOTPs('false');
      localStorage.setItem('verifiedOTPs', 'false');
    },
    close() {
      this.selectedTravelOrderId = 0
    },

    certification(leaveformID) {
      // this.certif = !this.certif
      if (this.certif == false && this.certinum == 0){
        this.certif = true
        this.certinum = leaveformID
      }else if (this.certif == true && this.certinum == leaveformID){
        this.certif = false
        this.certinum = 0
      }else if (this.certif == true && this.certinum !== 0){
        this.certif = true
        this.certinum = leaveformID
      }
      this.leavecredits = ''
      this.totalvacation = ''
      this.totalsick = ''
      this.lessvacation = ''
      this.lesssick = ''
      this.balancevacation = ''
      this.balancesick = ''
      this.withpay = ''
      this.withoutpay = ''
      this.othersSpecify = ''
    },

    recommendation(leaveformID) {
      // this.recoms = !this.recoms
      if (this.recoms == false && this.reconum == 0){
        this.recoms = true
        this.reconum = leaveformID
      }else if (this.recoms == true && this.reconum == leaveformID){
        this.recoms = false
        this.reconum = 0
      }else if (this.recoms == true && this.reconum !== 0){
        this.recoms = true
        this.reconum = leaveformID
      }
      this.recommendationLeavetype.length = 0
      this.text = ''
      // this.reconum = leaveformID
    },

    approve(leaveformID) {
      // this.appr = !this.appr
      if (this.appr == false && this.apronum == 0){
        this.appr = true
        this.apronum = leaveformID
      }else if (this.appr == true && this.apronum == leaveformID){
        this.appr = false
        this.apronum = 0
      }else if (this.appr == true && this.apronum !== 0){
        this.appr = true
        this.apronum = leaveformID
      }
      this.approveLeavetype.length = 0
      this.text2 = ''
      // this.apronum = leaveformID
    },

    updateVisibleItems() {
      this.visibleItems = this.formData.slice(0, 20);
    },

  },

  computed: {

    reversedFormData() {
      let data = this.formData.slice().reverse(); // Make a copy of the original data

      if (this.searchQuery !== '') {
        data = data.filter(item => {
          return String(this.padWithZeroes(item.to_num)).includes(this.searchQuery) || String(this.getName(item.name_id)).toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      }
      return data;
    },
  },


  watch: {
    text() {
      this.updateRows();
    },
    recommendationLeavetype(newValue, oldValue) {
      if (newValue.length > 1) {
        this.recommendationLeavetype = [newValue[newValue.length - 1]]
        this.text = '';
      }
    },
    approveLeavetype(newValue, oldValue) {
      if (newValue.length > 1) {
        this.approveLeavetype = [newValue[newValue.length - 1]]
        this.text = '';
      }
    },
  }
}


</script>
  
<style scoped>
.pholder {
  padding: 5px;
  border-radius: none;
  border: none;
  outline: none;
}



.Btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition-duration: .3s;
  border: 2px solid black;
  margin-bottom: 2px;
  background-color: white;

}




.sign {
  width: 100%;
  transition-duration: .3s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  left: 1px;
}


.text {
  position: absolute;
  right: 0%;
  width: 0%;
  opacity: 0;
  color: black;
  font-size: 1.2em;
  font-weight: 500;
  transition-duration: .3s;
}

.Btn:hover {
  background-color: white;
  width: 230px;
  border: 2px solid black;
  border-radius: 5px;
  transition-duration: .3s;
  position: relative;

}

.Btn:hover .text {
  opacity: 1;
  width: 70%;
  transition-duration: .3s;
  padding-right: 10px;
}


.Btn:hover .sign {
  width: 30%;
  transition-duration: .3s;
  position: relative;
  left: -15px;
}


.Btn:active {
  transform: translate(2px, 2px);
}


table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  position: sticky;
  top: -2px;
}

.scrollable-table {
  max-height: 630px;
  overflow-y: auto;
  margin: 15px;
}

.outer {
  border: 1px solid black;
  box-shadow: 0px 0px 4px black, 0px 0px 3px black inset;
  border-radius: 5px;
  width: 100%;
}


.loadings {
  top: 0;
  left: 0;
  width: fit-content;
  justify-self: center;
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
}

.loadings1 {
  height: 20px;
  width: 100%;
  text-align: center;
}

.loadings1,
.loadings2 {
  font-weight: bold;
  font-size: 20px;
}

.note {
  width: 380px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}


.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.butokz {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.close-icon {
  cursor: pointer;
  font-size: 20px;
  color: #333;
  margin-right: 10px;
}

.content {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

textarea {
  width: 100%;
  resize: vertical;
  height: 75px;
}

button {
  background-color: white;
  border: 1px solid black;
  color: black;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  width: fit-content;
}

button:hover {
  background-color: black;
  color: white;
}

@media screen and (max-width: 768px) {
  .Btn {
    margin-right: 20px;
  }

  /* Adjust the media query to target a specific screen size */
  .prent {
    /* Apply styles to takeover the screen */
    position: fixed;
    top: 0;
    left: 0;
    width: fit-content;
    height: 100%;
    /* Set height to 50% of the viewport height */
    max-height: 1000px;
    /* Set maximum height for smaller screens */
    z-index: 9999;
    /* Ensure it's above other content */
    height: 100vh;
    background-color: white;
  }

  .prent .buttons {
    display: flex;
    justify-content: space-evenly;
    margin-top: 70px;
    margin-bottom: 10px;
  }

}

@media print {
  .outer {
    display: none !important;
  }

  .hist {
    display: none !important;
  }

  .content,
  .search,
  .note,
  .sign,
  .Btn {
    display: none !important;
  }

  .buttons {
    display: none !important;
  }
}</style>