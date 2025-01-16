<template>
    <editform v-if="selectedTravelOrderIdEdit > 0" :travelOrderId="selectedTravelOrderIdEdit" @cancel-edit="closeEdit"></editform>
    <otpz v-if="otp" @handleCloseOTP="handleOtpStatus" />
    <!-- <button @click="toggleOTPVisibility">Toggle OTP Component</button> -->
    <div class="note-modal" v-if="addNote">
      <div class="note-header">
        <span class="note-title">Add Note</span>
        <div class="close-btn" @click="closeNote">×</div>
      </div>

      <div class="note-body">
        <textarea v-model="noteText" rows="4" placeholder="Enter your note here..." class="notetextarea"></textarea>
        <div class="note-options">
          <button class="option-btn" @click="focusTextarea('Within WFP')" v-if="acc.name_id == 37 || acc.name_id == 76">Within WFP</button>
          <button class="option-btn" @click="focusTextarea('Not within WFP')" v-if="acc.name_id == 37 || acc.name_id == 76">Not within WFP</button>
        </div>
        <div class="note-footer">
          <button class="save-btn" @click="postNote">Save</button>
          <button class="cancel-btn" @click="closeNote">Cancel</button>
        </div>
      </div>
    </div>

    <div class="note-modal" v-if="viewNote">
      <div class="note-header">
        <span class="note-title">View Note</span>
        <div class="close-btn" @click="closeNote">×</div>
      </div>

      <div class="note-body">
        <textarea v-model="noteText" rows="4" :readonly="!(siga || siga1 || acc.name_id == 76 || acc.name_id == 37 || acc.name_id == 23 || acc.name_id == 64)" class="notetextarea"></textarea>
        <div class="note-footer">
          <button class="save-btn" @click="postNote" v-if="siga || siga1 || acc.name_id == 76 || acc.name_id == 37 || acc.name_id == 23 || acc.name_id == 64">Save</button>
          <button class="cancel-btn" @click="closeNote">Close</button>
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
      
      <button v-if="mawala && [2, 15, 24, 76, 39].includes(acc.name_id)" class="luxury-btn" @click="downloadCSV">
        <div class="luxury-btn-icon">
          <img class="luxury-download-icon" src="../../assets/download_excel.png" alt="Download" />
        </div>
        <div class="luxury-btn-text">Download Summary Reports</div>
      </button>
    </div>
  </div>
      
  <div v-if="mawala" class="outer">
  <div class="scrollable-table">
    <table>
      <thead>
        <tr>
          <th>TO No.</th>
          <th>Name</th>
          <th>Departure Date</th>
          <th>Destination</th>
          <th>Purpose</th>
          <th>Arrival Date</th>
          <th>Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in reversedFormData" :key="item.id">
          <td>{{ padWithZeroes(item.to_num) }} - {{ item.date.slice(0,4) }}</td>
          <td>{{ getName(parseInt(item.name_id)) }}</td>
          <td>{{ item.departure }}</td>
          <td>{{ item.destination }}</td>
          <td>{{ item.purpose }}</td>
          <td>{{ item.arrival }}</td>
          <td>{{ item.date }}</td>
          <td v-if="isInitialNull(item)" class="status-pending">
            <img src="../../assets/close.png" alt="Pending" class="status-icon">
            For Initial by: <span v-if="[15,21,45,48].includes(item.name_id)">RD</span> <span v-else-if="[2,39,3,8,42,34,29,52,51,36,5,47,17].includes(item.name_id) && item.intervals == 1">DC</span> <span v-else-if="item.intervals == 1">DC</span> <span v-else>SC</span>
          </td>
          
          <td v-if="!isInitialNull(item)" class="status-approved">
            <p v-if="isInitialized(item)">
            <img src="../../assets/check.png" alt="Approved" class="status-icon">
            {{ item.initial.charAt(0).toUpperCase() + item.initial.slice(1) }} 
            <span v-if="initializedByRD(item)">by RD</span>
            <span v-else-if="initializedByDC(item)">by DC</span> 
            <span v-else-if="item.intervals == 1">DC</span> 
            <span v-else>SC</span>
            </p>

            <!-- If note is null, display "To be Noted" -->
            <p v-if="isNoteNull(item)" class="status-pending-note">
              <img src="../../assets/close.png" alt="Pending Note" class="status-icon">
              To be Noted
            </p>
            
            <!-- If note is not null, display "Noted" -->
            <p v-if="isNoted(item)" class="status-approved-note">
              <img src="../../assets/check.png" alt="Noted" class="status-icon">
              Noted
            </p>
          
            <!-- Check for recommendation status -->
            <p v-if="(forRecommendationNoneORDNoneChief(item) || forRecommendationORDandChiefwithIntervals(item)) && forRecommendationCAOnotIncluded(item)" class="status-pending-recommendation">
              <img src="../../assets/close.png" alt="Pending Recommendation" class="status-icon">
              For Recommendation 
              <span v-if="forRecommendationbyRED(item)">by RED</span> 
              <span v-else-if="forRecommendationToSCbyCAO(item)">by CAO</span> 
              <span v-else-if="item.intervals == 1">by CAO</span> 
              <span v-else>by DC</span>
            </p>
          
            <!-- If recommendation is made -->
            <p v-if="recommendedNoneORDNoneChief(item) || recommendedORDandChiefwithIntervals(item)" 
                     class="status-approved-recommendation">
              <img src="../../assets/check.png" alt="Approved Recommendation" class="status-icon">
              Recommended 
              <span v-if="recommendedbyRED(item)">by RED</span> 
              <span v-else-if="recommendedbyCAO(item)">by CAO</span> 
              <span v-else-if="item.intervals == 1">by CAO</span> 
              <span v-else>by DC</span>
            </p>
          
            <!-- Check for approval status -->
            <p v-if="(forApproval(item) || forApprovalORDandChief(item) || forApprovalRDinterval(item)) || forApprovalCAO(item)" class="status-pending-approval">
              <img src="../../assets/close.png" alt="Pending Approval" class="status-icon">
              For Approval 
              <span v-if="forApprovalbyRED(item)">by RED</span>
              <span v-if="forApprovalbyBD(item)">by BD</span>
            </p>
          
            <!-- If approved -->
            <p v-if="approved(item) || approvedORD(item)" class="status-approved-approval">
              <img src="../../assets/check.png" alt="Approved" class="status-icon">
              Approved 
              <span v-if="item.sname !== 20">by: {{ getName(item.sname) }}</span>
            </p>
          </td>
          <td class="status-actions" v-if="item.name_id == acc.name_id || acc.name_id == 20">
            <button v-if="selectedTravelOrderIdEdit != item.travel_order_id" @click="edit(item.travel_order_id)">Edit</button>
            <img src="/src/assets/canceledit.png" v-if="selectedTravelOrderIdEdit == item.travel_order_id" @click="closeEdit" class="action-icon"/>
          </td>
          <td class="status-actions">
            <button v-if="selectedTravelOrderId != item.travel_order_id" @click="openPDF(item.travel_order_id)">PDF</button>
            <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.travel_order_id" @click="close" class="action-icon"/>
          </td>
          
          <!-- Signature Actions -->
          <td v-if="(siga && item.note !== null && item.signature1 == null && ![15, 21, 45, 48].includes(item.name_id) && item.division_id !== 5 && item.intervals == 0) || (acc.name_id == 15 && item.note !== null && item.signature1 == null && item.intervals == 1)" class="status-actions">
            <button @click="signature1(item.travel_order_id)">{{ sub.name_id === bus.name_id ? 'Approve' : 'Recommend' }}</button>
          </td>

          <td v-if="acc.name_id == 20 && item.note !== null && item.signature1 == null && item.intervals == 1 && [15, 21, 45, 48].includes(item.name_id)" class="status-actions">
            <button @click="signature11(item.travel_order_id, item.name_id)">Recommends CAO</button>
          </td>

          <td v-if="item.travel_order_id !== notenum && item.note == null && (acc.name_id == 37 || acc.name_id == 76)" class="status-actions">
            <button @click="openNote(item.travel_order_id)">Add Note</button>
          </td>

          <td v-if="addNote == true && item.travel_order_id == notenum && acc.name_id == 37" class="status-actions">
            <img src="/src/assets/close_note.png" @click="closeNote()" class="action-icon"/>
          </td>

          <td v-if="item.note !== null && notenum !== item.travel_order_id" class="status-actions">
            <button @click="viewNotez(item.note, item.travel_order_id)">View Note</button>
          </td>

          <td v-if="item.note !== null && notenum == item.travel_order_id" class="status-actions">
            <img src="/src/assets/close_note.png" @click="closeNote()" class="action-icon"/>
          </td>

          <td v-if="((siga1 && item.note !== null && item.name_id !== 20 && item.signature2 === null) && ((item.signature1 !== null && item.division_id !== 5) || (item.signature1 === null && item.division_id === 5) || (item.signature1 !== null && item.division_id === 5 && item.intervals == 1)|| ([15, 21, 45, 48].includes(item.name_id)))) || acc.name_id == 20" class="status-actions">
            <button @click="signature2(item.travel_order_id)">Approve</button>
          </td>

          <td v-if="(isSectionChief(acc.name_id) && selectedTravelOrderId != item.travel_order_id && item.initial === null && this.acc.name_id !== item.name_id) || ([15,21,45,48].includes(this.acc.name_id) && item.initial === null && item.intervals == 1 && this.acc.name_id !== item.name_id) || ([20].includes(this.acc.name_id) && item.initial === null && item.intervals == 1 && item.aor == 1 && this.acc.name_id !== item.name_id)" class="status-actions">
            <button @click="initialize(item.travel_order_id)">Initial</button>
            <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.travel_order_id" @click="close" class="action-icon"/>
          </td>
        </tr>
      </tbody>
    </table>
    <h1 v-if="reversedFormData.length == 0" class="no-match">NO MATCH FOUND</h1>
  </div>
