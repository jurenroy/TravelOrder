<template>
    <div class="outer">
      <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
          <h2>{{ isEditMode ? 'Edit RSO' : 'Create RSO' }}</h2>

          <form @submit.prevent="saveRSO">
            <div class="form-row">
              <div class="form-group">
                <label>RSO Number:</label>
                <input type="text" v-model="rsoData.rso_number" :readonly="isEditMode" required />
              </div>

              <div class="form-group">
                <label>RSO Date:</label>
                <input type="date" v-model="rsoData.rso_date" required />
              </div>
            </div>

            <div class="form-group">
              <label>RSO Subject:</label>
              <textarea v-model="rsoData.rso_subject" required rows="4"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Scheduled Dates From:</label>
                <input type="date" v-model="rsoData.rso_scheduled_dates_from" />
              </div>

              <div class="form-group">
                <label>Scheduled Dates To:</label>
                <input type="date" v-model="rsoData.rso_scheduled_dates_to" />
              </div>
            </div>

            <div class="form-group">
              <label>Assigned Personnel:</label>
              <div class="multi-select">
                <div v-if="selectedPersonnel.length > 0" class="selected-items">
                  <span v-for="(person, index) in selectedPersonnel" :key="person.name_id" class="selected-item">
                    {{ person.first_name.toUpperCase() }} {{ person.middle_init.toUpperCase() }} {{ person.last_name.toUpperCase() }}
                    <button type="button" @click="removePersonnel(index)">×</button>
                  </span>
                </div>
                <input
                  type="text"
                  v-model="personnelSearch"
                  @input="filterPersonnel"
                  placeholder="Type to search personnel..."
                  class="personnel-input"
                />
                <div v-if="showDropdown" class="dropdown">
                  <div
                    v-for="person in filteredPersonnel"
                    :key="person.name_id"
                    @click="selectPersonnel(person)"
                    class="dropdown-item"
                  >
                    {{ person.first_name.toUpperCase() }} {{ person.middle_init.toUpperCase() }} {{ person.last_name.toUpperCase() }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Scan Copy:</label>
              <input type="file" @change="handleFileUpload" :disabled="isProcessingFile" />
              <div v-if="isProcessingFile" class="processing-indicator">
                {{ processingMessage }}
              </div>
              <div v-if="rsoData.scan_copy_url" class="scan-copy-display">
                <img :src="`${API_BASE_URL}/storage/rso/${rsoData.scan_copy_url}`" alt="Scan Copy" @click="openImageModal" style="cursor: pointer; max-width: 200px; border: 1px solid #ccc; border-radius: 8px;" />
              </div>
            </div>

            <!-- <div class="form-group">
              <label>Extracted OCR Text:</label>
              <textarea v-model="extractedText" readonly placeholder="Upload a file to see extracted text here..." rows="6"></textarea>
            </div> -->

            <div class="modal-buttons">
              <button type="submit">{{ isEditMode ? 'Update' : 'Create' }}</button>
              <button type="button" @click="closeModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  <!-- Image Modal -->
  <div v-if="isImageModalOpen" class="image-modal" @click="closeImageModal">
    <div class="image-modal-content" @click.stop>
      <img :src="`${API_BASE_URL}/storage/rso/${rsoData.scan_copy_url}`" alt="Scan Copy" class="modal-image" />
      <div class="image-modal-buttons">
        <button @click="downloadImage" class="download-btn">Download</button>
        <button @click="closeImageModal" class="close-btn">Close</button>
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
    mounted() {
      this.loadPersonnel();
    },
    data() {
      return {
        isModalOpen: false,
        isEditMode: false,
        rsoData: {
          rso_number: '',
          rso_date: '',
          rso_subject: '',
          rso_scheduled_dates_from: '',
          rso_scheduled_dates_to: '',
          rso_name: '',
          scan_copy_url: ''
        },
        selectedFile: null,
        isProcessingFile: false,
        processingMessage: '',
        extractedText: '',
        // Personnel selection data
        allPersonnel: [],
        selectedPersonnel: [],
        personnelSearch: '',
        filteredPersonnel: [],
        showDropdown: false,
        isImageModalOpen: false
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
      async handleFileUpload(event) {
        this.selectedFile = event.target.files[0];
        if (this.selectedFile) {
          this.isProcessingFile = true;
          this.processingMessage = 'READING FILE...';

          try {
            // Check if file is an image or PDF
            const fileType = this.selectedFile.type;
            let text = '';

            if (fileType.startsWith('image/')) {
              // Use Tesseract.js for image OCR processing
              const { createWorker } = await import('tesseract.js');

              const worker = await createWorker('eng');
              const { data: { text: ocrText } } = await worker.recognize(this.selectedFile);
              await worker.terminate();

              text = ocrText;
            } else if (fileType === 'application/pdf') {
              // Process PDF files using PDF.js
              const pdfjsLib = await import('pdfjs-dist');

              // Set worker source
              pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

              const arrayBuffer = await this.selectedFile.arrayBuffer();
              const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

              let fullText = '';

              // Process each page
              for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
              }

              text = fullText;
            } else {
              text = 'Unsupported file type. Please upload an image file (JPG, PNG) or PDF for OCR.';
            }

            this.processingMessage = 'DONE READING AND FILLING FIELDS...';

            // Small delay to show the message
            setTimeout(() => {
              // Log the full extracted text for analysis
              console.log('Extracted OCR Text:', text);

              // Display the extracted text in the textarea
              this.extractedText = text;
              // Create subjectMatchText by replacing newlines with spaces
              const subjectMatchText = text.trim().replace(/\n/g, ' ');
              console.log(subjectMatchText)
              // Extract RSO subject: from "SUBJECT:" until the first period
              const subjectMatch = subjectMatchText.match(
  /SUBJECT\s*:?\s*([A-Z0-9.,()\/\-–—\s]+?)(?=\s+(?:In\s+the|This|Whereas|For\s+the|That|On\s+|[A-Z][a-z]))/
);
              console.log(subjectMatch)
              if (subjectMatch && subjectMatch[1]) {
                this.rsoData.rso_subject = subjectMatch[1];
              }

              // For now, just populate with null values for other fields - will implement more extraction later
              this.rsoData.rso_number = null;
              this.rsoData.rso_date = null;
              this.rsoData.rso_scheduled_dates_from = null;
              this.rsoData.rso_scheduled_dates_to = null;

              this.isProcessingFile = false;
              this.processingMessage = '';
            }, 1000); // 1 second delay

          } catch (error) {
            console.error('OCR failed:', error);
            this.isProcessingFile = false;
            this.processingMessage = '';
            this.extractedText = 'Error: ' + error.message;
            alert('Failed to extract data from file. Please enter manually.');
          }
        }
      },
      async saveRSO() {
        try {
          const formData = new FormData();

          // Append all RSO data fields
          for (let key in this.rsoData) {
            if (this.rsoData[key] !== null && this.rsoData[key] !== undefined) {
              formData.append(key, this.rsoData[key]);
            }
          }

          // Append file if selected
          if (this.selectedFile) {
            formData.append('rso_scan_copy', this.selectedFile);
          }

          let response;

          if (this.isEditMode) {
            // Update RSO
            response = await axios.post(`${API_BASE_URL}/rso/update/${this.rsoData.rso_number}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          } else {
            // Create RSO
            response = await axios.post(`${API_BASE_URL}/rso`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          }

          // Update scan_copy_url if file was uploaded
          if (this.selectedFile && response.data.rso_scan_copy) {
            this.rsoData.scan_copy_url = response.data.rso_scan_copy;
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
        this.extractedText = '';
        // Reset personnel selection
        this.selectedPersonnel = [];
        this.personnelSearch = '';
        this.showDropdown = false;
      },
      // Personnel selection methods
      async loadPersonnel() {
        try {
          const response = await axios.get(`${API_BASE_URL}/get_names_json`);
          this.allPersonnel = response.data;

          // Add "Select All Personnel" entry to the allPersonnel list
        this.allPersonnel.unshift({
          name_id: 'all',
          first_name: 'select',
          middle_init: 'all',
          last_name: 'personnel'
        });

          this.filteredPersonnel = [
            ...this.allPersonnel // Spread the personnel data after 'All' entry
          ];
          console.log(this.filteredPersonnel)
        } catch (error) {
          console.error('Error loading personnel:', error);
        }
      },
      filterPersonnel() {
        if (this.personnelSearch.trim() === '') {
          this.filteredPersonnel = [];
          this.showDropdown = false;
        } else {
          const searchTerm = this.personnelSearch.toLowerCase();
          // Filter out selected personnel
          this.filteredPersonnel = this.allPersonnel.filter(person =>
            !this.selectedPersonnel.some(selected => selected.name_id === person.name_id) && 
            `${person.first_name} ${person.middle_init} ${person.last_name}`.toLowerCase().includes(searchTerm)
          );
          this.showDropdown = this.filteredPersonnel.length > 0;
        }
      },
      selectPersonnel(person) {
        // Check if "All Personnel" is already selected
        const allPersonnelEntry = this.selectedPersonnel.find(p => p.name_id === 'all');

        if (allPersonnelEntry) {
          // If "All Personnel" is selected and the user adds another person, remove "All Personnel"
          this.selectedPersonnel = this.selectedPersonnel.filter(p => p.name_id !== 'all');
        }

        // Now add the selected person (if not already added)
        if (!this.selectedPersonnel.find(p => p.name_id === person.name_id)) {
          this.selectedPersonnel.push(person);
        }
        this.personnelSearch = '';
        this.showDropdown = false;
        this.updateRsoName();
      },
      removePersonnel(index) {
        this.selectedPersonnel.splice(index, 1);
        this.updateRsoName();
      },
      updateRsoName() {
        // Convert selected personnel to comma-separated string of name_ids
        this.rsoData.rso_name = this.selectedPersonnel.map(person => person.name_id).join(', ');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Base styles */
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #f4f7fc;
    margin: 0;
    padding: 0;
  }
  .outer{
    display: flex;
    justify-content: center;
  }

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
    z-index: 9;
  }
  .modal-content {
    width: 90%;
    max-width: 750px;
    background: linear-gradient(180deg, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    border: 2px solid #000000;
    position: absolute;
    z-index: 999;
  }

  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .form-group {
    flex: 1;
    min-width: 200px;
    margin-bottom: 20px;
  }

  label {
    font-size: 14px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 8px;
    display: block;
  }

  input, select, textarea {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }

  input[type="checkbox"] {
    width: auto;
  }

  input:focus, select:focus, textarea:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.4);
  }

  .modal-buttons {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .modal-buttons button {
    padding: 18px 40px;
    font-size: 18px;
    font-weight: 700;
    background-color: #000000;
    color: rgb(255, 255, 255);
    border: solid black 2px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 10px 30px rgba(243, 156, 18, 0.3);
    font-family: 'Playfair Display', serif;
  }

  .modal-buttons button:hover {
    background-color: #6d6c6c;
    transform: translateY(-3px);
  }

  .processing-indicator {
    margin-top: 5px;
    color: #007bff;
    font-weight: bold;
    font-size: 14px;
  }

  /* Multi-select styles */
  .multi-select {
    position: relative;
  }

  .selected-items {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    min-height: 40px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: linear-gradient(135deg, #f0f4ff 0%, #e8f2ff 100%);
    margin-bottom: 5px;
  }

  .selected-item {
    display: inline-flex;
    align-items: center;
    background-color: #f0f0f0;
    color: #333;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    border: 1px solid #ccc;
  }

  .selected-item button {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    margin-left: 5px;
    font-size: 14px;
  }

  .personnel-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #f0f4ff 0%, #e8f2ff 100%);
    border: 1px solid #ccc;
    border-radius: 8px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .dropdown-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  }

  .dropdown-item:hover {
    background-color: #f8f9fa;
  }

  .dropdown-item:last-child {
    border-bottom: none;
  }

  @media screen and (max-width: 768px) {
    .form-row {
      flex-direction: column;
    }

    .form-group {
      width: 100%;
    }
  }
  </style>
  