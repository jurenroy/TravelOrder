<template>
    <div class="luxury-container">
        <h2 class="luxury-title">
          History for:
          <select v-model="selectedStatus" id="status" class="luxury-select">
            <option v-for="option in options" :key="option" :value="option">
              {{ option }}
            </option>
          </select> 
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
                <th style="text-align: center; " @click="sortData('rso_number')">RSO Number
                  <span :style="{ color: sortOrder === 'asc' ? 'green' : sortOrder === 'desc' ? 'red' : 'black', fontWeight: 'bold' }" v-if="sortKey == 'rso_number'">
                {{ sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '' }}
                </span>
                </th>
                <th style="text-align: center;" @click="sortData('rso_date')">RSO Date
                  <span :style="{ color: sortOrder === 'asc' ? 'green' : sortOrder === 'desc' ? 'red' : 'black', fontWeight: 'bold' }" v-if="sortKey == 'rso_date'">
                {{ sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '' }}
                </span>
                </th>
                <th style="text-align: center;">RSO Subject</th>
                <th style="text-align: center;" @click="sortData('scheduled_dates')">Scheduled Dates
                  <span :style="{ color: sortOrder === 'asc' ? 'green' : sortOrder === 'desc' ? 'red' : 'black', fontWeight: 'bold' }" v-if="sortKey == 'scheduled_dates'">
                {{ sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '' }}
                </span>
                </th>
                <th style="text-align: center;">Assigned Personnel</th>
                <th style="text-align: center;">Scan Copy Link</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in sortedFormData" :key="item.id">
                <td>{{ item.rso_number }}</td>
                <td>{{ item.rso_date }}</td>
                <td>{{ item.rso_subject }}</td>
                <td>{{ item.scheduled_dates}}</td>
                <td>{{ item.assigned_personnel}}</td>
                <td class="status-actions"><button @click="openFile(item.scan_copy_url)">open file</button></td>                
              </tr>
            </tbody>
          </table>
          <h1 style="text-align: center; margin-bottom: 0px;" v-if="sortedFormData.length == 0">NO MATCH FOUND</h1>
        </div>
      </div>
  </div>
  <div v-show="selectedTravelOrderId" class="prent full-screen">
    <div class="buttons">
      <button @click="printzz">Download as PDF</button>
      <button @click="close">Close PDF</button>
    </div>
      <pdf :travel_order_id="selectedTravelOrderId"></pdf>
      <editform v-if="selectedTravelOrderIdEdit > 0"></editform>
      <sample>yawa</sample>
    </div>
</template>

