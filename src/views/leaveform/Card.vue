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
        </div>
  
        <div class="butokz">
          <button @click="postCertification" v-if="[76,24].includes(this.nameId)" class="save-btn"
           >Save</button>
           <button @click="postCertification" v-if="[76,2].includes(this.nameId)" class="save-btn"
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
        </div>
  
        <div class="butokz">
          <button @click="postApproval" :disabled="(approveLeavetype < 1 || approveLeavetype.length === 0) || (approveLeavetype < 1 || approveLeavetype.includes(2))" class="save-btn"
            :style="{ cursor: (approveLeavetype < 1 || approveLeavetype.length === 0) || (approveLeavetype < 1 || approveLeavetype.includes(2) && !text2) ? 'not-allowed' : 'pointer' }">{{
              approveLeavetype == 2 ? 'disapprove' : 'approve' }}</button>
          <button @click="approve(apronum)" class="option-btn">Cancel</button>
        </div>
      </div>
    </div>
    <div v-if="!mawala" class="loader"></div> <!-- Loader here -->
    <div v-if="mawala" class="outer">
      <div class="navigation">
          <div class="arrow" @click="previousCard" v-if="currentCardIndex > 0"><button class="arrow">
  <div class="arrow-box">
    <span class="arrow-elem">
      <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
      </svg>
    </span>
    <span class="arrow-elem">
      <svg viewBox="0 0 46 40">
        <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
      </svg>
    </span>
  </div>
</button></div>
        <div class="card-container" @touchstart="startTouch" @touchmove="moveTouch" @touchend="endTouch">
          <div class="card" v-for="(item, index) in reversedFormData" :key="item.id" v-show="currentCardIndex === index">
      <div class="card-header">
        <h3>Leave Form</h3>
        <div class="status">
          <span v-if="!item.appsig" class="status-pending">On-going</span>
          <span v-else class="status-approved">Approved</span>
        </div>
      </div>
      <div class="card-body">
        <p><strong>Date of Filing:</strong> {{ formattedDate(item.date) }}</p>
        <p><strong>Name:</strong> {{ getName(item.name_id) }}</p>
        <p><strong>Type of Leave:</strong> {{ item.type }}</p>
        <p><strong>Leave Details:</strong> {{ item.detail }} {{ item.description }}</p>
        <p><strong>Duration:</strong> {{ item.dates }} ({{ item.days }})</p>
        <p><strong>Commutation:</strong> {{ item.commutation }}</p>
        <div v-if="!item.certification" class="statusrow">
          <img src="../../assets/close.png" alt="Pending Approval" class="status-icon">
          <p class="status-pending">For Certification</p>
        </div>
        <div v-if="item.certification" class="statusrow">
          <img src="../../assets/check.png" alt="Approved Recommendation" class="status-icon">
          <p class="status-approved">Certified</p>
        </div>
        <div v-if="item.certification && (![15,21,45,48, 3].includes(item.name_id))">
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
            <p class="status-pending">Not Recommended</p>
          </div>
        </div>
        <div v-if="item.recommendation || (item.certification) || ([15,21,45,48, 3].includes(item.name_id) && item.certification)">
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
            <p class="status-pending">Not Approved</p>
          </div>  
        </div>
      </div>
      <div class="card-footer">
        <div class="status-actions" v-if="item.name_id == this.nameId || this.nameId == 76">
          <button v-if="selectedTravelOrderIdEdit != item.leaveform_id" @click="edit(item.leaveform_id)">Edit</button>
          <img src="/src/assets/canceledit.png" v-if="selectedTravelOrderIdEdit == item.leaveform_id" @click="closeEdit" class="action-icon"/>
        </div>
        <div class="status-actions">
          <button 
            v-if="selectedTravelOrderId != item.leaveform_id"
            @click="openPDF(item.leaveform_id, false)">PDF</button>
          <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.leaveform_id && ChiefPDF != true" @click="close"
            style="width: 40px; height: 40px; cursor: pointer;" />
        </div>
        <div class="status-actions" v-if="[15,20,21,45,48, 3].includes(item.name_id) && ChiefPDF !== false">
          <button 
            v-if="selectedTravelOrderId != item.leaveform_id"
            @click="openPDF(item.leaveform_id, true)">Chief PDF</button>
          <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.leaveform_id" @click="close"
            style="width: 40px; height: 40px; cursor: pointer;" />
        </div>
        <div v-if="[2,24].includes(this.nameId)" class="status-actions">
          <button 
          v-if="((item.asof || item.tevl || item.tesl || item.ltavl || item.ltasl || item.bvl || item.vsl || item.dayswpay || item.dayswopay || item.others) && item.certification == null && this.nameId == 2) || this.nameId == 24 || this.nameId == 76" 
            @click="certification(item.leaveform_id, item.asof, item.tevl, item.tesl, item.ltavl, item.ltasl, item.bvl, item.vsl, item.dayswpay, item.dayswopay, item.others)"
            :style="{
              color: certinum === item.leaveform_id ? 'white' : 'black',
              backgroundColor: certinum === item.leaveform_id ? 'black' : 'white',
              padding: '10px 20px',
              cursor: 'pointer'
            }">
            Certification
          </button>
        </div>
        <div v-if="[15,21,45,48, 3].includes(this.nameId)" class="status-actions">
          <button v-if="!item.recommendation && item.name_id !== this.nameId"
            @click="recommendation(item.leaveform_id)"
            :style="{
              color: reconum === item.leaveform_id ? 'white' : 'black',
              backgroundColor: reconum === item.leaveform_id ? 'black' : 'white',
              padding: '10px 20px',
              cursor: 'pointer'
            }">
            Recommend
          </button>
        </div>
        <div v-if="((sub.division_id == bus.name_id || this.nameId == 20) && !item.appsig)" class="status-actions">
          <button 
            @click="approve(item.leaveform_id)"
            :style="{
              color: apronum !== item.leaveform_id ? 'white' : 'black',
              backgroundColor: apronum !== item.leaveform_id ? 'black' : 'white',
              padding: '10px 20px',
              cursor: 'pointer'
            }">
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="arrow right" @click="nextCard" v-if="currentCardIndex < reversedFormData.length - 1"><button class="arrow" style="rotate: 180deg;">
  <div class="arrow-box">
    <span class="arrow-elem">
      <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
      </svg>
    </span>
    <span class="arrow-elem">
      <svg viewBox="0 0 46 40">
        <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
      </svg>
    </span>
  </div>
