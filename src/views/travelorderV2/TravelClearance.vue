<template>
  <TravelClearanceModal
    :isVisible="isModalVisible"
    :travelOrderId="selectedTravelOrderIdEdit"
    @close="closeModal"
    @clearanceCreated="handleClearanceCreated"
  />

  <div class="luxury-container" style="margin-top: 100px;">

<div v-if="load" class="loader"></div>

<div class="luxury-search-container">
  <div class="luxury-title">
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
      <input class="luxury-search-input" type="text" v-model="searchQuery" placeholder="Search Clearance number or Name" />
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
        <th>Clearance No.</th>
        <th>Name</th>
        <th>Destination</th>
        <th>Purpose</th>
        <th>Departure Date</th>
        <th>Arrival Date</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in reversedFormData" :key="item.id">
        <td>{{ item.clearance_number }}</td>
        <td>{{ getName(item.name_id) }}</td>
        <td>{{ item.destination }}</td>
        <td>{{ item.purpose }}</td>
        <td>{{ item.departure }}</td>
        <td>{{ item.arrival }}</td>
        <td class="status-actions" v-if="item.name_id == nameId || nameId == 76">
          <button v-if="selectedTravelOrderIdEdit != item.clearance_number" @click="edit(item.clearance_number)">Edit</button>
          <img src="/src/assets/canceledit.png" v-if="selectedTravelOrderIdEdit == item.clearance_number" @click="closeEdit" class="action-icon"/>
        </td>
        <td class="status-actions">
          <button v-if="selectedTravelOrderId != item.id" @click="openPDF(item.id)">PDF</button>
          <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.id" @click="close" class="action-icon"/>
        </td>
      </tr>
    </tbody>
  </table>
  <h1 v-if="reversedFormData.length == 0" class="no-match">NO MATCH FOUND</h1>
</div>
</div>

  </div>
  <div v-show="selectedTravelOrderId" class="prent full-screen">
    <travel-clearance-pdf :clearance_id="selectedTravelOrderId"></travel-clearance-pdf>
  </div>

</template>