<script>
import axios from 'axios';
import pdf from './../pdf.vue';
import editform from './../editform.vue';
import form from './../form.vue';
import sample from './../sampol.vue'
import otpz from '../../components/otp.vue';
import { API_BASE_URL } from '../../config'
import { API_BASE_URL2 } from '../../config'
import { API_BASE_URL3 } from '../../config'
import { useAuthStore } from '../../store/auth';
import { rso } from '@/components/rso';
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
    sample,
    rso
  },
  mounted() {
    this.fetchAccounts();
    this.fetchEmployees();
    this.fetchNames();
  },
  data() {
    return {
      selectedStatus: 'Me',
      options: ['All', 'Me'],
      sectionChiefIds: [39, 2, 3, 8, 42, 34, 29, 36, 11, 5, 47],
      members: [
        [23, 25, 35, 70, 64],
        [30, 7, 26, 18, 67, 49, 24],
        [43, 40],
        [32, 50, 71],
        [33, 6],
        [41, 46, 28],
        [38, 9, 65, 1],
        [44, 22, 61, 27],
        [31],
        [16, 63, 19],
        [12, 14, 72, 73]
      ],
      yearToday: new Date().getFullYear(),
      formData: [],
      names: {},
      employees: {},
      accountId: localStorage.getItem('accountId'),
      nameId: localStorage.getItem('nameId'),
      acc: [],
      load: true,
      mawala: false,
      searchQuery: '',
      sortKey: 'rso_number', // Default sort key
      sortOrder: 'desc', // Default sort order
      isVisible: true,
      rsoData: rso
    };
  },
  methods: {
    get_full_name(name_id) {
      const rsos = this.rsoData.find(item => parseInt(item.name_id) === parseInt(name_id));
      return rsos ? rsos.full_name : null; // Return full_name or null if not found
    },
    openFile(scanCopyUrl) {
      const fullUrl = `${API_BASE_URL2}${scanCopyUrl}`;
      window.open(fullUrl, '_blank');
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
      axios.get(`${API_BASE_URL3}`)
    .then(response => {
        console.log('Data:', response.data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
      axios.get(`${API_BASE_URL2}/rso/api_json`)
        .then(response => {
          this.mawala = true;
          this.load = false
          console.log('Data:', response.data.rsos);
          this.formData=response.data.rsos
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

    updateVisibleItems() {
      this.visibleItems = this.formData.slice(0, 20);
    },
    sortData(key) {
        this.sortKey = key;
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle order
    },
  },

  computed: {
    filteredData() {
    const nameId = localStorage.getItem('nameId'); // Get the current user's nameId
    const currentUserName = this.get_full_name(nameId); // Get the full name of the current user
    // return this.formData
    return this.formData.filter(item => {
        const assignedPersonnelArray = item.assigned_personnel.split(', ').map(name => name.trim());

        // Check if any assigned personnel matches the current user's name
        const personnelNames = assignedPersonnelArray.includes(currentUserName);

        if (this.selectedStatus === 'Me') {
            return personnelNames; // Filter for 'Me' (the current user)
        } else if (this.selectedStatus === 'All' && nameId == 76) {
            return true; // Filter for 'All' (include empty lists)
        }else if (this.selectedStatus === 'All') {
            return personnelNames || item.assigned_personnel == ""; // Filter for 'All' (include empty lists)
        }
    });
    },
    reversedFormData() {
    let data = this.filteredData; // Make a copy of the original data
      
      // Filter data based on searchQuery
      if (this.searchQuery !== '') {
            data = data.filter(item => {
                return (
                    item.rso_number.toString().includes(this.searchQuery) ||
                    item.assigned_personnel.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.remarks.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.rso_subject.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
      }
      
      // Sort the data by rso_date in descending order
      data.sort((a, b) => new Date(b.rso_date) - new Date(a.rso_date));
    
      return data;
    },
    sortedFormData() {
    let data = this.reversedFormData.slice();
    
    if (this.sortKey === 'rso_number') {
      data.sort((a, b) => {
            let aValue = this.sortKey === 'rso_number' ? new Date(a.rso_date) : a[this.sortKey];
            let bValue = this.sortKey === 'rso_number' ? new Date(b.rso_date) : b[this.sortKey];

            return this.sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        });
    } else {
        data.sort((a, b) => {
            let aValue = this.sortKey === 'rso_date' ? new Date(a.rso_date) : a[this.sortKey];
            let bValue = this.sortKey === 'rso_date' ? new Date(b.rso_date) : b[this.sortKey];

            return this.sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        });
    }

    return data;
},
  },
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
    background-color: #fbbd08;
    color: white;
    border-radius: 50%;
    padding: 6px 12px;
    font-weight: bold;
    font-size: 14px;
    position: absolute;
    top: -10px;
    right: -10px;
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
.notification-count {
  margin-top: -10px;
  margin-left: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 20px; /* Adjust size */
  height: 20px; /* Adjust size */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px; /* Adjust font size */
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
    max-height: 690px;
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
  width: 300px;
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
  .Btn{
    margin-right: 20px;
  }
 /* Adjust the media query to target a specific screen size */
 .prent {
    /* Apply styles to takeover the screen */
    position: fixed;
    top: 0;
    left: 0;
    width: fit-content;
    height: 100%; /* Set height to 50% of the viewport height */
    max-height: 1000px; /* Set maximum height for smaller screens */
    z-index: 9999; /* Ensure it's above other content */
    height: 100vh;
    background-color: white;
  }
  .prent .buttons{
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
  .dropdown {
    display: none !important;
  }
  .buttons{
    display: none !important;
  }
}
</style>