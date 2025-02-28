<template>
    <div class="luxury-container">
        <h2 class="luxury-title">
          <select v-model="selectedStatus" id="status" class="luxury-select">
            <option v-for="option in options" :key="option" :value="option">
              {{ option }}
            </option>
          </select> 
        </h2>
    
        
    
        <div class="luxury-search-container">
          <div class="luxury-search-bar">
            <div v-if="mawala" class="luxury-search-box">
              <img class="luxury-search-icon" src="../../assets/search.png" alt="Search" />
              <input class="luxury-search-input" type="text" v-model="searchQuery" placeholder="Search TO number or Name" />
            </div>
          </div>
        </div>
    
      <div v-if="load" class="loader"></div> <!-- Loader here -->
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

</style>