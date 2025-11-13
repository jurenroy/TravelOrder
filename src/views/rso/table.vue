<template>
  <div>
    <!-- Search and Filter Section -->
    <div class="filter-section">
      <input v-model="searchQuery" @input="applyFilters" type="text" placeholder="Search by RSO Number, Name, or Subject" class="search-input">
      <input v-model="scheduledDate" @input="applyFilters" type="date" placeholder="Scheduled Date" class="filter-input">
      <button @click="clearFilters" class="clear-btn">Clear Filters</button>
      <button v-if="isAdmin" @click="$refs.rsoModal.openCreateModal()" class="create-btn">Create New RSO</button>
    </div>

    <!-- Modal for Create/Edit -->
    <rso-modal ref="rsoModal" @saved="fetchData"></rso-modal>

    <!-- Table displaying RSOs -->
    <div v-if="mawala" class="outer">
      <div class="scrollable-table">
        <table>
          <thead style="z-index: 0;">
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
              <th style="text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sortedFormData" :key="item.id">
              <td>{{ item.rso_number }}</td>
              <td>{{ item.rso_date }}</td>
              <td>{{ item.rso_subject }}</td>
              <td>{{ item.rso_scheduled_dates_from }} to {{ item.rso_scheduled_dates_to }}</td>
              <td>{{ getName(item.rso_name) }}</td>
              <td>
                <!-- Edit button to open modal -->
                <button class="edit-btn" @click="$refs.rsoModal.openEditModal(item)">Edit</button>
                <div v-if="item.rso_scan_copy">
                  <button class="view-btn" @click="openImageModal(item.rso_scan_copy)">View File</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <h1 style="text-align: center;" v-if="sortedFormData.length === 0">No RSO Found</h1>
      </div>
    </div>
  </div>

  <!-- Image Modal -->
  <div v-if="isImageModalOpen" class="image-modal" @click="closeImageModal">
    <div class="image-modal-content" @click.stop>
      <img :src="imgurl" alt="Scan Copy" class="modal-image" />
      <div class="image-modal-buttons">
        <button @click="downloadImage(currentImageUrl)" class="download-btn">Download</button>
        <button @click="closeImageModal" class="close-botn">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import RsoModal from './RsoModal.vue'; // Import the modal component
import { useAuthStore } from '../../store/auth.js';

export default {
  components: {
    RsoModal, // Register the modal component
  },
  data() {
    return {
      formData: [],
      searchQuery: '',
      scheduledDate: '',
      sortKey: 'rso_number',
      sortOrder: 'desc',
      selectedStatus: 'Me',
      options: ['All', 'Me'],
      load: true,
      mawala: false,
      editFormData: {},
      isImageModalOpen: false,
      currentImageUrl: '',
      imgurl: '',
      names: {},
      userId: null,
      isAdmin: false,
    };
  },
  mounted() {
    const authStore = useAuthStore();
    this.userId = authStore.name_id;
    this.isAdmin = [76, 24].includes(this.userId);
    this.fetchData();
    this.fetchNames();
  },
  methods: {

    async fetchData() {
      try {
        const params = {};
        if (this.searchQuery) params.search = this.searchQuery;
        if (this.scheduledDate) params.scheduled_date = this.scheduledDate;
        if (this.userId) params.name = this.userId;

        const response = await axios.get(`${API_BASE_URL}/rso`, { params });
        this.mawala = true;
        this.load = false;
        this.formData = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    applyFilters() {
      this.fetchData();
    },
    clearFilters() {
      this.searchQuery = '';
      this.scheduledDate = '';
      this.fetchData();
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
    getName(nameIds) {
      if (!nameIds) return 'Unknown';

      if (nameIds === 'all') return 'All Personnels';

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
    sortData(key) {
      this.sortKey = key;
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle order
    },
    openImageModal(scanCopyUrl) {
      this.currentImageUrl = scanCopyUrl;
      this.imgurl=`${API_BASE_URL}/storage/RSO/${scanCopyUrl}`
      this.isImageModalOpen = true;
    },
    closeImageModal() {
      this.isImageModalOpen = false;
      this.currentImageUrl = '';
      this.imgurl = ''
    },
    async downloadImage(scanCopyUrl) {
      try {
        const response = await fetch(`${API_BASE_URL}/storage/RSO/${scanCopyUrl}`);
        const blob = await response.blob();
      
        // Create a temporary URL and trigger download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = scanCopyUrl;
        document.body.appendChild(link);
        link.click();
      
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    },
  },
  computed: {
    sortedFormData() {
      let data = this.formData.slice(); // Clone array to avoid direct mutation
      // Sort data based on selected key and order
      data.sort((a, b) => {
        let aValue = a[this.sortKey];
        let bValue = b[this.sortKey];
        return this.sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
      });
      return data;
    },
  },
};
</script>

<style>
/* Add your previous CSS here or keep it consistent */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: white;
  padding: 20px;
  width: 500px;
  border-radius: 8px;
}

/* Image Modal Styles */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.image-modal-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  height: 30px;
  width: auto;
  font-size: 15px;
}

.download-btn, .close-botn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
}

.download-btn {
  background-color: #007bff;
  color: white;
}

.close-btn {
  background-color: #6c757d;
  color: white;
}

.download-btn:hover {
  background-color: #0056b3;
}

.close-btn:hover {
  background-color: #545b62;
}

.edit-btn, .view-btn {
  background-color: black;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  min-width: 80px;
  text-align: center;
  height: 40px;
  margin-bottom: 10px;
}

.edit-btn:hover, .view-btn:hover {
  background-color: #333;
}

.filter-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.search-input, .filter-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.clear-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.clear-btn:hover {
  background-color: #c82333;
}

.create-btn {
  background-color: black;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.create-btn:hover {
  background-color: #333;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input, .filter-input, .clear-btn, .create-btn {
    width: 100%;
    margin-bottom: 10px;
  }

  .outer {
    overflow-x: auto;
  }

  .scrollable-table table {
    min-width: 600px;
  }
}
</style>