</div>

    </div>
    <div v-show="selectedTravelOrderId" class="prent full-screen">
      <!-- <div class="buttons">
        <button @click="printzz">Download as PDF</button>
        <button @click="close">Close PDF</button>
      </div> -->
        <pdf :travel_order_id="selectedTravelOrderId"></pdf>
      </div>
  </template>
  
  <script>
import axios from 'axios';
import pdf from './PDF.vue';
import editform from './EditForm.vue';
import form from './Form.vue';
import otpz from '../../components/otp/OTP.vue';
import { API_BASE_URL } from '../../config'
import { useAuthStore } from '../../store/auth';
import { f } from 'html2pdf.js';

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
    form,
  },
  mounted() {
    this.fetchAccounts();
    this.fetchEmployees();
    this.fetchNames();
    this.fetchInterval = setInterval(() => {
      this.fetchAccounts(); // Fetch accounts every minute
      if (this.pendingCount > 0){this.playSound()}
    }, 60000); // 60000 milliseconds = 1 minute
  },
  beforeDestroy() {
    clearInterval(this.fetchInterval); // Clear the interval when the component is destroyed
  },
  data() {
    return {
      selectedStatus: 'Me',
      optionsEmp: ['Pending', 'Done', 'All'],
      options: ['Pending', 'Done', 'Me'],
      sectionChiefIds: [39, 2, 3, 8, 42, 34, 29, 36, 11, 5, 47],
      members: [
        [23, 25, 35, 70, 64], 
        [30, 7, 26, 18, 67, 49, 24],
        [43, 40],
        [32, 50, 71],
        [33, 6],
        [41, 46],
        [38, 65, 1, 28],
        [44, 22, 61, 27],
        [31],
        [16, 63, 19, 9],
        [12, 14]
      ],
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
      otpStatus: false,
      load: true,
      mawala: false,
      addNote: false,
      viewNote: false,
      notenum: 0,
      initnum: 0,
      noteText: '',
      sub: 0,
      bus: 0,
      searchQuery: '',
      csvformdata: [],
      isVisible: true,
      fetchInterval: null, // To store the interval ID
    };
  },
  methods: {
    isInitialNull(item) {
      return item.initial === null;
      //init pair 1
    },
    initialForDC(item) {
      return [15,21,45,48].includes(item.name_id)
      //init pair 2
    },
    initialForSC(item) {
      return [2,39,3,8,42,34,29,52,51,36,5,47,17].includes(item.name_id) && item.intervals == 1
      //init pair 3
    },
    isInitialized(item) {
      return (![39, 2, 3, 8, 42, 34, 29, 36, 48, 5, 47, 15, 45, 21, 52, 51, 13, 10, 37, 62, 53, 75, 4, 56, 58, 55, 60, 59, 20,77,79,66,72,73].includes(item.name_id) && item.initial !== null) || ([15,21,45,48].includes(item.name_id) && item.aor == 1 && item.intervals == 1) || ([2,39,3,8,42,34,29,52,51,36,5,47,17].includes(item.name_id) && item.intervals == 1)
      //init pair 1
    },
    initializedByRD(item) {
      return [15,21,45,48].includes(item.name_id) && item.aor == 1 && item.intervals == 1
      //init pair 2
    },
    initializedByDC(item) {
      return[2,39,3,8,42,34,29,52,51,36,5,47,17].includes(item.name_id) && item.intervals == 1
      //init pair 3
    },
    isNoteNull(item){
      return item.note === null
      //note pair 1
    },
    isNoted(item){
      return item.note !== null
      //note pair 1
    },
    //v-if for recommendation
    forRecommendationNoneORDNoneChief(item){
      return item.signature1 === null && item.note !== null && ![15, 20, 21, 45, 48, 13, 10, 37, 62, 53, 75, 56, 58, 55, 60, 59,77].includes(item.name_id)
    },
    forRecommendationORDandChiefwithIntervals(item){
      return item.signature1 === null && item.note !== null && [15, 21, 45, 48,56,58,55,59,60,13,10,37,62,53,77,4].includes(item.name_id) && item.intervals == 1
    },
    forRecommendationCAOnotIncluded(item){
      return !([15].includes(item.name_id) && item.aor == 0 && item.intervals == 1)
    },
    //by span v-if 
    forRecommendationbyRED(item){
      return [15,21,45,48].includes(item.name_id) && item.aor == 1 && item.intervals == 1
    },
    forRecommendationToSCbyCAO(item){
      return [2,39,3,8,42,34,29,52,51,36,5,47].includes(item.name_id) && item.intervals == 1
    },
    //recommended v-if
    recommendedNoneORDNoneChief(item){
      return item.note !== null && item.signature1 !== null && ![15, 20, 21, 45, 48, 13, 10, 37, 62, 53, 75, 56, 58, 55, 60, 59,77].includes(item.name_id)
    },
    recommendedORDandChiefwithIntervals(item){
      return item.signature1 !== null && item.note !== null && ([15, 21, 45, 48].includes(item.name_id) || item.division_id == 5) && item.intervals == 1
    },
    //by span recommended v-if
    recommendedbyRED(item){
      return [15,21,45,48].includes(item.name_id) && item.aor == 1 && item.intervals == 1
    },
    recommendedbyCAO(item){
      return ([2,39,3,8,42,34,29,52,51,36,5,47].includes(item.name_id) || item.division_id == 5) && item.intervals == 1
    },
    forApproval(item){
      return item.signature2 === null && item.signature1 !== null
    },
    forApprovalORDandChief(item){
      return [15, 20, 21, 45, 48, 13, 10, 37, 62, 53, 75, 56, 58, 55, 60, 59,77].includes(item.name_id) && item.signature2 === null && item.note !== null && item.intervals == 0
    },
    forApprovalRDinterval(item){
      return item.name_id == 20 && item.intervals == 1
    },
    forApprovalCAO(item){
      return [15].includes(item.name_id) && item.aor == 0 && item.intervals == 1
    },
    forApprovalbyRED(item){
      return item.name_id == 20 && (item.aor !== 1 || item.intervals !== 1)
    },
    forApprovalbyBD(item){
      return [15,20,21,45,48].includes(item.name_id) && item.aor == 1 && item.intervals == 1
    },
    approved(item){
      return item.signature2 !== null && item.signature1 !== null && item.note !== null
    },
    approvedORD(item){
      return [15, 20, 21, 45, 48, 13, 10, 37, 62, 53, 75, 56, 58, 55, 60, 59,77].includes(item.name_id) && item.signature2 !== null
    },
    focusTextarea(text) {
    //this.noteText += text;
    const adminText1 = "KAYSHE JOY F. PELINGON: Not within WFP";
    const adminText2 = "KAYSHE JOY F. PELINGON: Within WFP";

    // Check if the noteText already contains either of the admin texts
    if (this.noteText.includes(adminText1) || this.noteText.includes(adminText2)) {
        // If it does, replace the existing text with the new text
        this.noteText = 'KAYSHE JOY F. PELINGON: ' + text;
    } else {
        // If it doesn't, append the new text
        this.noteText += text;
    }
    this.$refs.noteInput.focus();
  },
    edit(travelOrderId) {
      this.selectedTravelOrderIdEdit = travelOrderId;
      this.$emit('edit-travel-order', travelOrderId); // Emit the selected travel order ID
    },
    closeEdit(){
      this.selectedTravelOrderIdEdit = 0
    },
    printzz(){
      window.print();
    },
    isSectionChief(name_id) {
      return this.sectionChiefIds.includes(name_id);
    },
    openOTP(){
      this.otp = true
    },
    handleOtpStatus(status){
      if (status) {
        console.log(status)
        console.log('OTP verified successfully!');
        this.otp = false
        this.otpStatus = status
      } else {
        console.log(status)
        console.log('OTP verification failed.');
        this.otp = false
        this.otpStatus = status
      }
    },
    downloadCSV() {
      const summary = ['Summary Report of Travel Order '];
      const headers = [
        'TO No.',
        'Name',
        'Date',
        'Departure Date',
        'Destination',
        'Purpose',
        'Arrival Date',
      ];

      const approvedTOs = this.csvformdata.filter(item => item.to_num > 0);

      approvedTOs.sort((a, b) => a.to_num - b.to_num);

      const groupedByMonth = {};
      approvedTOs.forEach(item => {
        const yearMonthKey = new Date(item.date).toISOString().slice(0, 7); // Get YYYY-MM part of the date
        const yearKey = new Date(item.date).getFullYear().toString(); // Get YYYY part of the date
        if (!groupedByMonth[yearMonthKey]) {
          groupedByMonth[yearMonthKey] = {};
        }
        if (!groupedByMonth[yearMonthKey][yearKey]) {
          groupedByMonth[yearMonthKey][yearKey] = [];
        }
        groupedByMonth[yearMonthKey][yearKey].push(item);
      });

      const csvData = Object.keys(groupedByMonth).flatMap(yearMonthKey => {
        const monthSections = [];
        const yearData = groupedByMonth[yearMonthKey];
        Object.keys(yearData).forEach(yearKey => {
          const yearMonthDate = new Date(yearMonthKey + '-01');
          const month = yearMonthDate.toLocaleString('default', { month: 'long' });

          const yearMonthSection = [
            [`\n ${month} ${yearKey}`],
            headers.join(','),
            ...yearData[yearKey].map(item => [
              `${this.padWithZeroes(item.to_num)}  -  ${this.yearToday}`,
              this.getName(item.name_id > 78 ? parseInt(item.name_id)-1 : item.name_id),
              `${new Date(item.date).toLocaleDateString('en-US')}`,
              `${new Date(item.departure).toLocaleDateString('en-US')}`,
              item.destination,
              item.purpose,
              `${new Date(item.arrival).toLocaleDateString('en-US')}`
            ].join(','))
          ];

          monthSections.push(yearMonthSection.join('\n'));
        });

        return monthSections;
      });

      csvData.unshift(summary);

      const csvContent = csvData.join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'Summary report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    viewNotez(nutz, numx) {
      this.viewNote = true
      this.noteText = nutz
      if ([15, 20, 21, 45, 48, 37,76, 23, 64].includes(this.acc.name_id)) {
          this.noteText += "\n" + this.getName(this.acc.name_id) + ": ";
      }
      this.notenum = numx
    },
    openNote(numz) {
      this.addNote = true,
        this.notenum = numz
      this.noteText = this.getName(this.acc.name_id) + ": "
    },
    closeNote() {
      this.addNote = false,
        this.viewNote = false,
        this.notenum = 0
    },
    postNote() {
      const formData = new FormData();
        formData.append('note', this.noteText)
      axios.post(`${API_BASE_URL}/update_form/${this.notenum}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.fetchData();
        this.selectedTravelOrderId = 0;
        useAuthStore().updateVerifiedOTPs('false');
        localStorage.setItem('verifiedOTPs', 'false');
        this.otp = false;
      }).catch(error => {
        console.error('Error:', error);
      });

      this.closeNote()
    },
    
    initialize(numz) {
      this.initnum = numz
      const formData = new FormData();
      formData.append('initial', 'initialized');

      axios.post(`${API_BASE_URL}/update_form/${this.initnum}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.fetchData();
      }).catch(error => {
        console.error('Error:', error);
      });
    },
    async signature11(form_id, name_id) {
      this.openOTP()
      // Await the result from OTP verification, handle it in handleOtpStatus method
      while (this.otp) {
        // Wait for OTP status change before continuing
        await new Promise(resolve => setTimeout(resolve, 100)); // Polling until OTP is closed (status received)
      }
      // Based on OTP status, perform desired actions
      if (this.otpStatus) {
        const formData = new FormData();
      formData.append('signature1', this.acc.signature);
      formData.append('name_id', name_id);

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
      }).catch(error => {
        console.error('Error:', error);
      });
      } else {
        console.log('OTP Verification Failed - Yawa ka'); // Failure
      }

      
    },
    async signature1(form_id) {

      this.openOTP()
      // Await the result from OTP verification, handle it in handleOtpStatus method
      while (this.otp) {
        // Wait for OTP status change before continuing
        await new Promise(resolve => setTimeout(resolve, 100)); // Polling until OTP is closed (status received)
      }
      // Based on OTP status, perform desired actions
      if (this.otpStatus) {
        const formData = new FormData();
      formData.append('signature1', this.acc.signature);
      if (this.sub.name_id == this.bus.name_id){
        formData.append('signature2', this.acc.signature);
        formData.append('sname', this.sub.name_id);
      formData.append('sdiv', this.sub.division_id);
      }

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
      }).catch(error => {
        console.error('Error:', error);
      });
      } else {
        console.log('OTP Verification Failed - Yawa ka'); // Failure
      }

      
    },

    async signature2(form_id) {
      this.openOTP()
      // Await the result from OTP verification, handle it in handleOtpStatus method
      while (this.otp) {
        // Wait for OTP status change before continuing
        await new Promise(resolve => setTimeout(resolve, 100)); // Polling until OTP is closed (status received)
      }
      // Based on OTP status, perform desired actions
      if (this.otpStatus) {
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
        this.otp = false;
      }).catch(error => {
        console.error('Error:', error);
      });
      } else {
        console.log('OTP Verification Failed - Yawa ka'); // Failure
      }
      
    },
    padWithZeroes(travel_order_id) {
      const idString = travel_order_id.toString();
      if (idString.length < 4) {
        return '0'.repeat(4 - idString.length) + idString;
      } else {
        return idString;
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

    fetchData() {
      this.load = true
      axios.get(`${API_BASE_URL}/get_forms_json`)
        .then(response => {
          this.mawala = true;
          this.load = false
          this.sub = this.employees.find(emp => emp.name_id == this.acc.name_id)
          this.bus = this.employees.find(emp => emp.rd !== null)
          this.csvformdata = response.data

          if (this.sectionChiefIds.includes(this.acc.name_id)) {
            const index = this.sectionChiefIds.indexOf(this.acc.name_id);
            const members = this.members[index];
            this.formData = response.data
          } else if (this.acc.name_id == 37) {
            this.formData = response.data
            this.siga = false
          } else if ([23, 64].includes(this.acc.name_id)) {
            this.formData = response.data
            this.siga = false
          } else if (this.acc.type_id == 1) {
            this.formData = response.data;
            this.siga = false
          } else if (this.acc.type_id == 2) {
            this.formData = response.data
            this.siga = false
          } else if (this.bus.name_id == this.sub.name_id) {
            if (this.acc.name_id !== 20) {
              this.siga = true
            } else {
              this.siga = false
            }
            this.formData = response.data
            this.siga1 = true
          } else if (this.acc.type_id == 3) {
            this.formData = response.data
            this.siga = true
            if (this.sub.name_id == 20) {
              this.formData = response.data
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
      setTimeout(() => {
        this.printzz();
      }, 500);  // 500 milliseconds = 0.5 seconds
    },
    close() {
      this.selectedTravelOrderId = 0
    },

    updateVisibleItems() {
      this.visibleItems = this.formData.slice(0, 20);
    },

    countPendingNotifications(formData, acc, sectionChiefIds, members) {
      let pendingCount = 0;

      if (sectionChiefIds.includes(acc.name_id)) {
        const index = sectionChiefIds.indexOf(acc.name_id);
        const memberGroup = members[index];

          if (acc.name_id === 48 && this.bus.name_id === this.sub.name_id) {
            pendingCount += formData.filter(form => {
              return (
                (memberGroup.includes(form.name_id) && form.initial === null) ||
                (form.division_id === this.sub.division_id && form.intervals === 0 && form.note !== null && form.signature1 === null && form.name_id !== this.sub.name_id) ||
                (form.division_id !== 5 && form.note !== null && form.signature1 !== null && form.signature2 === null) ||
                (form.division_id === 5 && form.note !== null && form.signature2 === null)
              );
            }).length;
          } else if (acc.name_id === 48) {
            pendingCount += formData.filter(form => {
              return (
                (memberGroup.includes(form.name_id) && form.initial === null) ||
                (form.division_id === this.sub.division_id && form.initial === null && form.intervals === 1 && form.name_id !== this.sub.name_id)
              );
            }).length;
          } else {
            pendingCount += formData.filter(form => {
              return memberGroup.includes(form.name_id) && form.initial === null && form.intervals === 0;
            }).length;
          }
      } else if (acc.name_id === 37) {
          pendingCount += formData.filter(form => {
            return form.note === null && form.initial !== null;
          }).length;
      } else if (acc.name_id === 23 || acc.name_id === 64) {
          pendingCount += formData.filter(form => {
            return (form.note && form.note.includes('KAYSHE JOY F. PELINGON:')) && !(form.note && (form.note.includes('MARY ASHLEY S. GADRINAB:') || form.note.includes('DULCE A. GUALBERTO:')));
          }).length;
      }else if (this.bus.name_id === this.sub.name_id) {
          if (acc.name_id !== 20) {
            pendingCount += formData.filter(form => {
              return (
                ((form.division_id !== 5 && form.note !== null && form.signature1 !== null && form.signature2 == null) || (form.division_id === 5 && form.note !== null && form.signature2 == null) || (this.sub.division_id === form.division_id && form.note !== null && form.signature1 == null && form.signature2 == null) || (form.note !== null && form.signature2 == null && [15,21,48,45].includes(form.name_id)) || (form.division_id === this.sub.division_id && form.initial == null && form.intervals == 1 && form.name_id !== this.sub.name_id)) && form.name_id !== 20
              );
            }).length;
          } else {
            pendingCount += formData.filter(form => {
              return (
                (form.division_id !== 5 && form.note !== null && form.signature1 !== null && form.signature2 === null) ||
                (form.division_id === 5 && form.note !== null && form.signature2 === null && form.name_id !== 20) || ([15,21,45,48].includes(form.name_id) && form.signature2 == null && form.name_id !== this.sub.name_id)
              );
            }).length;
          }
      } else if (acc.type_id === 3) {
          if (acc.name_id === 15) {
            pendingCount += formData.filter(form => {
              return (
                (form.note !== null && form.initial !== null && form.signature1 === null && form.intervals === 0 && form.division_id === this.sub.division_id && form.name_id !== this.sub.name_id) ||
                (form.division_id === this.sub.division_id && form.initial === null && form.name_id !== this.sub.name_id)
              );
            }).length;
          }else if (acc.name_id === 20) {
            pendingCount += formData.filter(form => {
              return (
                (form.division_id !== 5 && form.note !== null && form.signature1 !== null && form.signature2 == null) || (form.division_id === 5 && form.note !== null && form.signature2 == null && form.name_id !== this.sub.name_id) || ([15,21,45,48].includes(form.name_id) && form.initial == null && form.intervals == 1 && form.aor == 1 && form.name_id !== this.sub.name_id) || ([15,21,45,48].includes(form.name_id) && form.signature2 == null && form.name_id !== this.sub.name_id)
              );
            }).length;
          } else {
            pendingCount += formData.filter(form => {
              return (
                (form.note !== null && form.initial !== null && form.signature1 === null && form.intervals === 0 && form.division_id === this.sub.division_id && form.name_id !== this.sub.name_id) ||
                (form.division_id === this.sub.division_id && form.initial === null && form.name_id !== this.sub.name_id)
              );
            }).length;
          }
      } else if (this.acc.type_id == 2) {
          pendingCount += formData.filter(form => {
            return form.name_id === this.acc.name_id && form.signature2 == null;
          }).length;
      }        
      return pendingCount;
    },
  },

  computed: {
    pendingCount() {
      console.log(this.countPendingNotifications(this.formData, this.acc, this.sectionChiefIds, this.members))
      return this.countPendingNotifications(this.formData, this.acc, this.sectionChiefIds, this.members);
    },
    filteredData() {
      if (this.sectionChiefIds.includes(this.acc.name_id)) {
        const index = this.sectionChiefIds.indexOf(this.acc.name_id);
        const members = this.members[index];
        return this.formData.filter(form => {
          if (this.selectedStatus === 'Me') {
            return form.name_id === this.acc.name_id;
          } else if (this.selectedStatus === 'Pending' && this.acc.name_id == 48 && this.bus.name_id === this.sub.name_id) {
            this.siga = true
            this.siga1 = true
            return (members.includes(form.name_id) && form.initial === null) || (form.division_id == this.sub.division_id && form.intervals == 0 && form.note !== null && form.signature1 === null && form.name_id !== this.sub.name_id) || (form.division_id !== 5 && form.note !== null && form.signature1 !== null && form.signature2 == null) || (form.division_id === 5 && form.note !== null && form.signature2 == null)  || (form.note !== null && form.signature2 == null && [15,21,48,45].includes(form.name_id)) || (form.division_id === this.sub.division_id && form.initial == null && form.intervals == 1 && form.name_id !== this.sub.name_id);
          } else if (this.selectedStatus === 'Pending' && this.acc.name_id == 48) {
            this.siga = true
            console.log('its your smile')
            return ((members.includes(form.name_id) && form.initial === null) || (form.division_id == this.sub.division_id && form.intervals == 0 && form.note !== null && form.signature1 === null )) && form.name_id !== this.acc.name_id || (form.division_id === this.sub.division_id && form.initial == null && form.intervals == 1 && form.name_id !== this.sub.name_id);
          } else if (this.selectedStatus === 'Pending') {
            return members.includes(form.name_id) && form.initial === null && form.intervals == 0;
          } else if (this.selectedStatus === 'Done' && this.acc.name_id == 48 && this.bus.name_id === this.sub.name_id) {
            this.siga = true
            return (members.includes(form.name_id) && form.initial !== null) || (form.division_id == this.sub.division_id && form.note !== null && form.signature1 !== null ) || (this.sub.name_id == form.sname) || (form.division_id === this.sub.division_id && form.initial !== null && form.intervals == 1 && form.name_id !== this.sub.name_id);
          } else if (this.selectedStatus === 'Done' && this.acc.name_id == 48) {
            this.siga = true
            return (members.includes(form.name_id) && form.initial !== null) || (form.division_id == this.sub.division_id && form.intervals == 0 && form.note !== null && form.signature1 !== null ) || (form.division_id === this.sub.division_id && form.initial !== null && form.intervals == 1 && form.name_id !== this.sub.name_id);
          } else if (this.selectedStatus === 'Done') {
            return members.includes(form.name_id) && form.initial !== null && form.intervals == 0;
          }
          return true; // If no selection, return all
        });
      }else if (this.acc.name_id == 37){
        return this.formData.filter(form => {
          if (this.selectedStatus === 'Me') {
            return form.name_id === this.acc.name_id;
          } else if (this.selectedStatus === 'Pending') {
            // return (form.note == null) || (this.members.some(memberArray => memberArray.includes(form.name_id) && form.initial !== null && form.note == null))
            return form.note == null && form.initial !== null
          } else if (this.selectedStatus === 'Done') {
            return form.note !== null;
          }
          return true; // If no selection, return all
        });
      }else if ([23, 64].includes(this.acc.name_id)) {
          return this.formData.filter(form => {
              if (this.selectedStatus === 'Me') {
                  return form.name_id === this.acc.name_id;
              } else if (this.selectedStatus === 'Pending') {
                  return (form.note && form.note.includes('KAYSHE JOY F. PELINGON:')) && !(form.note && (form.note.includes('MARY ASHLEY S. GADRINAB:') || form.note.includes('DULCE A. GUALBERTO:')));
              } else if (this.selectedStatus === 'Done') {
                  return form.note && (form.note.includes('MARY ASHLEY S. GADRINAB:') || form.note.includes('DULCE A. GUALBERTO:'));
              }
              return true; // If no selection, return all
          });
      }else if (this.bus.name_id === this.sub.name_id) {
        return this.formData.filter(form => {
          if (this.selectedStatus === 'Me') {
            return form.name_id === this.acc.name_id;
          }  else if (this.selectedStatus === 'Pending' && this.acc.name_id !== 20) {
            return ((form.division_id !== 5 && form.note !== null && form.signature1 !== null && form.signature2 == null) || (form.division_id === 5 && form.note !== null && form.signature2 == null) || (this.sub.division_id === form.division_id && form.note !== null && form.signature1 == null && form.signature2 == null) || (form.note !== null && form.signature2 == null && [15,21,48,45].includes(form.name_id)) || (form.division_id === this.sub.division_id && form.initial == null && form.intervals == 1 && form.name_id !== this.sub.name_id)) && form.name_id !== 20;
          } else if (this.selectedStatus === 'Pending' && this.acc.name_id == 20) {
            return (form.division_id !== 5 && form.note !== null && form.signature1 !== null && form.signature2 == null) || (form.division_id === 5 && form.note !== null && form.signature2 == null && form.name_id !== this.sub.name_id) || ([15,21,45,48].includes(form.name_id) && form.initial == null && form.intervals == 1 && form.aor == 1 && form.name_id !== this.sub.name_id) || ([15,21,45,48].includes(form.name_id) && form.signature2 == null && form.name_id !== this.sub.name_id);
          } else if (this.selectedStatus === 'Done' && this.acc.name_id !== 20) {
            return (form.note !== null && form.signature1 !== null && form.signature2 !== null && this.sub.name_id == form.sname) || (this.sub.division_id === form.division_id && form.signature1 !== null) || (this.sub.name_id == form.sname) || (form.division_id === this.sub.division_id && form.initial !== null && form.intervals == 1 && form.name_id !== this.sub.name_id);
          } else if (this.selectedStatus === 'Done' && this.acc.name_id == 20) {
            return (form.note !== null && form.signature1 !== null && form.signature2 !== null) || (form.division_id === 5 && form.note !== null && form.signature2 !== null) || ([15,21,45,48].includes(form.name_id) && form.initial !== null && form.intervals == 1 && form.aor == 1 && form.name_id !== this.sub.name_id) || ([15,21,45,48].includes(form.name_id) && form.signature2 !== null && form.name_id !== this.sub.name_id);
          }
          return true; // If no selection, return all
        });
      }else if (this.acc.type_id == 3){
        return this.formData.filter(form => {
          if (this.selectedStatus === 'Me') {
            return form.name_id === this.acc.name_id;
          } else if (this.selectedStatus === 'Pending' && this.acc.name_id == 15) {
            // return (form.note == null) || (this.members.some(memberArray => memberArray.includes(form.name_id) && form.initial !== null && form.note == null))
            console.log(this.formData)
            return (form.note !== null && form.initial !== null && form.signature1 === null && form.division_id === this.sub.division_id && form.name_id !== this.sub.name_id) || (form.aor == 0 && form.intervals == 1 && [21,48,45].includes(form.name_id) && form.note !== null && form.signature1 == null) || (form.intervals == 1 && ![15,20,21,48,45].includes(form.name_id) && form.note !== null && form.signature1 == null) || (form.division_id === this.sub.division_id && form.initial == null && form.name_id !== this.sub.name_id)
          } else if (this.selectedStatus === 'Pending' && this.acc.name_id == 20) {
            // return (form.note == null) || (this.members.some(memberArray => memberArray.includes(form.name_id) && form.initial !== null && form.note == null))
            return (form.division_id !== 5 && form.note !== null && form.signature1 !== null && form.signature2 == null) || (form.division_id === 5 && form.note !== null && form.signature2 == null && form.name_id !== this.sub.name_id) || ([15,21,45,48].includes(form.name_id) && form.initial == null && form.intervals == 1 && form.aor == 1 && form.name_id !== this.sub.name_id) || ([15,21,45,48].includes(form.name_id) && form.signature2 == null && form.name_id !== this.sub.name_id);
          } else if (this.selectedStatus === 'Pending') {
            // return (form.note == null) || (this.members.some(memberArray => memberArray.includes(form.name_id) && form.initial !== null && form.note == null))
            return (form.note !== null && form.initial !== null && form.signature1 === null && form.intervals == 0 && form.division_id === this.sub.division_id && form.name_id !== this.sub.name_id) || (form.division_id === this.sub.division_id && form.initial == null && form.intervals == 1 && form.name_id !== this.sub.name_id)
          } else if (this.selectedStatus === 'Done' && this.acc.name_id == 15) {
            return (form.note !== null && form.signature1 !== null && form.intervals == 0 && form.division_id === this.sub.division_id) || (this.sub.name_id == form.sname && form.signature2 !== null) || (form.division_id === this.sub.division_id && form.initial !== null && form.intervals == 1 && form.name_id !== this.sub.name_id) || (form.intervals == 1 && ![15,20,21,48,45].includes(form.name_id) && form.note !== null && form.signature1 !== null) || form.to_num !== 0;;
          } else if (this.selectedStatus === 'Done' && this.acc.name_id == 20) {
            return (form.note !== null && form.signature1 !== null && form.signature2 !== null) || (form.division_id === 5 && form.note !== null && form.signature2 !== null) || ([15,21,45,48].includes(form.name_id) && form.initial !== null && form.intervals == 1 && form.aor == 1 && form.name_id !== this.sub.name_id) || ([15,21,45,48].includes(form.name_id) && form.signature2 !== null && form.name_id !== this.sub.name_id);
          } else if (this.selectedStatus === 'Done') {
            return (form.note !== null && form.signature1 !== null && form.intervals == 0 && form.division_id === this.sub.division_id) || (this.sub.name_id == form.sname && form.signature2 !== null) || (form.division_id === this.sub.division_id && form.initial !== null && form.intervals == 1 && form.name_id !== this.sub.name_id);
          }
          return true; // If no selection, return all
        });
      }else if (this.acc.type_id == 2) {
        return this.formData.filter(form => {
          if (this.selectedStatus === 'Me') {
            return form.name_id === this.acc.name_id;
          } else if (this.selectedStatus === 'Pending') {
            return form.name_id === this.acc.name_id && form.signature2 == null;
          } else if (this.selectedStatus === 'Done' && this.acc.name_id == 24) {
            return form.to_num !== 0;
          } else if (this.selectedStatus === 'Done') {
            return form.name_id === this.acc.name_id && form.signature2 !== null;
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
  },
}

</script>
  
  <style scoped>
  .note-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 400px;
    background: linear-gradient(150deg, #DDC7AD, #92785b);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    padding: 20px;
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.3s ease-out;
    border: solid black 2px;
  }

  .note-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-size: 20px;
    color: #000000;
  }

  .note-title {
    font-size: 24px;
    font-weight: bold;
    color: #000000; /* Elegant gold */
  }

  .close-btn {
    font-size: 50px;
    cursor: pointer;
    color: #000000;
    border-radius: 20px;
    padding: 10px 20px;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .close-btn:hover {
    opacity: 1;
  }

  .note-body {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .notetextarea {
    width: 100%;
    border: none;
    padding: 15px;
    border-radius: 10px;
    background-color: #404040;
    color: #fff;
    font-size: 16px;
    resize: none;
    box-sizing: border-box;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .notetextarea:focus {
    outline: none;
    box-shadow: inset 0 2px 10px rgba(255, 215, 0, 0.5); /* Gold focus */
  }

  .note-options {
    display: flex;
    justify-content: space-evenly;
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

  .note-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
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

  /* Animations */
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

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

  /* Button Styling */
  .luxury-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(150deg, #DDC7AD, #92785b);
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    padding: 12px 25px;
    border-radius: 25px;
    border: none;
    cursor: pointer;
    width: 75px;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .luxury-btn:hover {
    background-color: #732d91;
    transform: translateY(-3px);
    width: 200px;
  }

  .luxury-btn:active {
    transform: translateY(1px);
  }

  .luxury-btn-icon {
    margin-right: -75px;
  }

  .luxury-download-icon {
    height: 30px;
    width: 30px;
  }

  .luxury-btn-text {
    color: black;
    font-size: 14px;
    opacity: 0;
  }

  .luxury-btn:hover .luxury-btn-text {
    opacity: 100;
  }

  .luxury-btn:hover .luxury-btn-icon {
    margin-right: 0px;
  }

  .luxury-search-bar {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    .luxury-search-input {
      width: 180px;
    }
  }

  /* Table Container */
  .outer {
    width: 100%;
    max-width: 100%; /* Ensure it takes full width */
    margin-top: 10px;
    background-color: #f8f9fa;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow-x: auto; /* Enable horizontal scrolling on smaller screens */
  }

  /* Scrollable Table */
  .scrollable-table {
    width: 100%; /* Table takes full width */
    overflow-x: auto;
    max-height: 630px;
    overflow-y: auto;
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

  /* Status Indicators */
  .status-pending {
    color: red;
  }

  .status-approved {
    color: green;
  }

  .status-icon {
    height: 16px;
    width: 16px;
    vertical-align: middle;
    margin-right: 5px;
  }

  /* Buttons */
  .status-actions button {
    padding: 10px 25px;
    border: none;
    border-radius: 8px;
    background-color: #000000;
    color: white;
    font-size: 14px;
    cursor: pointer;
    margin: 5px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .status-actions button:hover {
    background-color: #4a76d7;
    transform: translateY(-2px);
  }

  .status-actions .action-icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin-top: 5px;
    transition: opacity 0.3s ease;
  }

  .status-actions .action-icon:hover {
    opacity: 0.7;
  }

  .status-actions button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  /* Text Alignment and Spacing */
  h1.no-match {
    text-align: center;
    color: #999;
    font-size: 18px;
    margin-top: 20px;
  }

  td, th {
    vertical-align: middle;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    table {
      font-size: 12px;
    }

    .luxury-title{
      flex-direction: column;
    }
    .luxury-title select {
      margin-left: 0px;
    }
    .status-actions button {
      padding: 8px 18px;
      font-size: 12px;
    }

    .status-actions .action-icon {
      width: 24px;
      height: 24px;
    }

    th, td {
      padding: 8px 12px;
    }
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

  /* Add specific color schemes for statuses */
  .status-pending {
    color: red;
  }

  .status-approved {
    color: green;
  }

  .status-recommended {
    color: orange;
  }

  .status-actions button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  /* Miscellaneous Styling */
  button, .action-icon {
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }

  button:active, .action-icon:active {
    transform: scale(0.98);
  }

  /* Loader or No Data */
  .loader {
    text-align: center;
    font-size: 16px;
    color: #007bff;
    margin: 20px;
  }

  .no-data-message {
    text-align: center;
    font-size: 16px;
    color: #777;
    padding: 30px 0;
  }

  @media print{
    .note-modal, .luxury-container, .buttons{
      display: none;
    }
  }
</style>
