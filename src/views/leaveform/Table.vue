<template>
  <editform v-if="selectedTravelOrderIdEdit > 0" :leaveFormId="selectedTravelOrderIdEdit" @cancel-edit="closeEdit"></editform>
    <div class="note" v-if="certif">
      <div class="title-bar">
        <div class="title">LEAVE CREDITS</div>
        <div class="close-icon" @click="certification(certinum)">X</div>
      </div>
  
      <div class="content">
        <div style="border: 2px solid black;margin-top: 2px;font-size: 10px;">
          <p style="margin-left: 10px;">7.A CERTIFICATION OF LEAVE CREDITS</p>
          <div style="display: flex;flex-direction: row; justify-content: center; margin-left: 90px">
            <p>As of</p>
            <input
              style="height: 12px; width: 200px; border: none; border-bottom: 1.5px solid black;outline: none; font-size: 13px; margin-top: 7px; margin-left: 3px"
              v-model="leavecredits" class="leavecredits">
          </div>
          <div>
            <div class="grid-container" style="margin-left: 20px;">
              <div class="grid-item" style="border: solid black 1.5px;"></div>
              <div class="grid-item" style="width: 90px;border: solid black 1.5px;">Vacation Leave</div>
              <div class="grid-item" style="width: 90px;margin-left: -26.5px;border: solid black 1.5px;">Sick Leave</div>
              <div class="grid-item" style="border: solid black 1.5px;">Total Earned</div>
              <div class="grid-item" style="width: 90px;border: solid black 1.5px;">
                <input type="text" class="leavecredits" v-model="totalvacation" @input="nonumber($event, 'totalvacation')">
              </div>
              <div class="grid-item" style="width: 90px; margin-left: -26.5px;border: solid black 1.5px;">
                <input type="text" class="leavecredits" v-model="totalsick" @input="nonumber($event, 'totalsick')">
              </div>
              <div class="grid-item" style="border: solid black 1.5px;">Less this Application</div>
              <div class="grid-item" style="width: 90px;border: solid black 1.5px;">
                <input type="text" class="leavecredits" v-model="lessvacation" @input="nonumber($event, 'lessvacation')">
              </div>
              <div class="grid-item" style="width: 90px;margin-left: -26.5px;border: solid black 1.5px;">
                <input type="text" class="leavecredits" v-model="lesssick" @input="nonumber($event, 'lesssick')">
              </div>
              <div class="grid-item" style="border: solid black 1.5px;">Balance</div>
              <div class="grid-item" style="width: 90px;border: solid black 1.5px;">
                <input type="text" class="leavecredits" v-model="balancevacation"
                  @input="nonumber($event, 'balancevacation')">
              </div>
              <div class="grid-item" style="width: 90px;margin-left: -26.5px;border: solid black 1.5px;">
                <input type="text" class="leavecredits" v-model="balancesick" @input="nonumber($event, 'balancesick')">
              </div>
            </div>
          </div>
          <div style="margin-left: 20px; margin-top: 10px;">
            <div style="display: flex; flex-direction: row; margin-top: -5px;">
              <input 
                style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                v-model="withpay" class="leavecredits">
              <p style="font-size: 10px;">days with pay</p>
            </div>
            <div style="display: flex; flex-direction: row; margin-top: -5px;">
              <input class="leavecredits"
                style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                v-model="withoutpay">
              <p>days without pay</p>
            </div>
            <div style="display: flex; flex-direction: row; margin-top: -5px;">
              <input class="leavecredits"
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
          <button @click="postCertification" v-if="[76,24].includes(acc.name_id)" class="save-btn"
           >Save</button>
           <button @click="postCertification" v-if="[76,2].includes(acc.name_id)" class="save-btn"
           >Certify</button>
          <button @click="certification(certinum)" class="option-btn">Cancel</button>
        </div>
      </div>
    </div>
  
  
  
    <div class="note" v-if="recoms">
      <div class="title-bar">
        <div class="title">Recommendation</div>
        <div class="close-icon" @click="recommendation(reconum)">X</div>
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
            style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 295px; margin-left: 20px; font-size: 13px"></textarea>
          <!-- <p style="text-align: center;margin-bottom: -20px;z-index: 9;">{{ reco }}</p>
  
          <p
            style="height: 10px; width: 350px; z-index: 1; border: none; border-bottom: 1px solid black;outline: none; margin-left: 20px; font-size: 10px; color: transparent;">
          </p>
          <p style="text-align: center">{{ recopost }}</p> -->
        </div>
  
        <div class="butokz">
          <button @click="postRecommendation" class="save-btn"
            :disabled="recommendationLeavetype < 1 || recommendationLeavetype.length === 0"
            :style="{ cursor: recommendationLeavetype < 1 || recommendationLeavetype.length === 0 ? 'not-allowed' : 'pointer' }">{{
              recommendationLeavetype == 2 ? 'disapprove' : 'approve' }}</button>
          <button @click="recommendation(reconum)" class="option-btn">Cancel</button>
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
            style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 290px; margin-left: 20px; font-size: 13px;"></textarea>
          <!-- <p style="text-align: center;margin-bottom: -20px;z-index: 9;">{{ reco }}</p>
  
          <p
            style="height: 10px; width: 350px; z-index: 1; border: none; border-bottom: 1px solid black;outline: none; margin-left: 20px; font-size: 10px; color: transparent;">
          </p>
          <p style="text-align: center">{{ recopost }}</p> -->
        </div>
  
        <div class="butokz">
          <button @click="postApproval" :disabled="(approveLeavetype < 1 || approveLeavetype.length === 0) || (approveLeavetype < 1 || approveLeavetype.includes(2))" class="save-btn"
            :style="{ cursor: (approveLeavetype < 1 || approveLeavetype.length === 0) || (approveLeavetype < 1 || approveLeavetype.includes(2) && !text2) ? 'not-allowed' : 'pointer' }">{{
              approveLeavetype == 2 ? 'disapprove' : 'approve' }}</button>
          <button @click="approve(apronum)" class="option-btn">Cancel</button>
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
  
    <div class="luxury-container">
        <h2 class="luxury-title">
          History for:
          <select v-model="selectedStatus" id="status" class="luxury-select">
            <option v-for="option in options" :key="option" :value="option">
              {{ option }}
            </option>
          </select> 
          <span v-if="pendingCount !== 0" class="luxury-notification-count">
            {{ pendingCount }}
          </span>
        </h2>
    
        <div v-if="load" class="luxury-loading">
          <img src='../../assets/loading.gif' alt="Loading..." />
        </div>
    
        <div class="luxury-search-container">
          <div class="luxury-search-bar">
            <div v-if="mawala" class="luxury-search-box">
              <img class="luxury-search-icon" src="../../assets/search.png" alt="Search" />
              <input class="luxury-search-input" type="text" v-model="searchQuery" placeholder="Search TO number or Name" />
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
                <th style="text-align: center;">Status</th>
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
                <td>
                  <div v-if="!item.certification" class="statusrow">
                    <img src="../../assets/close.png" alt="Pending Approval" class="status-icon">
                    <p  class="status-pending">For Ceritification</p>
                  </div>
                  <div v-if="item.certification" class="statusrow">
                    <img src="../../assets/check.png" alt="Approved Recommendation" class="status-icon">
                    <p class="status-approved">Ceritified</p>
                  </div>
                  <div v-if="item.certification && (!this.getDivisionGroup(5).includes(item.name_id) && ![15,21,45,48].includes(item.name_id))">
                    <div v-if="!item.recommendation" class="statusrow">
                      <img src="../../assets/close.png" alt="Pending Approval" class="status-icon">
                      <p class="status-pending">For Recommendation</p>
                    </div>
                    <div v-if="item.recommendation && parseInt(item.reco) == 1" class="statusrow">
                      <img src="../../assets/check.png" alt="Approved Recommendation" class="status-icon">
                      <p class="status-approved">Recommended</p>
                    </div>
                    <div v-if="item.recommendation && item.recodesc" class="statusrow">
                      <img src="../../assets/close.png" alt="Pending Approval" class="status-icon">
                      <p class="status-pending">not Recommended</p>
                    </div>
                  </div>
                  <div v-if="item.recommendation || (this.getDivisionGroup(5).includes(item.name_id) && item.certification) || ([15,21,45,48].includes(item.name_id) && item.certification)">
                    <div v-if="!item.appsig" class="statusrow">
                      <img src="../../assets/close.png" alt="Pending Approval" class="status-icon">
                      <p class="status-pending">For Approval</p>
                    </div>
                    <div v-if="item.appsig && !item.disapproved" class="statusrow">
                      <img src="../../assets/check.png" alt="Approved Recommendation" class="status-icon">
                      <p class="status-approved">Approved</p>
                    </div>
                    <div v-if="item.appsig && item.disapproved" class="statusrow">
                      <img src="../../assets/close.png" alt="Pending Approval" class="status-icon">
                      <p class="status-pending">not Approved</p>
                    </div>  
                  </div>
                </td>
                <td class="status-actions" v-if="item.name_id == acc.name_id || acc.name_id == 76">
                  <button v-if="selectedTravelOrderIdEdit != item.leaveform_id" @click="edit(item.leaveform_id)">Edit</button>
                  <img src="/src/assets/canceledit.png" v-if="selectedTravelOrderIdEdit == item.leaveform_id" @click="closeEdit" class="action-icon"/>
                </td>
                <td class="status-actions">
                  <button 
                    v-if="selectedTravelOrderId != item.leaveform_id"
                    @click="openPDF(item.leaveform_id, false)">PDF</button>
                  <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.leaveform_id && ChiefPDF != true" @click="close"
                    style="width: 40px; height: 40px; cursor: pointer;" />
                </td>
                <td class="status-actions" v-if="[15,20,21,45,48].includes(item.name_id) && ChiefPDF !== false">
                  <button 
                    v-if="selectedTravelOrderId != item.leaveform_id"
                    @click="openPDF(item.leaveform_id, true)">Chief PDF</button>
                  <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.leaveform_id" @click="close"
                    style="width: 40px; height: 40px; cursor: pointer;" />
                </td>
                <td v-if="[2,24].includes(acc.name_id)" class="status-actions">
                  <button 
                  v-if="((item.asof || item.tevl || item.tesl || item.ltavl || item.ltasl || item.bvl || item.vsl || item.dayswpay || item.dayswopay || item.others) && item.certification == null && acc.name_id == 2) || acc.name_id == 24 || acc.name_id == 76" 
                    @click="certification(item.leaveform_id, item.asof, item.tevl, item.tesl, item.ltavl, item.ltasl, item.bvl, item.vsl, item.dayswpay, item.dayswopay, item.others)"
                    :style="{
                      color: certinum === item.leaveform_id ? 'white' : 'black',
                      backgroundColor: certinum === item.leaveform_id ? 'black' : 'white',
                      padding: '10px 20px',
                      cursor: 'pointer'
                    }">
                    Certification
                  </button>
                </td>
                <td v-if="[15,21,45,48].includes(acc.name_id)" class="status-actions">
                  <button v-if="!item.recommendation && getDivisionGroup(sub.division_id) && item.name_id !== acc.name_id"
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
                <td v-if="((sub.division_id == bus.name_id || acc.name_id == 20) && !item.appsig)" class="status-actions">
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
                
              </tr>
            </tbody>
          </table>
          <h1 style="text-align: center; margin-bottom: 0px;" v-if="reversedFormData.length == 0">NO MATCH FOUND</h1>
        </div>
      </div>
    </div>
    <div v-show="selectedTravelOrderId" class="prent full-screen">
      <!-- <div class="buttons">
        <button @click="printzz">Download as PDF</button>
        <button @click="close">Close PDF</button>
      </div> -->
      <pdf :leaveform_id="selectedTravelOrderId" :isChief="ChiefPDF"></pdf>
    </div>
  </template>
    
  <script>
  import axios from 'axios';
  import pdf from './PDF.vue';
  import otpz from '../../components/otp.vue';
  import editform from './EditForm.vue';
  import { API_BASE_URL } from '../../config'
  import { useAuthStore } from '../../store/auth';
  
  export default {
    provide() {
      return {
        close: this.close,
      };
    },
    components: {
      pdf,
      otpz,
      editform,
    },
    mounted() {
      this.fetchAccounts();
      this.fetchEmployees();
      this.fetchNames();
    },
    data() {
      return {
        selectedStatus: 'Me',
        options: ['Pending', 'Done', 'Me'],
        yearToday: new Date().getFullYear(),
        formData: [],
        names: {},
        employees: {},
        selectedTravelOrderId: 0,
        selectedTravelOrderIdEdit: 0,
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
        leavecredits: '',
        totalvacation: '',
        totalsick: '',
        lessvacation: '',
        lesssick: '',
        // balancevacation: '',
        // balancesick: '',
        withpay: '',
        withoutpay: '',
        othersSpecify: '',
        text: '',
        rows: 1,
        appr: false,
        text2: '',
        certinum: 0,
        reconum: 0,
        apronum: 0,
        ChiefPDF: ''
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
      edit(travelOrderId) {
      this.selectedTravelOrderIdEdit = travelOrderId;
      this.$emit('edit-travel-order', travelOrderId); // Emit the selected travel order ID
    },
    closeEdit(){
      this.selectedTravelOrderIdEdit = 0
    },
      printzz() {
        window.print();
      },
      isSectionChief(name_id) {
        return this.sectionChiefIds.includes(name_id);
      },
  
      postCertification() {
        const formData = new FormData();
  
        if (this.leavecredits) {
          formData.append('asof', '' + this.leavecredits);
        }
        if (this.totalvacation) {
          formData.append('tevl', '' + this.totalvacation);
        }
        if (this.totalsick) {
          formData.append('tesl', '' + this.totalsick);
        }
        if (this.lessvacation) {
          formData.append('ltavl', '' + this.lessvacation);
        }
        if (this.lesssick) {
          formData.append('ltasl', '' + this.lesssick);
        }
        if (this.balancevacation) {
          formData.append('bvl', '' + this.balancevacation);
        }
        if (this.balancesick) {
          formData.append('vsl', '' + this.balancesick);
        }
        if (this.withpay) {
          formData.append('dayswpay', this.withpay);
        }
        if (this.withoutpay) {
          formData.append('dayswopay', this.withoutpay);
        }
        if (this.othersSpecify) {
          formData.append('others', '' + this.othersSpecify);
        }
        if (this.acc.name_id == 2) {
          formData.append('certification', this.acc.signature);
        }
  
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
            this.certinum = 0
          
        }).catch(error => {
          console.error('Error:', error);
        });
      },
  
      // Method to post recommendation
      postRecommendation() {
        const formData = new FormData();
        formData.append('reco', this.recommendationLeavetype);
        formData.append('recodesc', this.text);
        formData.append('recommendation', this.acc.signature);
  
        axios.post(`${API_BASE_URL}/updateleave_form/${this.reconum}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          
          this.fetchData();
          this.recommendationLeavetype.length = 0
          this.text = ''
          this.recoms = false
          this.reconum = 0
          
        }).catch(error => {
          console.error('Error:', error);
        });
      },
  
      // Method to post approval
      postApproval() {
        const formData = new FormData();
        if (this.approveLeavetype.includes(1)){
          formData.append('approval', this.approveLeavetype);
        }else{
          formData.append('disapproved', this.text2);
        }
        formData.append('appsig', this.acc.signature);
        formData.append('appby', this.acc.name_id);
  
        axios.post(`${API_BASE_URL}/updateleave_form/${this.apronum}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
  
          this.fetchData();
          this.text2 = ''
          this.approveLeavetype.length = 0
          this.appr = false
          this.apronum = 0
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
        formData.append('sname', this.sub.division_id);
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
      getDivisionGroup(division_id) {
        // Filter employees by division_id and map to the name_id
        return this.employees
          .filter(emp => emp.division_id === division_id)
          .map(emp => emp.name_id);
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
  
            this.formData = response.data
          
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
      openPDF(travelOrderId, chief) {
        this.selectedTravelOrderId = travelOrderId;
        this.ChiefPDF = chief
        useAuthStore().updateVerifiedOTPs('false');
        localStorage.setItem('verifiedOTPs', 'false');
        setTimeout(() => {
        this.printzz();
      }, 500);  // 500 milliseconds = 0.5 seconds
      },
      close() {
        this.selectedTravelOrderId = 0
        this.ChiefPDF = ''
      },
  
      certification(leaveformID, asof, tevl, tesl, ltavl, ltasl, bvl, vsl, dayswpay, dayswopay, others) {
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
        this.leavecredits = asof ?? ''
        this.totalvacation = tevl ?? ''
        this.totalsick = tesl ?? ''
        this.lessvacation = ltavl ?? ''
        this.lesssick = ltasl ?? ''
        this.balancevacation = bvl ?? ''
        this.balancesick = vsl ?? ''
        this.withpay =  dayswpay ?? ''
        this.withoutpay = dayswopay ?? ''
        this.othersSpecify = others ?? ''
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
      countPendingNotifications(formData, acc) {
      let pendingCount = 0;

      if (acc.name_id === 24) {
        pendingCount += formData.filter(form => {
        return [form.asof, form.tevl, form.tesl, form.ltavl, form.ltasl, form.bvl, form.vsl, form.dayswpay, form.dayswopay, form.others].every(val => val == null)
      }).length;
      } else if (acc.name_id === 2) {
          pendingCount += formData.filter(form => {
            return (form.asof || form.tevl || form.tesl || form.ltavl || form.ltasl || form.bvl || form.vsl || form.dayswpay || form.dayswopay || form.others) && form.certification == null;
          }).length;
      } 
      // else if (this.bus.name_id === this.sub.name_id) {
      //     if (acc.name_id !== 20) {
      //       pendingCount += formData.filter(form => {
      //         return (
      //           ((this.getDivisionGroup(this.sub.division_id).includes(form.name_id) && !form.recommendation) || (form.recommendation && !form.appsig) || (this.getDivisionGroup(5).includes(form.name_id) && form.certification && !form.appsig)) && form.name_id !== acc.name_id
      //         );
      //       }).length;
      //     } else {
      //       pendingCount += formData.filter(form => {
      //         return (
      //           (form.recommendation && !form.appsig) || (this.getDivisionGroup(5).includes(form.name_id) && form.certification && !form.appsig) || ([15,21,45,48].includes(form.name_id) && form.certification && !form.appsig)
      //         );
      //       }).length;
      //     }
      // }
       else if (acc.type_id === 3) {
          if (acc.name_id === 20) {
            pendingCount += formData.filter(form => {
              return (
                (form.recommendation && !form.appsig) || (this.getDivisionGroup(5).includes(form.name_id) && form.certification && !form.appsig) || ([15,21,45,48].includes(form.name_id) && form.certification && !form.appsig)
              );
            }).length;
          } else {
            pendingCount += formData.filter(form => {
              return (
                (this.getDivisionGroup(this.sub.division_id).includes(form.name_id) && !form.recommendation && form.certification) && form.name_id !== acc.name_id
              );
            }).length;
          }
      } else if (this.acc.type_id == 2) {
          pendingCount += formData.filter(form => {
            return form.name_id === this.acc.name_id && (!form.approval || !form.disapproved)
          }).length;
      }        
      return pendingCount;
    },
  
    },
  
    computed: {
      pendingCount() {
      console.log(this.countPendingNotifications(this.formData, this.acc))
      return this.countPendingNotifications(this.formData, this.acc);
    },
      filteredData() {
        if ([24].includes(this.acc.name_id)) {
          return this.formData.filter(form => {
            if (this.selectedStatus === 'Me') {
              return form.name_id === this.acc.name_id;
            } else if (this.selectedStatus === 'Pending') {
              return [form.asof, form.tevl, form.tesl, form.ltavl, form.ltasl, form.bvl, form.vsl, form.dayswpay, form.dayswopay, form.others].every(val => val == null);
            } else if (this.selectedStatus === 'Done') {
              return form.asof || form.tevl || form.tesl || form.ltavl || form.ltasl || form.bvl || form.vsl || form.dayswpay || form.dayswopay || form.others
            }
            return true; // If no selection, return all
          });
        }else if ([2].includes(this.acc.name_id)){
          return this.formData.filter(form => {
            if (this.selectedStatus === 'Me') {
              return form.name_id === this.acc.name_id;
            } else if (this.selectedStatus === 'Pending') {
              return (form.asof || form.tevl || form.tesl || form.ltavl || form.ltasl || form.bvl || form.vsl || form.dayswpay || form.dayswopay || form.others) && form.certification == null
            } else if (this.selectedStatus === 'Done') {
              return form.certification
            }
            return true; // If no selection, return all
          });
        }else if (this.bus.name_id === this.sub.division_id) {
          return this.formData.filter(form => {
            if (this.selectedStatus === 'Me') {
              return form.name_id === this.acc.name_id;
            } else if (this.selectedStatus === 'Pending' && (this.acc.name_id == 20 || this.acc.name_id == 76)) {
              return (form.recommendation && !form.appsig) || (this.getDivisionGroup(5).includes(form.name_id) && form.certification && !form.appsig) || ([15,21,45,48].includes(form.name_id) && form.certification && !form.appsig)
            } else if (this.selectedStatus === 'Pending' && this.acc.name_id !== 20) {
              return ((this.getDivisionGroup(this.sub.division_id).includes(form.name_id) && !form.recommendation) || (form.recommendation && !form.appsig) || (this.getDivisionGroup(5).includes(form.name_id) && form.certification && !form.appsig)) && form.name_id !== acc.name_id
            } else if (this.selectedStatus === 'Done' && (this.acc.name_id == 20 || this.acc.name_id == 76)) {
              return form.appsig
            } else if (this.selectedStatus === 'Done' && this.acc.name_id !== 20) {
              return (this.getDivisionGroup(this.sub.division_id).includes(form.name_id) && form.recommendation) || form.appsig
            } 
            return true; // If no selection, return all
          });
        }else if (this.acc.type_id == 3){
          return this.formData.filter(form => {
            if (this.selectedStatus === 'Me') {
              return form.name_id === this.acc.name_id;
            } else if (this.selectedStatus === 'Pending' && (this.acc.name_id == 20)) {
              return (form.recommendation && !form.appsig) || (this.getDivisionGroup(5).includes(form.name_id) && form.certification && !form.appsig) || ([15,21,45,48].includes(form.name_id) && form.certification && !form.appsig)
            } else if (this.selectedStatus === 'Pending') {
              return this.getDivisionGroup(this.sub.division_id).includes(form.name_id) && !form.recommendation && form.certification && form.name_id !== this.sub.name_id
            } else if (this.selectedStatus === 'Done'&& (this.acc.name_id == 20)) {
              return form.appsig
            } else if (this.selectedStatus === 'Done') {
              return this.getDivisionGroup(this.sub.division_id).includes(form.name_id) && form.recommendation
            }
            return true; // If no selection, return all
          });
        }else if (this.acc.type_id == 2) {
          return this.formData.filter(form => {
            if (this.selectedStatus === 'Me') {
              return form.name_id === this.acc.name_id;
            } else if (this.selectedStatus === 'Pending') {
              return form.name_id === this.acc.name_id && (!form.approval || !form.disapproved);
            } else if (this.selectedStatus === 'Done') {
              return form.name_id === this.acc.name_id && (form.approval || form.disapproved);
            } 
            return true; // If no selection, return all
          });
        }
        return this.formData; // Return all if not section chief
      },
      reversedFormData() {
        let data = this.filteredData.slice().reverse(); // Make a copy of the original data
  
        if (this.searchQuery !== '') {
          data = data.filter(item => {
            return String(this.padWithZeroes(item.to_num)).includes(this.searchQuery) || String(this.getName(item.name_id)).toLowerCase().includes(this.searchQuery.toLowerCase());
          });
        }
        return data;
      },
      // Calculate balance vacation and round to 3 decimal places
  balancevacation() {
    let balance = this.lessvacation > 0 ? this.totalvacation - this.lessvacation : this.totalvacation;
    return Math.round(balance * 1000) / 1000;  // Round to 3 decimal places
  },

  // Calculate balance sick and round to 3 decimal places
  balancesick() {
    let balance = this.lesssick > 0 ? this.totalsick - this.lesssick : this.totalsick;
    return Math.round(balance * 1000) / 1000;  // Round to 3 decimal places
  }
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
          this.text2 = '';
        }
      },
    }
  }
  
  
  </script>
    
  <style scoped>
  .luxury-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: 'Garamond', serif; /* Elegant, classic serif font */
    color: #1a1a1a;
  }

  /* History Title Styling */
  .luxury-title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    font-family: 'Playfair Display', serif; /* Elegant serif font for headings */
    font-weight: 600;
    color: #212121;
    letter-spacing: 1px;
    margin-bottom: -30px;
    flex-direction: row;
  }

  /* Custom Select Box */
  .luxury-title select {
    background: linear-gradient(150deg, #DDC7AD, #92785b);
    border: 2px solid #000000;
    border-radius: 12px;
    padding: 10px 20px;
    font-size: 16px;
    font-family: 'Roboto', sans-serif;
    color: #333;
    transition: background-color 0.3s ease, border 0.3s ease;
    margin-left: 20px;
    font-weight: bolder;
  }
  .luxury-title option{
    background-color: #DDC7AD;
    color: black;
    font-weight: bolder;
  }
  /* Hover effect for option (may not work in all browsers) */
.luxury-title option:hover {
  background-color: #ff0000;  /* Adjust the color for hover effect */
  color: #ff0000; /* Change text color on hover */
}

  .luxury-title option:checked{
    background-color: #92785b;
  }

  .luxury-title select:hover {
    background-color: #8e8e8e !important;  /* Force hover effect */
    color: #fff !important;  /* Change text color on hover */
  }

  .luxury-notification-count {
    background-color: #fb0808;
    color: white;
    border-radius: 100%;
    padding: 6px 12px;
    font-weight: bold;
    font-size: 20px;
    border: solid black 2px;
    position: relative;
    top: -30px;
    right: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  /* Loading Indicator Styling */
  .luxury-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px;
  }

  .luxury-loading img {
    width: 120px;
    height: auto;
  }

  /* Search Section Styling */
  .luxury-search-container {
    display: flex;
    flex-direction: column;
    margin-top: 40px;
  }

  .luxury-search-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .luxury-search-box {
    display: flex;
    align-items: center;
    background-color: #f4f4f4;
    border-radius: 25px;
    padding: 8px 15px;
    border: 1px solid #d1d1d1;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
  }

  .luxury-search-icon {
    height: 20px;
    width: 20px;
    margin-right: 10px;
  }

  .luxury-search-input {
    border: none;
    outline: none;
    padding: 12px 15px;
    font-size: 16px;
    font-family: 'Roboto', sans-serif;
    color: #333;
    background-color: transparent;
    width: 250px;
    border-radius: 25px;
  }

  .luxury-search-input::placeholder {
    color: #b1b1b1;
  }
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
    width: 100%; /* Ensures the table spans full width */
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
  }

  th, td {
    padding: 12px 18px;
    text-align: center;
    border: 1px solid #e0e0e0;
    font-size: 14px;
    font-family: 'Arial', sans-serif;
  }

  thead {
    background: linear-gradient(180deg, #ccb59b, #92785b);
    color: rgb(0, 0, 0);
    position: sticky; /* This makes the header sticky */
    top: 0; /* This keeps the header at the top */
    z-index: 10; /* Make sure it's above the table rows */
  }

  thead th {
    font-size: 16px;
    font-weight: 600;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #f1f1f1;
    cursor: pointer;
  }
  .scrollable-table {
    width: 100%; /* Table takes full width */
    overflow-x: auto;
    max-height: 630px;
    overflow-y: auto;
  }
  
  .outer {
    width: 100%;
    max-width: 100%; /* Ensure it takes full width */
    margin-top: 10px;
    background-color: #f8f9fa;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow-x: auto; /* Enable horizontal scrolling on smaller screens */
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
    background: linear-gradient(150deg, #DDC7AD, #92785b);
    border: 2px solid #000000;
    border-radius: 5px;
    padding: 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }
  .option-btn {
    background-color: transparent;
    color: #000000;
    border: 1px solid #000000;
    padding: 8px 15px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }

  .option-btn:hover {
    background-color: #000000;
    color: #ffffff;
  }
  .save-btn, .cancel-btn {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .save-btn {
    background-color: #000000;
    color: #ffffff;
    border: none;
  }

  .save-btn:hover {
    transform: scale(1.05);
    background-color: #2e2e2e;
    color: #ffffff;
  }

  .cancel-btn {
    background-color: transparent;
    color: #fff;
    border: 2px solid #000000;
  }

  .cancel-btn:hover {
    background-color: #000000;
    color: #ffffff;
    transform: scale(1.05);
  }

   /* Status Indicators */
   .status-pending {
    color: red;
    font-weight: bolder;
  }

  .status-approved {
    color: green;
    font-weight: bolder;
  }

  .status-icon {
    height: 16px;
    width: 16px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .statusrow{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-top: -15px;
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
  .leavecredits{
    background-color: transparent;
    font-weight: bolder;
  }
  
  /* Conditional Row Styling */
  tr td.status-pending {
    color: red;
  }

  tr td.status-approved {
    color: green;
  }

  tr td.status-actions {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  tr td.status-actions button {
    background: linear-gradient(150deg, #DDC7AD, #92785b);
    border-radius: 8px;
    color: rgb(0, 0, 0);
    font-size: 14px;
    font-weight: bolder;
    border: solid black 2px;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  tr td.status-actions button:hover {
    background-color: #4a76d7;
    transform: translateY(-2px);
  }

  tr td.status-actions .action-icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin-top: 5px;
    transition: opacity 0.3s ease;
  }

  tr td.status-actions .action-icon:hover {
    opacity: 0.7;
  }

  /* Button for Modal Close */
  img.action-icon {
    cursor: pointer;
    margin-top: 5px;
    width: 35px;
    height: 35px;
    transition: opacity 0.3s ease;
  }

  img.action-icon:hover {
    opacity: 0.8;
  }
  .styled-select {
    appearance: none;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    font-size: 16px;
    transition: border-color 0.3s;
    width: 100px;
    font-weight: bold;
    margin-top: -5px;
    margin-left: 5px;
  }
  
  .styled-select:focus {
    border-color: #007bff;
    outline: none;
  }
  
  .styled-select option {
    padding: 10px;
    font-weight: bold;
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
    .Btn,
    .butokz,
    .luxury-container {
      display: none !important;
    }
  
    .buttons {
      display: none !important;
    }
  }</style>