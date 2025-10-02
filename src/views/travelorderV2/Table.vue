<template>
    <editform v-if="selectedTravelOrderIdEdit > 0" :travelOrderId="selectedTravelOrderIdEdit" @cancel-edit="closeEdit"></editform>
    <otpz v-if="otp" @handleCloseOTP="handleOtpStatus" />
    <!-- <button @click="toggleOTPVisibility">Toggle OTP Component</button> -->
    <NoteModal
      :isVisible="isNoteModalVisible"
      :isAdding="isAdding"
      :notenum="currentNoteId"
      :noteText="currentNoteText"
      :type="currentNoteType"
      @close="closeNoteModal"
      @notePosted="handleNotePosted"
    />
  
    <div class="luxury-container">
    
  <div v-if="load" class="loader"></div> <!-- Loader here -->
  <!-- <div v-if="load" class="luxury-loading">
    <img src='../../assets/loading.gif' alt="Loading..." />
  </div> -->

  <div class="luxury-search-container">
    <div class="luxury-title">    
      <div class="radio-inputs">
        <label class="radio" v-for="option in options" :key="option">
          <input type="radio" name="status" v-model="selectedStatus" :value="option">
          <span class="name">
            {{ option }}
            <span class="pending-count" v-if="option == 'Pending'">{{ pendingCount < 9 ? pendingCount : '9+'}}</span>
          </span>
        </label>
      </div>
      <div>
        <!-- <select v-model="numberOfRows" id="rows">
          <option v-for="rows in rowOptions" :key="rows" :value="rows">
            {{ rows }}
          </option>
        </select> -->
      </div>
    </div>
    <div class="luxury-search-bar">
      <div v-if="mawala" class="luxury-search-box">
        <img class="luxury-search-icon" src="../../assets/search.png" alt="Search" />
        <input class="luxury-search-input" type="text" v-model="searchQuery" placeholder="Search TO number or Name" />
      </div>
      
      <button v-if="mawala && [2, 15, 24, 76, 39].includes(nameId)" class="luxury-btn" @click="downloadCSV">
        <div class="luxury-btn-icon">
          <img class="luxury-download-icon" src="../../assets/download_excel.png" alt="Download" />
        </div>
        <div class="luxury-btn-text">Download Summary Reports</div>
      </button>
    </div>
  </div>
      
  <div v-if="mawala" class="outer">
  <div class="scrollable-table"  @scroll.passive="handleScroll" ref="scrollContainer">
    <table>
      <thead>
        <tr>
          <th>TO No.</th>
          <th>Name</th>
          <th>Date</th>
          <th>Destination</th>
          <th>Purpose</th>
          <th>Departure Date</th>
          <th>Arrival Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in reversedFormData" :key="item.id">
          <td>{{ padWithZeroes(item.to_num) }} - {{ item.date.slice(0,4) }}</td>
          <td>{{ getName(parseInt(item.name_id)) }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.destination }}</td>
          <td>{{ item.purpose }}</td>
          <td>{{ item.departure }}</td>
          <td>{{ item.arrival }}</td>
          <td v-if="isInitialNull(item)" class="status-pending">
            <img src="../../assets/close.png" alt="Pending" class="status-icon">
            For Initial by: <span v-if="[15,21,45,48, 3].includes(item.name_id)">RD</span> <span v-else-if="[2,39,3,8,42,34,29,52,51,36,5,47,17].includes(item.name_id) && item.intervals == 1">DC</span> <span v-else-if="item.intervals == 1">DC</span> <span v-else>SC</span>
          </td>
          
          <td v-if="!isInitialNull(item)">
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
          <td class="status-actions" v-if="item.name_id == nameId || nameId == 76">
            <button v-if="selectedTravelOrderIdEdit != item.travel_order_id" @click="edit(item.travel_order_id)">Edit</button>
            <img src="/src/assets/canceledit.png" v-if="selectedTravelOrderIdEdit == item.travel_order_id" @click="closeEdit" class="action-icon"/>
          </td>
          <td class="status-actions">
            <button v-if="selectedTravelOrderId != item.travel_order_id" @click="openPDF(item.travel_order_id)">PDF</button>
            <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.travel_order_id" @click="close" class="action-icon"/>
          </td>
          
          <!-- Signature Actions -->
          <td v-if="([15,20,21,45,48, 3].includes(nameId) && item.note !== null && item.signature1 == null && ![15, 21, 45, 48, 3].includes(item.name_id) && item.division_id !== 5 && item.intervals == 0) || (nameId == 15 && item.note !== null && item.signature1 == null && item.intervals == 1)" class="status-actions">
            <!-- <button @click="signature1(item.travel_order_id)">{{ sub.name_id === bus.name_id ? 'Approve' : 'Recommend' }}</button> -->
            <button @click="signature1(item.travel_order_id)">Recommend</button>
          </td>

          <td v-if="nameId == 20 && item.note !== null && item.signature1 == null && item.intervals == 1 && [15, 21, 45, 48, 3].includes(item.name_id)" class="status-actions">
            <button @click="signature11(item.travel_order_id, item.name_id)">Recommends CAO</button>
          </td>

          <td v-if="item.travel_order_id !== currentNoteId && item.note == null && (nameId == 37 || nameId == 76)" class="status-actions">
            <button @click="openAddNoteModal(item.travel_order_id)">Add Note</button>
          </td>

          <td v-if="isNoteModalVisible && item.travel_order_id == currentNoteId && (nameId == 37 || nameId == 76)" class="status-actions">
            <img src="/src/assets/close_note.png" @click="closeNoteModal()" class="action-icon"/>
          </td>

          <td v-if="item.note !== null && currentNoteId !== item.travel_order_id" class="status-actions">
            <button @click="openViewNoteModal(item.note, item.travel_order_id)">View Note</button>
          </td>

          <td v-if="(((employees.rd || nameId == 20) && item.note !== null && item.name_id !== 20 && item.signature2 === null) && 
          ((item.signature1 !== null && item.division_id !== 5) || //done reco to be p
          (item.signature2 === null && item.division_id === 5) || //ord to be reco
          (item.signature1 !== null && item.division_id === 5 && item.intervals == 1)|| 
          ([15, 21, 45, 48, 3].includes(item.name_id) && item.note !== null)))" class="status-actions">
            <button @click="signature2(item.travel_order_id)">Approve</button>
          </td>

          <td v-if="(isSectionChief(nameId) && selectedTravelOrderId != item.travel_order_id && item.initial === null && this.nameId !== item.name_id) || ([15,21,45,48, 3].includes(this.nameId) && item.initial === null && item.intervals == 1 && this.nameId !== item.name_id) || ([20].includes(this.nameId) && item.initial === null && item.intervals == 1 && item.aor == 1 && this.nameId !== item.name_id)" class="status-actions">
            <button @click="initialize(item.travel_order_id)">Initial</button>
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
import NoteModal from '@/components/note/Note.vue';
import ItemIndicators from '@/components/validators/TravelOrderTable.js';
import { API_BASE_URL } from '../../config'
import { useAuthStore } from '../../store/auth';
import { f } from 'html2pdf.js';
import { usePendingStore } from '@/store/pending';

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
    NoteModal,
    ItemIndicators
  },
  mounted() {
    this.fetchEmployees();
    this.fetchNames();
    this.fetchData();
    this.setupWebSocket()
    window.addEventListener('afterprint', this.handleAfterPrint);
  },
  beforeDestroy() {
    clearInterval(this.fetchInterval); // Clear the interval when the component is destroyed
    window.removeEventListener('afterprint', this.handleAfterPrint);
  },
  data() {
    const authStore = useAuthStore();
    return {
      pendingStore: usePendingStore(),
      numberOfRows: 3,  // Default number of rows to fetch
      rowOptions: [10, 20, 50, 100, 200, 500, 1000, 5000, 10000], // Options for number of rows to fetch
      selectedStatus: 'Me',
      optionsEmp: ['Pending', 'Done', 'All'],
      options: ['Pending', 'Done', 'Me'],
      sectionChiefIds: [39, 2,  8, 42, 34, 29, 36, 11, 5, 47],
      members: [
        [23, 25, 35, 70, 64, 78], 
        [30, 7, 26, 18, 67, 49, 24],
        // [43, 40, 71, 81], temp disable 3 asis
        [32, 50, 71],
        [33, 6],
        [41, 46, 80],
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
      accountId: authStore.name_id,
      nameId: authStore.name_id,
      signature: authStore.signature,
      otp: false,
      otpStatus: false,
      load: true,
      mawala: false,
      initnum: 0,
      noteText: '',
      searchQuery: '',
      csvformdata: [],
      isVisible: true,
      fetchInterval: null, // To store the interval ID

      isNoteModalVisible: false, // Control visibility of the modal
      isAdding: false, // Control whether we are adding or viewing a note
      currentNoteId: 0,
      currentNoteText: '',
      currentNoteType: '',
      socket: '',
    };
  },
  methods: {
    setupWebSocket() {
        this.socket = new WebSocket('ws://202.137.117.84:8012/ws/chat/');
  
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
        };
  
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          // Check if the message is relevant to the current chat
            // this.messages.push({ sender: data.sender, receiver: data.receiver, message: data.message });
            console.log(data)
        };
  
        this.socket.onclose = (event) => {
          console.log('WebSocket closed:', event);
        };
  
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      },
    handleAfterPrint() {
      // Code to execute after printing
      this.close()
      // You can reset any flags or perform cleanup here
    },
    isInitialNull(item) {
      return ItemIndicators.isInitialNull(item);
    },
    isInitialized(item) {
      return ItemIndicators.isInitialized(item);
    },
    initializedByRD(item) {
      return ItemIndicators.initializedByRD(item);
    },
    initializedByDC(item) {
      return ItemIndicators.initializedByDC(item);
    },
    isNoteNull(item) {
      return ItemIndicators.isNoteNull(item);
    },
    isNoted(item) {
      return ItemIndicators.isNoted(item);
    },
    forRecommendationNoneORDNoneChief(item) {
      return ItemIndicators.forRecommendationNoneORDNoneChief(item);
    },
    forRecommendationORDandChiefwithIntervals(item) {
      return ItemIndicators.forRecommendationORDandChiefwithIntervals(item);
    },
    forRecommendationCAOnotIncluded(item) {
      return ItemIndicators.forRecommendationCAOnotIncluded(item);
    },
    forRecommendationbyRED(item) {
      return ItemIndicators.forRecommendationbyRED(item);
    },
    forRecommendationToSCbyCAO(item) {
      return ItemIndicators.forRecommendationToSCbyCAO(item);
    },
    recommendedNoneORDNoneChief(item) {
      return ItemIndicators.recommendedNoneORDNoneChief(item);
    },
    recommendedORDandChiefwithIntervals(item) {
      return ItemIndicators.recommendedORDandChiefwithIntervals(item);
    },
    recommendedbyRED(item) {
      return ItemIndicators.recommendedbyRED(item);
    },
    recommendedbyCAO(item) {
      return ItemIndicators.recommendedbyCAO(item);
    },
    forApproval(item) {
      return ItemIndicators.forApproval(item);
    },
    forApprovalORDandChief(item) {
      return ItemIndicators.forApprovalORDandChief(item);
    },
    forApprovalRDinterval(item) {
      return ItemIndicators.forApprovalRDinterval(item);
    },
    forApprovalCAO(item) {
      return ItemIndicators.forApprovalCAO(item);
    },
    forApprovalbyRED(item) {
      return ItemIndicators.forApprovalbyRED(item);
    },
    forApprovalbyBD(item) {
      return ItemIndicators.forApprovalbyBD(item);
    },
    approved(item) {
      return ItemIndicators.approved(item);
    },
    approvedORD(item) {
      return ItemIndicators.approvedORD(item);
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
    openAddNoteModal(noteId) {
      this.currentNoteId = noteId; // Set the note ID for the new note
      this.currentNoteType = 'update_form'; // Set the type for the note
      this.currentNoteText = this.getName(this.nameId) + ": "; // Initialize the note text
      this.isAdding = true; // Set to adding mode
      this.isNoteModalVisible = true; // Show the modal
    },
    openViewNoteModal(noteText, noteId) {
      this.currentNoteId = noteId; // Set the note ID to view
      this.currentNoteType = 'update_form'; // Set the type based on your logic
      this.currentNoteText = noteText; // Set the existing note text
      if ([15, 20, 21, 45, 48, 3, 37,76, 23, 64].includes(this.nameId)) {
        this.currentNoteText += "\n" + this.getName(this.nameId) + ": ";
      }
      this.isAdding = false; // Set to viewing mode
      this.isNoteModalVisible = true; // Show the modal
      console.log('Opening view note modal');
    },
    closeNoteModal() {
      this.isNoteModalVisible = false; // Hide the modal
      this.currentNoteId = 0
    },
    handleNotePosted(noteText) {
      console.log('Note posted:', noteText);
      // Handle the note posted event (e.g., refresh the note list)
      this.fetchData();
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
        formData.append('signature1', this.signature);
        formData.append('name_id', name_id);

        axios.post(`${API_BASE_URL}/update_form/${form_id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          this.fetchData();
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
        formData.append('signature1', this.signature);

        axios.post(`${API_BASE_URL}/update_form/${form_id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          this.fetchData();
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
        formData.append('signature2', this.signature);
        formData.append('sname', this.employees.name_id);
        formData.append('sdiv', this.employees.division_id);

        axios.post(`${API_BASE_URL}/update_form/${form_id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          this.fetchData();
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
    handleScroll() {
    const container = this.$refs.scrollContainer;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
      console.log("scroll")
      // Near bottom, load more
      this.fetchData();
    }
  },
    fetchData(reset = false) {
      if (reset) {
      this.formData = []; // Clear the array only when status changes
    }
      this.load = true
      axios.get(`${API_BASE_URL}/get_forms_json/${this.nameId}/${this.selectedStatus}/${this.numberOfRows}/${this.formData.length}`)
        .then(response => {
          this.mawala = true;
          this.load = false
          this.csvformdata = response.data
          // this.formData=response.data
          this.formData = [...this.formData, ...response.data]; // Append new data
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
      axios.get(`${API_BASE_URL}/get_employees_json/${this.nameId}`)
        .then(response => {
          this.employees = response.data;
          console.log(this.employees)
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
      console.log(this.selectedTravelOrderId)
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
  },

  computed: {
    pendingCount() {
      return this.pendingStore.travelorder
    },
    filteredData() {
      return this.formData; // Return all if not section chief
    },
    reversedFormData() {
      //let data = this.formData.slice().reverse(); // Make a copy of the original data
      let data = this.formData.slice(); // Make a copy of the original data

      if (this.searchQuery !== '') {
        data = data.filter(item => {
          return String(this.padWithZeroes(item.to_num)).includes(this.searchQuery) || String(this.getName(item.name_id)).toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      }
      return data;
    },
  },
  watch: {
    selectedStatus() {
    this.fetchData(true); // Pass true to reset on status change
  },
    numberOfRows: 'fetchData' // Watch for changes in number of rows
  }
}

</script>
  
  <style>
  /* From Uiverse.io by Yaya12085 */ 
.radio-inputs {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border-radius: 0.5rem;
  background: linear-gradient(to top, #a1834a, #b8860b); /* Gradient from light gold to dark gold */
  box-sizing: border-box;
  box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
  padding: 0.25rem;
  width: 300px;
  font-size: 14px;
}

.radio-inputs .radio {
  flex: 1 1 auto;
  text-align: center;
}

.radio-inputs .radio input {
  display: none;
}

.radio-inputs .radio .name {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: none;
  padding: .5rem 0;
  color: rgb(255, 255, 255);
  transition: all .15s ease-in-out;
  position: relative; /* Add this */
}

.radio-inputs .radio .pending-count {
  position: absolute; /* Position it absolutely */
  top: 0; /* Align to the top */
  right: 0; /* Align to the right */
  background-color: #ff0000; /* Optional: background color for visibility */
  border-radius: 50%; /* Optional: make it circular */
  padding: 0.2rem 0.4rem; /* Optional: padding for the count */
  font-size: 12px; /* Optional: font size */
  color: #fff; /* Optional: text color */
}

.radio-inputs .radio input:checked + .name {
  background-color: #e4c370;
  font-weight: 600;
  color: black;
}
  .note-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9000;
    width: 400px;
    background: linear-gradient(150deg, #a1834a, #b8860b); /* Gradient from light gold to dark gold */
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
    flex-direction: row;
    margin-top: -30px;
  }
  .luxury-title .mawala{
    text-indent: 10px;
  }

  /* Custom Select Box */
  .luxury-title select {
    background: linear-gradient(150deg, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
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
    height: 100vh; /* Full height of the viewport */
    padding: 50px; /* Optional padding */
  }

  .luxury-loading img {
    width: 120px;
    height: auto;
  }

  /* Search Section Styling */
  .luxury-search-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    background: linear-gradient(150deg, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    padding: 6px 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    width: 50px;
    height: 50px;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin-top: 15px;
  }

  .luxury-btn:hover {
    background-color: #732d91;
    transform: translateY(-3px);
    width: 280px;
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

 

  /* Table Container */
  .outer {
    width: 100%;
    max-width: 100%; /* Ensure it takes full width */
    margin-top: 10px;
    border-radius: 15px;
    overflow-x: auto; /* Enable horizontal scrolling on smaller screens */
  }

  /* Scrollable Table */
  .scrollable-table {
    width: 100%; /* Table takes full width */
    overflow-x: auto;
    max-height: 60vh;
    height: 60vh;
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
    background: linear-gradient(180deg, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
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
    background-color: black;
    border-radius: 8px;
    color: rgb(255, 255, 255);
    font-size: 14px;
    font-weight: bolder;
    border: solid black 2px;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  tr td.status-actions button:hover {
    background-color: #6e6e6e;
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