<script>
import axios from 'axios';
import travelClearancePdf from './TravelClearancePDF.vue';
import editform from './EditForm.vue';
import otpz from '../../components/otp/OTP.vue';
import NoteModal from '@/components/note/Note.vue';
import TravelClearanceModal from './TravelClearanceModal.vue';
import ItemIndicators from '@/components/validators/TravelOrderTable.js';
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
  travelClearancePdf,
  otpz,
  editform,
  NoteModal,
  TravelClearanceModal,
  ItemIndicators
},
mounted() {
  this.fetchEmployees();
  this.fetchNames();
  this.fetchData(true);
  this.setupWebSocket()
  window.addEventListener('afterprint', this.handleAfterPrint);
},
beforeDestroy() {
  clearInterval(this.fetchInterval);
  window.removeEventListener('afterprint', this.handleAfterPrint);
},
data() {
  const authStore = useAuthStore();
  return {
    pendingStore: usePendingStore(),
    numberOfRows: 10,
    rowOptions: [10, 20, 50, 100, 200, 500, 1000, 5000, 10000],
    selectedStatus: 'Pending',
    optionsEmp: ['Pending', 'Done', 'All'],
    options: ['Pending', 'Done', 'Me'],
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
    fetchInterval: null,
    isNoteModalVisible: false,
    isAdding: false,
    currentNoteId: 0,
    currentNoteText: '',
    currentNoteType: 'travel_clearance',
    socket: '',
    isModalVisible: false,
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
        if (data.type === 'notification') {
          // Handle notification, e.g., show a toast or update UI
          console.log('Notification received:', data.title, data.message);
          // You can add code here to display the notification to the user
          alert(`${data.title}: ${data.message}`);
        } else {
          console.log(data);
        }
      };
      this.socket.onclose = (event) => {
        console.log('WebSocket closed:', event);
      };
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    },
  handleAfterPrint() {
    this.close()
  },
  openModal(travelOrderId) {
    this.selectedTravelOrderId = travelOrderId;
    this.isModalVisible = true;
  },
  closeModal() {
    this.isModalVisible = false;
    this.selectedTravelOrderId = 0;
  },
  handleClearanceCreated() {
    this.fetchData(true);
    this.closeModal();
  },
  canApprove(item) {
    // Add logic to determine if current user can approve this clearance
    return [15, 20, 21, 45, 48, 3].includes(this.nameId); // Example: RD and certain chiefs can approve
  },
  async approveClearance(id) {
    this.openOTP()
    while (this.otp) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (this.otpStatus) {
      try {
        await axios.put(`${API_BASE_URL}/travel_clearances/${id}/approve`, {
          signature: this.signature,
          approved_by: this.nameId
        });
        this.fetchData(true);
      } catch (error) {
        console.error('Error approving clearance:', error);
        alert('Error approving clearance. Please try again.');
      }
    }
  },
  edit(id) {
    this.selectedTravelOrderIdEdit = id;
    this.isModalVisible = true;
    this.$emit('travelOrderId', id);
  },
  closeEdit(){
    this.selectedTravelOrderIdEdit = 0
    this.isModalVisible = false;
  },
  printzz(){
    window.print();
  },
  openOTP(){
    this.otp = true
  },
  handleOtpStatus(status){
    if (status) {
      this.otp = false
      this.otpStatus = status
    } else {
      this.otp = false
      this.otpStatus = status
    }
  },
  downloadCSV() {
    const summary = ['Summary Report of Travel Clearance '];
    const headers = [
      'Clearance No.',
      'Name',
      'Date',
      'Departure Date',
      'Destination',
      'Purpose',
      'Arrival Date',
    ];

    const approvedClearances = this.csvformdata.filter(item => item.clearance_number);

    approvedClearances.sort((a, b) => a.clearance_number.localeCompare(b.clearance_number));

    const groupedByMonth = {};
    approvedClearances.forEach(item => {
      const yearMonthKey = new Date(item.date).toISOString().slice(0, 7);
      const yearKey = new Date(item.date).getFullYear().toString();
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
            item.clearance_number,
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
    this.currentNoteId = noteId;
    this.currentNoteType = 'travel_clearance';
    this.currentNoteText = this.getName(this.nameId) + ": ";
    this.isAdding = true;
    this.isNoteModalVisible = true;
  },
  openViewNoteModal(noteText, noteId) {
    this.currentNoteId = noteId;
    this.currentNoteType = 'travel_clearance';
    this.currentNoteText = noteText;
    if ([15, 20, 21, 45, 48, 3, 37,76, 23, 64].includes(this.nameId)) {
      this.currentNoteText += "\n" + this.getName(this.nameId) + ": ";
    }
    this.isAdding = false;
    this.isNoteModalVisible = true;
  },
  closeNoteModal() {
    this.isNoteModalVisible = false;
    this.currentNoteId = 0
  },
  handleNotePosted(noteText) {
    this.fetchData(true);
  },
  handleScroll() {
  const container = this.$refs.scrollContainer;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
    this.fetchData();
  }
},
  fetchData(reset = false) {
    if (reset) {
    this.formData = [];
  }
    this.load = true
    axios.get(`${API_BASE_URL}/travel_clearances?status=${this.selectedStatus}&limit=${this.numberOfRows}&offset=${this.formData.length}`)
      .then(response => {
        this.mawala = true;
        this.load = false
        this.csvformdata = response.data
        const existingIds = new Set(this.formData.map(item => item.id));
        const uniqueNewData = response.data.filter(item => !existingIds.has(item.id));
        this.formData = [...this.formData, ...uniqueNewData]
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
        console.error('Error fetching employeess:', error);
      });
  },
  getName(nameIds) {
  if (!nameIds) return 'Unknown';

  const ids = String(nameIds)
    .split(',')
    .map(id => parseInt(id.trim(), 10))
    .filter(Boolean);

  const namesArray = ids.map(id => {
    const name = this.names[id - 1]; // ✅ correct for IDs starting at 1
    if (!name) return null;

    const { first_name, middle_init, last_name } = name;
    return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
  }).filter(Boolean);

  if (namesArray.length === 0) return 'Unknown';
  if (namesArray.length === 1) return namesArray[0];
  if (namesArray.length === 2) return namesArray.join(' and ');

  const lastName = namesArray.pop();
  return `${namesArray.join(', ')}, and ${lastName}`;
},
  openPDF(id) {
    this.selectedTravelOrderId = id;
    console.log(this.selectedTravelOrderId)
    setTimeout(() => {
      this.printzz();
    }, 1000);
  },
  close() {
    this.selectedTravelOrderId = 0
  },
  viewAuditLogs(id) {
    axios.get(`${API_BASE_URL}/audit_logs/travel_clearances/${id}`)
      .then(response => {
        const logs = response.data;
        if (logs.length === 0) {
          alert('No audit logs found for this travel clearance.');
        } else {
          let logMessage = 'Audit Logs:\n\n';
          logs.forEach(log => {
            logMessage += `Action: ${log.action}\n`;
            logMessage += `Timestamp: ${new Date(log.created_at).toLocaleString()}\n`;
            if (log.old_values) {
              logMessage += `Old Values: ${JSON.stringify(log.old_values, null, 2)}\n`;
            }
            if (log.new_values) {
              logMessage += `New Values: ${JSON.stringify(log.new_values, null, 2)}\n`;
            }
            logMessage += '---\n';
          });
          alert(logMessage);
        }
      })
      .catch(error => {
        console.error('Error fetching audit logs:', error);
        alert('Error fetching audit logs. Please try again.');
      });
  },
},

