<template>
  <div>
    <!-- Button to open Create Modal -->
    <button @click="$refs.rsoModal.openCreateModal()">Create New RSO</button>

    <!-- Modal for Create/Edit -->
    <rso-modal ref="rsoModal" @saved="fetchData"></rso-modal>

    <!-- Table displaying RSOs -->
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
              <th style="text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sortedFormData" :key="item.id">
              <td>{{ item.rso_number }}</td>
              <td>{{ item.rso_date }}</td>
              <td>{{ item.rso_subject }}</td>
              <td>{{ item.scheduled_dates }}</td>
              <td>{{ item.assigned_personnel }}</td>
              <td>
                <!-- Edit button to open modal -->
                <button @click="$refs.rsoModal.openEditModal(item)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
        <h1 style="text-align: center;" v-if="sortedFormData.length === 0">No RSO Found</h1>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import RsoModal from './RsoModal.vue'; // Import the modal component

export default {
  components: {
    RsoModal, // Register the modal component
  },
  data() {
    return {
      formData: [],
      searchQuery: '',
      sortKey: 'rso_number',
      sortOrder: 'desc',
      selectedStatus: 'Me',
      options: ['All', 'Me'],
      load: true,
      mawala: false,
      editFormData: {},
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(`${API_BASE_URL}/rso`);
        this.mawala = true;
        this.load = false;
        this.formData = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    sortData(key) {
      this.sortKey = key;
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle order
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
</style>
