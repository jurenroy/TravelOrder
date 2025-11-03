<template>
    <div>
  
      <!-- Modal -->
      <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
          <h2>{{ isEditMode ? 'Edit RSO' : 'Create RSO' }}</h2>
  
          <form @submit.prevent="saveRSO">
            <label>RSO Number:</label>
            <input type="text" v-model="rsoData.rso_number" :readonly="isEditMode" required />
  
            <label>RSO Date:</label>
            <input type="date" v-model="rsoData.rso_date" required />
  
            <label>RSO Subject:</label>
            <textarea v-model="rsoData.rso_subject" required></textarea>
  
            <label>Scheduled Dates From:</label>
            <input type="date" v-model="rsoData.scheduled_from" />
  
            <label>Scheduled Dates To:</label>
            <input type="date" v-model="rsoData.scheduled_to" />
  
            <label>Assigned Personnel (comma separated):</label>
            <input type="text" v-model="rsoData.rso_name" />
  
            <label>Scan Copy:</label>
            <input type="file" @change="handleFileUpload" />
  
            <div class="modal-buttons">
              <button type="submit">{{ isEditMode ? 'Update' : 'Create' }}</button>
              <button type="button" @click="closeModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { API_BASE_URL } from '../../config';
  
  export default {
    props: {
      existingRSO: Object // Optional: pass an RSO to edit
    },
    data() {
      return {
        isModalOpen: false,
        isEditMode: false,
        rsoData: {
          rso_number: '',
          rso_date: '',
          rso_subject: '',
          scheduled_from: '',
          scheduled_to: '',
          rso_name: '',
          scan_copy_url: ''
        },
        selectedFile: null
      };
    },
    methods: {
      openCreateModal() {
        this.isModalOpen = true;
        this.isEditMode = false;
        this.rsoData = {
          rso_number: '',
          rso_date: '',
          rso_subject: '',
          rso_scheduled_dates_from: '',
          rso_scheduled_dates_to: '',
          rso_name: '',
          scan_copy_url: ''
        };
      },
      openEditModal(rso) {
        this.isModalOpen = true;
        this.isEditMode = true;
        this.rsoData = { ...rso };
      },
      handleFileUpload(event) {
        this.selectedFile = event.target.files[0];
      },
      async saveRSO() {
        try {
          let response;
  
          if (this.isEditMode) {
            // Update RSO
            response = await axios.post(`${API_BASE_URL}/rso/update/${this.rsoData.rso_number}`, this.rsoData);
          } else {
            // Create RSO
            response = await axios.post(`${API_BASE_URL}/rso`, this.rsoData);
          }
  
          // Upload file if selected
          if (this.selectedFile) {
            const formData = new FormData();
            formData.append('rso_scan_copy', this.selectedFile);
            const fileUploadRes = await axios.post(
              `${API_BASE_URL}/rso/upload/${response.data.rso_number}`,
              formData,
              { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            this.rsoData.scan_copy_url = fileUploadRes.data.scan_copy_url;
          }
  
          this.$emit('saved', this.rsoData); // Notify parent
          this.closeModal();
        } catch (error) {
          console.error('Error saving RSO:', error);
          alert('Failed to save RSO. Check console.');
        }
      },
      closeModal() {
        this.isModalOpen = false;
        this.selectedFile = null;
      }
    }
  };
  </script>
  
  <style>
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
  .modal-buttons {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  </style>
  