computed: {
  pendingCount() {
    return this.pendingStore.travelclearance || 0;
  },
  filteredData() {
    return this.formData;
  },
  reversedFormData() {
    let data = this.formData.slice();
    if (this.searchQuery !== '') {
      data = data.filter(item => {
        return item.clearance_number.includes(this.searchQuery) || String(this.getName(item.name_id)).toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
    return data;
  },
},
watch: {
  selectedStatus() {
  this.fetchData(true);
},
  numberOfRows: 'fetchData'
}
}

</script>

<style scoped>
/* Include all the styles from Table.vue, adapted for Travel Clearance */


.luxury-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  color: #212121;
  letter-spacing: 1px;
  flex-direction: row;
  margin-top: -30px;
}
.luxury-title .mawala{
  text-indent: 10px;
}

.radio-inputs {
position: relative;
display: flex;
flex-wrap: wrap;
border-radius: 0.5rem;
background: linear-gradient(to top, #a1834a, #b8860b);
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
position: relative;
}

.radio-inputs .radio .pending-count {
position: absolute;
top: 0;
right: 0;
background-color: #ff0000;
border-radius: 50%;
padding: 0.2rem 0.4rem;
font-size: 12px;
color: #fff;
}

.radio-inputs .radio input:checked + .name {
background-color: #e4c370;
font-weight: 600;
color: black;
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

.luxury-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 50px;
}

.luxury-loading img {
  width: 120px;
  height: auto;
}

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

.luxury-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(150deg, #f0c36d, #b8860b);
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

.outer {
  width: 100%;
  max-width: 100%;
  margin-top: 10px;
  border-radius: 15px;
  overflow-x: auto;
}

.scrollable-table {
  width: 100%;
  overflow-x: auto;
  max-height: 60vh;
  height: 60vh;
  overflow-y: auto;
}

table {
  width: 100%;
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
  background: linear-gradient(180deg, #f0c36d, #b8860b);
  color: rgb(0, 0, 0);
  position: sticky;
  top: 0;
  z-index: 10;
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

.status-pending {
  color: red;
}

.status-approved {
  color: green;
}

.status-draft {
  color: orange;
}

.status-icon {
  height: 16px;
  width: 16px;
  vertical-align: middle;
  margin-right: 5px;
}

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

h1.no-match {
  text-align: center;
  color: #999;
  font-size: 18px;
  margin-top: 20px;
}

td, th {
  vertical-align: middle;
}

.prent {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.full-screen {
  width: 100%;
  height: 100%;
}

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
