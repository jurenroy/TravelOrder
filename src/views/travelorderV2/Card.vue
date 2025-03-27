<template>
    <editform v-if="selectedTravelOrderIdEdit > 0" :travelOrderId="selectedTravelOrderIdEdit" @cancel-edit="closeEdit"></editform>
    <otpz v-if="otp" @handleCloseOTP="handleOtpStatus" />
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
              <h3>Travel Order No: {{ padWithZeroes(item.to_num) }} - {{ item.date.slice(0, 4) }}</h3>
              <br>
              <div class="status">
                <span v-if="!approved(item) || !approvedORD(item)" class="status-pending">On-going</span>
                <span v-else class="status-approved">Approved</span>
              </div>
            </div>
            <div class="card-body">
              <p><strong>Date:</strong> {{ item.date }}</p>
              <p><strong>Name:</strong> {{ getName(parseInt(item.name_id)) }}</p>
              <p v-if="item.aor == 1"><strong style="color: red"> Outside Area of Responsibility</strong></p>
              <p><strong>Destination:</strong> {{ item.destination }}</p>
              <p><strong>Purpose:</strong> {{ item.purpose }}</p>
              <p><strong>Departure Date:</strong> {{ item.departure }}</p>
              <p><strong>Arrival Date:</strong> {{ item.arrival }}</p>
              <p v-if="item.intervals == 1"><strong style="color: red"> More Than 7 days.</strong></p>
              <!-- Status Messages -->
              <div v-if="isInitialNull(item)" class="status-message">
                <img src="../../assets/close.png" alt="Pending" class="status-icon">
                <p class="status-pending">For Initial by: </p>
                <span v-if="[15,21,45,48, 3].includes(item.name_id)">RD</span>
                <span v-else-if="[2,39,8,42,34,29,52,51,36,5,47,17].includes(item.name_id) && item.intervals == 1">DC</span>
                <span v-else-if="item.intervals == 1">DC</span>
                <span v-else>SC</span>
              </div>
  
              <div v-else class="status-message">
                <p v-if="isInitialized(item)" class="status-approved">
                  <img src="../../assets/check.png" alt="Approved" class="status-icon">
                  {{ item.initial.charAt(0).toUpperCase() + item.initial.slice(1) }} 
                  <span v-if="initializedByRD(item)">by RD</span>
                  <span v-else-if="initializedByDC(item)">by DC</span> 
                  <span v-else-if="item.intervals == 1">DC</span> 
                  <span v-else>SC</span>
                </p>
  
                <p v-if="isNoteNull(item)" class="status-pending">
                  <img src="../../assets/close.png" alt="Pending Note" class="status-icon">
                  To be Noted
                </p>
                
                <p v-if="isNoted(item)" class="status-approved">
                  <img src="../../assets/check.png" alt="Noted" class="status-icon">
                  Noted
                </p>
              
                <p v-if="(forRecommendationNoneORDNoneChief(item) || forRecommendationORDandChiefwithIntervals(item)) && forRecommendationCAOnotIncluded(item)" class="status-pending">
                  <img src="../../assets/close.png" alt="Pending Recommendation" class="status-icon">
                  For Recommendation 
                  <span v-if="forRecommendationbyRED(item)">by RED</span> 
                  <span v-else-if="forRecommendationToSCbyCAO(item)">by CAO</span> 
                  <span v-else-if="item.intervals == 1">by CAO</span> 
                  <span v-else>by DC</span>
                </p>
              
                <p v-if="recommendedNoneORDNoneChief(item) || recommendedORDandChiefwithIntervals(item)" class="status-approved">
                  <img src="../../assets/check.png" alt="Approved Recommendation" class="status-icon">
                  Recommended 
                  <span v-if="recommendedbyRED(item)">by RED</span> 
                  <span v-else-if="recommendedbyCAO(item)">by CAO</span> 
                  <span v-else-if="item.intervals == 1">by CAO</span> 
                  <span v-else>by DC</span>
                </p>
              
                <p v-if="(forApproval(item) || forApprovalORDandChief(item) || forApprovalRDinterval(item)) || forApprovalCAO(item)" class="status-pending">
                  <img src="../../assets/close.png" alt="Pending Approval" class="status-icon">
                  For Approval 
                  <span v-if="forApprovalbyRED(item)">by RED</span>
                  <span v-if="forApprovalbyBD(item)">by BD</span>
                </p>
              
                <p v-if="approved(item) || approvedORD(item)" class="status-approved">
                  <img src="../../assets/check.png" alt="Approved" class="status-icon">
                  Approved 
                  <span v-if="item.sname !== 20">by: {{ getName(item.sname) }}</span>
                </p>
              </div>
            </div>
            <div class="card-footer">
              <div class="status-actions">
                <button class="card-button" v-if="item.name_id == nameId || nameId == 20" @click="edit(item.travel_order_id)">Edit</button>
                <img src="/src/assets/canceledit.png" v-if="selectedTravelOrderIdEdit == item.travel_order_id" @click="closeEdit" class="action-icon"/>
              </div>
              <div class="status-actions">
                <button class="card-button" v-if="selectedTravelOrderId != item.travel_order_id" @click="openPDF(item.travel_order_id)">PDF</button>
                <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.travel_order_id" @click="close" class="action-icon"/>
              </div>
              <div class="status-actions">
                  <div>
                      <button class="card-button" v-if="([15,20,21,45,48, 3].includes(nameId) && item.note !== null && item.signature1 == null && ![15, 21, 45, 48, 3].includes(item.name_id) && item.division_id !== 5 && item.intervals == 0) || (nameId == 15 && item.note !== null && item.signature1 == null && item.intervals == 1)" @click="signature1(item.travel_order_id)">Recommend</button>
                  </div>
              </div>
              <div class="status-actions">
                  <div>
                      <button class="card-button" v-if="nameId == 20 && item.note !== null && item.signature1 == null && item.intervals == 1 && [15, 21, 45, 48, 3].includes(item.name_id)" @click="signature11(item.travel_order_id, item.name_id)">Recommends CAO</button>
                  </div>
              </div>
              <div class="status-actions">
                  <div>
                      <button class="card-button" v-if="item.travel_order_id !== currentNoteId && item.note == null && (nameId == 37 || nameId == 76)" @click="openAddNoteModal(item.travel_order_id)">Add Note</button>
                  </div>
              </div>
              <div class="status-actions">
                  <div>
                      <img src="/src/assets/close_note.png" v-if="isNoteModalVisible && item.travel_order_id == currentNoteId && (nameId == 37 || nameId == 76)" @click="closeNoteModal()" class="action-icon"/>
                  </div>
              </div>
              <div class="status-actions">
                  <div>
                      <button class="card-button" v-if="item.note !== null && currentNoteId !== item.travel_order_id" @click="openViewNoteModal(item.note, item.travel_order_id)">View Note</button>
                  </div>
              </div>
              <div class="status-actions">
                  <div>
                      <button class="card-button" v-if="(((employees.rd || nameId == 20) && item.note !== null && item.name_id !== 20 && item.signature2 === null) && 
                      ((item.signature1 !== null && item.division_id !== 5) || //done reco to be p
                      (item.signature2 === null && item.division_id === 5) || //ord to be reco
                      (item.signature1 !== null && item.division_id === 5 && item.intervals == 1)|| 
                      ([15, 21, 45, 48, 3].includes(item.name_id) && item.note !== null)))" @click="signature2(item.travel_order_id)">Approve</button>
                  </div>
              </div>
              <div class="status-actions">
                  <div>
                      <button class="card-button" v-if="(isSectionChief(nameId) && selectedTravelOrderId != item.travel_order_id && item.initial === null && this.nameId !== item.name_id) || ([15,21,45,48, 3].includes(this.nameId) && item.initial === null && item.intervals == 1 && this.nameId !== item.name_id) || ([20].includes(this.nameId) && item.initial === null && item.intervals == 1 && item.aor == 1 && this.nameId !== item.name_id)" @click="initialize(item.travel_order_id)">Initial</button>
                  </div>
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
        <h1 v-if="reversedFormData.length == 0" class="no-match">NO PENDING TRAVEL ORDER FOUND</h1>
      </div>
    </div>
    <div v-show="selectedTravelOrderId" class="prent full-screen">
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
  import { API_BASE_URL } from '../../config';
  import { useAuthStore } from '../../store/auth';
  import { usePendingStore } from '@/store/pending'
  
  export default {
    components: {
      pdf,
      otpz,
      editform,
      form,
      NoteModal,
      ItemIndicators
    },
    data() {
      const authStore = useAuthStore();
      return {
        selectedStatus: 'Me',
        options: ['Pending', 'Done', 'Me'],
        sectionChiefIds: [39, 2,  8, 42, 34, 29, 36, 11, 5, 47],
        members: [
          [23, 25, 35, 70, 64, 78], 
          [30, 7, 26, 18, 67, 49, 24],
          // [43, 40, 71, 81], temp disable asis 3
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
        load: true,
        mawala: false,
        initnum: 0,
        searchQuery: '',
        isNoteModalVisible: false,
        isAdding: false,
        currentNoteId: 0,
        currentNoteText: '',
        currentNoteType: '',
        pendingStore: usePendingStore(),
        currentCardIndex: 0,
        startX: 0,
        endX: 0,
      };
    },
    mounted() {
      this.fetchEmployees();
      this.fetchNames();
      this.fetchData();
      window.addEventListener('afterprint', this.handleAfterPrint);
      window.addEventListener('keydown', this.handleKeydown);
    },
    beforeDestroy() {
    window.removeEventListener('afterprint', this.handleAfterPrint);
    window.removeEventListener('keydown', this.handleKeydown);
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
        this.$emit('edit-travel-order', travelOrderId);
      },
      closeEdit() {
        this.selectedTravelOrderIdEdit = 0;
      },
      printzz() {
        window.print();
      },
      isSectionChief(name_id) {
        return this.sectionChiefIds.includes(name_id);
      },
      openOTP() {
        this.otp = true;
      },
      handleOtpStatus(status) {
        if (status) {
          console.log('OTP verified successfully!');
          this.otp = false;
        } else {
          console.log('OTP verification failed.');
          this.otp = false;
        }
      },
      openAddNoteModal(noteId) {
        this.currentNoteId = noteId;
        this.currentNoteType = 'update_form';
        this.currentNoteText = this.getName(this.nameId) + ": ";
        this.isAdding = true;
        this.isNoteModalVisible = true;
      },
      openViewNoteModal(noteText, noteId) {
        this.currentNoteId = noteId;
        this.currentNoteType = 'update_form';
        this.currentNoteText = noteText;
        this.isAdding = false;
        this.isNoteModalVisible = true;
      },
      closeNoteModal() {
        this.isNoteModalVisible = false;
        this.currentNoteId = 0;
      },
      handleNotePosted(noteText) {
        this.fetchData();
      },
      initialize(numz) {
        // Initialization logic here
      },
      async signature1(form_id) {
        // Signature logic here
      },
      async signature2(form_id) {
        // Signature logic here
      },
      padWithZeroes(travel_order_id) {
        const idString = travel_order_id.toString();
        return idString.length < 4 ? '0'.repeat(4 - idString.length) + idString : idString;
      },
      fetchData() {
        this.load = true;
        axios.get(`${API_BASE_URL}/get_forms_json/${this.nameId}/Pending/10`)
          .then(response => {
            this.mawala = true;
            this.load = false;
            this.formData = response.data;
            this.pendingStore.count('travelorder', this.formData.length)
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
          })
          .catch(error => {
            console.error('Error fetching employees:', error);
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
        this.selectedTravelOrderId = 0;
      },
    },
    computed: {
      reversedFormData() {
        let data = this.formData.slice().reverse();
        if (this.searchQuery !== '') {
          data = data.filter(item => {
            return String(this.padWithZeroes(item.to_num)).includes(this.searchQuery) || String(this.getName(item.name_id)).toLowerCase().includes(this.searchQuery.toLowerCase());
          });
        }
        return data;
      },
    },
    watch: {
      selectedStatus: 'fetchData',
      selectedMonth: 'fetchData',
      selectedYear: 'fetchData'
    }
  }
  </script>
  
  <style>
.navigation {
  display: flex;
  align-items: center; /* Center the arrows vertically with the card */
  justify-content: center; /* Center the navigation area */
  display: flex;
}

.arrow {
  display: block;
  position: relative;
  width: 56px;
  height: 56px;
  margin: 0;
  overflow: hidden;
  outline: none;
  background-color: transparent;
  border: 0;
}

.arrow:before,
.arrow:after {
  content: "";
  position: absolute;
  border-radius: 50%;
  inset: 7px;
}

.arrow:before {
  border: 4px solid #e0e0e0;
  transition: opacity .4s cubic-bezier(.77, 0, .175, 1) 80ms, transform .5s cubic-bezier(.455, .03, .515, .955) 80ms;
}

.arrow:after {
  border: 4px solid #000000;
  transform: scale(1.3);
  transition: opacity .4s cubic-bezier(.165, .84, .44, 1), transform .5s cubic-bezier(.25, .46, .45, .94);
  opacity: 0;
}

.arrow:hover:before,
.arrow:focus:before {
  opacity: 0;
  transform: scale(0.7);
  transition: opacity .4s cubic-bezier(.165, .84, .44, 1), transform .5s cubic-bezier(.25, .46, .45, .94);
}

.arrow:hover:after,
.arrow:focus:after {
  opacity: 1;
  transform: scale(1);
  transition: opacity .4s cubic-bezier(.77, 0, .175, 1) 80ms, transform .5s cubic-bezier(.455, .03, .515, .955) 80ms;
}

.arrow-box {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
}

.arrow-elem {
  display: block;
  width: 20px;
  height: 20px;
  margin: 17px 18px 0 18px;
  transform: rotate(180deg);
  fill: #F0EEEF;
}

.arrow:hover .arrow-box,
.arrow:focus .arrow-box {
  transition: .4s;
  transform: translateX(-56px);
}

@media (max-width: 768px) {
  .arrow{
    display: none;
  }
  .navigation{
    display: block;
  }
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px; /* Space between cards */
    justify-content: center; /* Center the cards */
    height: 80vh;
}

.card {
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    padding: 30px;
    margin: 10px;
    transition: transform 0.3s, box-shadow 0.3s;
    width: 520px; /* Set a fixed width for cards */
    border: 2px solid #b8860b; /* Dark gold border */
    display: flex;
    flex-direction: column; /* Stack children vertically */
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Playfair Display', serif; /* Elegant font */
    color: #333;
}

.card-body {
    margin-top: 15px;
    font-family: 'Roboto', sans-serif; /* Clean font */
    color: #555;
    flex-grow: 1; /* Allow the body to grow and take available space */
}

.card-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.status-pending {
    color: #e74c3c; /* Red for pending */
}

.status-approved {
    color: #2ecc71; /* Green for approved */
}

.status-message {
    margin: 5px 0;
}

.status-icon {
    height: 20px;
    width: 20px;
    vertical-align: middle;
    margin-right: 5px;
}

.status-actions {
    display: flex;
    justify-items: space-between;
}

.card-button {
    background-color: black;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 20px 40px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
}

.card-button:hover {
    background: linear-gradient(90deg, #6c757d, #6c757d);
    transform: scale(1.05);
}

.action-icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.action-icon:hover {
    opacity: 0.8;
}

@media print {
    .card-container {
        margin-left: -100%;
        display: flex;
    }
}

/* From Uiverse.io by FWDJc */ 
.loader {
  width: 150px; /* You can adjust this size */
  height: 40px; /* You can adjust this size */
  border-radius: 50%;
  position: absolute; /* Change to fixed to cover the viewport */
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Adjust position to center */
  animation: bounce 5s infinite;
  z-index: 9999; /* Ensure it appears above other content */
  display: flex; /* Use flexbox to center content */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

@media (max-width: 768px) {
  .loader{
    left: 0%;
  }
}

.loader::before {
  content: 'MGBX';
  position: absolute;
  display: block;
  left: 5%;
  bottom: 55%;
  color: green;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 4em;
  font-weight: 900;
  font-style: italic;
  animation: div-color-change 5s infinite;
}

.loader::after {
  content: 'PORTAL';
  position: absolute;
  top: 30%;
  left: 21%;
  color: #212121;
  font-size: .5em;
  font-weight: 800;
  letter-spacing: 10px;
  z-index: 1;
}

@keyframes bounce {
  0% {
    background-color: red;
    transform: translateX(0) translateY(60px);
  }

  25% {
    background-color: blue;
    transform: translateX(60px) translateY(0);
  }

  55% {
    background-color: green;
    transform: translateX(0) translateY(-60px);
  }

  75% {
    background-color: yellow;
    transform: translateX(-60px) translateY(0);
  }

  100% {
    background-color: purple;
    transform: translateX(0) translateY(60px);
  }
}

@keyframes div-color-change {
  0% {
    color: red;
  }

  25% {
    color: blue;
  }

  55% {
    color: green;
  }

  75% {
    color: yellow;
  }

  100% {
    color: purple;
  }
}
</style>