</button></div>
      </div>
  <h1 v-if="reversedFormData.length == 0" class="no-match">NO PENDING LEAVE FORM FOUND</h1>
</div>
  
    <div v-show="selectedTravelOrderId" class="prent full-screen">
      <pdf :leaveform_id="selectedTravelOrderId" :isChief="ChiefPDF"></pdf>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import pdf from './PDF.vue';
  import editform from './EditForm.vue';
  import { API_BASE_URL } from '../../config'
  import { useAuthStore } from '../../store/auth';
  import { usePendingStore } from '@/store/pending';
  
  export default {
    provide() {
      return {
        close: this.close,
      };
    },
    components: {
      pdf,
      editform,
    },
    mounted() {
      this.fetchNames();
      this.fetchData();
      window.addEventListener('afterprint', this.handleAfterPrint);
      window.addEventListener('keydown', this.handleKeydown);
    },
    beforeDestroy() {
    window.removeEventListener('afterprint', this.handleAfterPrint);
    window.removeEventListener('keydown', this.handleKeydown);
    },
    data() {
      const authStore = useAuthStore();
      return {
        pendingStore: usePendingStore(),
        numberOfRows: 10,  // Default number of rows to fetch
        rowOptions: [10, 20, 50, 100, 200, 500, 1000, 5000, 10000], // Options for number of rows to fetch
        selectedStatus: 'Me',
        options: ['Pending', 'Done', 'Me'],
        yearToday: new Date().getFullYear(),
        formData: [],
        names: {},
        selectedTravelOrderId: 0,
        selectedTravelOrderIdEdit: 0,
        accountId: authStore.account_id,
        accountType: authStore.account_type,
        nameId: authStore.name_id,
        signature: authStore.signature,
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
        ChiefPDF: '',
        currentCardIndex: 0,
        startX: 0,
        endX: 0,
      };
    },  
    methods: {
      startTouch(event) {
      this.startX = event.touches[0].clientX;
    },
    moveTouch(event) {
      this.endX = event.touches[0].clientX;
    },
    endTouch() {
      if (this.startX - this.endX > 50) {
        // Swipe left
        this.nextCard();
      } else if (this.endX - this.startX > 50) {
        // Swipe right
        this.previousCard();
      }
    },
    handleKeydown(event) {
      if (event.key === 'ArrowLeft') {
        this.previousCard();
      } else if (event.key === 'ArrowRight') {
        this.nextCard();
      }
    },
    nextCard() {
      if (this.currentCardIndex < this.reversedFormData.length - 1) {
        this.currentCardIndex++;
      }
    },
    previousCard() {
      if (this.currentCardIndex > 0) {
        this.currentCardIndex--;
      }
    },
        handleAfterPrint() {
        //this.close();
        console.log('damn')
        },
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
        window.print()
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
        if (this.nameId == 2) {
          formData.append('certification', this.signature);
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
        formData.append('recommendation', this.signature);
  
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
        formData.append('appsig', this.signature);
        formData.append('appby', this.nameId);
  
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
      fetchData() {
        this.load = true
        axios.get(`${API_BASE_URL}/get_leave_json/${this.nameId}/Pending/${this.numberOfRows}`)
          .then(response => {
            this.mawala = true;
            this.load = false
            this.csvformdata = response.data
  
            this.formData = response.data
            this.pendingStore.count('leaveform', this.formData.length)
          
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
        setTimeout(() => {
            this.printzz()
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
      },
    },
  
    computed: {
      imageUrl() {
      return `${this.API_BASE_URL}/storage/${this.signature}`;
    },
      reversedFormData() {
        let data = this.formData.slice().reverse(); // Make a copy of the original data
  
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
      selectedStatus: 'fetchData',
      numberOfRows: 'fetchData' // Watch for changes in number of rows
    }
  }
  
  </script>
  
  <style scoped>
  .note {
    width: 380px;
    background: linear-gradient(150deg, #a1834a, #b8860b); /* Gradient from light gold to dark gold */
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

  .status-icon {
    height: 16px;
    width: 16px;
    margin-right: 5px;
    margin-top: 15px;
  }
  .statusrow{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: -20px;
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
  
  </style>