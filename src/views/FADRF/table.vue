<template>
  <div style="display: flex; flex-direction: column;">
    <h2 style="display: flex; flex-direction: row; align-self: center;" class="hist">History for:
      <select v-model="selectedStatus" id="status" class="styled-select">
        <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
      </select>
      <span v-if="pendingCount !== 0" class="notification-count">{{ pendingCount }}</span>
    </h2>
    <div v-if="load" class="loadings">
      <img src='../../assets/loading.gif' width="auto" height="100px" />
    </div>
    <div style="display: flex; flex-direction: column; align-items: center;" v-if="otp">
      <otpz />
    </div>
    <div class="search" style="display: flex; flex-direction: row; justify-content: space-between; align-items: end; margin-top: 15px; margin-bottom: 10px; height: 35px;">
      <div v-if="mawala" style="display: flex; border: 2px solid black; border-radius: 5px; align-items: center; height: 30px; position: relative;">
        <img class="imgsearch" style="height: 20px; width:20px; position: relative; padding-left: 5px;" src="../../assets/search.png">
        <input class="pholder" type="text" v-model="searchQuery" placeholder="Search TO number or Name">
      </div>
    </div>

    <div v-if="mawala" class="outer">
      <div v-if="showRatingPopup">
        <RatingPopup @submit="handleRating" @close="showRatingPopup = false" />
      </div>

      <EditDetailsPopup 
        v-if="showEditDetailsPopup" 
        :documents="currentItem.documents" 
        @submit="handleEditDetails" 
        @close="showEditDetailsPopup = false"   
      />
      <div class="scrollable-table">
        <table>
          <thead>
            <tr>
              <th style="text-align: center;">Requestor</th>
              <th style="text-align: center;">Document Requested</th>
              <th style="text-align: center;">Date & Time</th>
              <th style="text-align: center;">Status</th>
              <th style="text-align: center;">Rating</th>
              <th style="text-align: center;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in reversedFormData" :key="index">
              <td>{{ getName(item.name_id) }}</td>
              <td>
                <span v-if="Array.isArray(item.documents) && item.documents.length">
                  <span v-for="(doc, docIndex) in item.documents" :key="docIndex">
                    {{ getDocumentName(doc) }} <br>
                  </span>
                </span>
                <span v-else>No documents requested</span>
              </td>
              <td>{{ item.date }}</td>
              <td>
                <span v-if="Array.isArray(item.documents) && item.documents.length">
                  <span v-for="(doc, docIndex) in item.documents" :key="'remarks-' + docIndex">
                    {{ doc.remarks || 'No remarks' }} <br>
                  </span>
                </span>
                <span v-else>No remarks</span>
              </td>
              <td>
                <span v-if="item.rating !== null">
                  <span v-for="n in item.rating" :key="n">⭐</span>
                </span>
                <button v-else @click="openRatingPopup(item)" :disabled="item.rating===0">Rating</button>
              </td>

              <td>
                <button v-if="isAdmin" @click="openEditDetailsPopup(item)">Edit</button>
                <button @click="generatePDF(item)">View PDF</button>
                <button @click="add(item)">View Note</button>
              </td> 
            </tr>
            <h1 style="text-align: center; margin-bottom: 0px;" v-if="reversedFormData.length == 0">NO MATCH FOUND</h1>
          </tbody>
        </table>
        <Note
          v-if="addNote"
          :initialNote="currentItem.note || ''" 
          :isAdmin="isAdmin"
          @close-note="closeNote"
          @save-note="saveNote"
         />
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import editform from './../editform.vue';
import PDF from './PDF.vue';
import RatingPopup from './Rating.vue';
import { API_BASE_URL } from '@/config';
import EditDetailsPopup from './EditDetailsPopup.vue';
import Note from './Note.vue';


export default {
  components: {
    name: 'PDF',
  props: {
    item: {
      type: Object,
      required: true
    },
    names: {
      type: Object,
      required: true
    },
    divisions: {
      type: Array,
      required: true
    },
    logoPath: {
      type: String,
      default: ""
    },
    debugMode: {
      type: Boolean,
      default: false
    }
  },
    RatingPopup,
    editform,
    EditDetailsPopup,
    Note,
    PDF,
    props: {
    data: {
      type: Object,
      required: true
    }
  },
  },


  data() {
    return {
      divisions: [],
      showRatingPopup: false,
      showEditDetailsPopup: false,
      currentItem: '',
      selectedStatus: 'Me',
      options: ['Pending', 'Done', 'Me'],
      yearToday: new Date().getFullYear(),
      formData: [],
      names: {},
      employees: {},
      accountId: localStorage.getItem('accountId'),
      acc: [],
      load: true,
      mawala: false,
      addNote: false,
      viewNote: false,
      noteText: '',
      searchQuery: '',
      documents: [],
      name: 'PDF',
      props: ['data'],
      parsedDocuments: [],
      selectedDocuments: [],
      timeReleased: '',
      dateTimeReleased: '',
      rating: null,
      nameId: localStorage.getItem('nameId'),

  documentList: [
    'PURCHASE REQUEST - REQUISITION AND ISSUE SLIP',
    'CERTIFICATE OF EMPLOYMENT WITH COMPENSATION',
    'INVENTORY CUSTODIAN SLIP',
    'PROPERTY ACKNOWLEDGEMENT RECEIPT',
    'GATE PASS',
    'PO FUEL',
    'PROPERTY RETURN SLIP',
    'R&M OF MOTOR VEHICLES',
    'JOB ORDER FOR FURNITURE & FIXTURES, LIGHTINGS, PLUMBING, & A/C',
    'Others'
  ],

  created() {
    this.parseRequestedDocuments();
  },

  props: {
    data: {
      type: Object,
      required: true
    }
  }
};
  },
  
  mounted() {
    this.fetchAccounts();
    this.fetchEmployees();
    this.fetchNames();
    this.fetchData(); 
    this.fetchDivisions();
    this.fetchDocuments();
    console.log(this.data);
  },

  methods: {
    focusTextarea(text) {
      this.noteText = text;
      this.$refs.noteInput.focus();
    },

    getTimeRequested(dateString) {
      try {
        const dateObj = new Date(dateString);
        if (!isNaN(dateObj.getTime())) {
          // Format time as HH:MM AM/PM
          return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      } catch (e) {
        console.error("Error parsing date:", e);
      }
      return 'N/A'; // Return N/A if there's an error
    },
    findDivisionName(division_Id) {
  if (this.divisions && this.divisions.length > 0) {
    const division = this.divisions.find(div => div.division_id === division_Id);
    return division?.division_name || 'UNKNOWN';
  }
  return 'UNKNOWN';
},

fetchDivisions() {
    axios.get(`${API_BASE_URL}/get_divisions_json`) // Adjust the endpoint as necessary
      .then(response => {
        this.divisions = response.data; // Store the fetched divisions
      })
      .catch(error => {
        console.error('Error fetching divisions:', error);
      });
  },
  parseRequestedDocuments() {
      // Make sure documents is an array
      const requestedDocs = Array.isArray(this.item.documents) ? this.item.documents : JSON.parse(this.item.documents || '[]');
      
      // Check each document in our list against the requested documents
      this.parsedDocuments = this.documentList.map(docName => {
        return {
          name: docName,
          isChecked: requestedDocs.includes(docName)
        };
      });
      
      // Add "Others" text if available
      const othersDoc = this.parsedDocuments.find(doc => doc.name === 'Others');
      if (othersDoc && othersDoc.isChecked) {
        othersDoc.additionalText = this.getOthersText();
      }
      
      console.log('Parsed Documents:', this.parsedDocuments);
      return this.parsedDocuments;
    },

    
    
    isDocumentRequested(documentName) {
      // Parse documents if not already parsed
      if (this.parsedDocuments.length === 0) {
        this.parseRequestedDocuments();
      }
      
      // Find the document and return whether it's checked
      const doc = this.parsedDocuments.find(d => d.name === documentName);
      return doc ? doc.isChecked : false;
    },
    
    getOthersText() {
      if (this.item.otherDocuments) {
        return this.item.otherDocuments;
      } else if (typeof this.item.documents === 'string' && this.item.documents.includes('Others:')) {
        const othersMatch = this.item.documents.match(/Others:\s*(.+?)(?:,|$)/);
        if (othersMatch && othersMatch[1]) {
          return othersMatch[1].trim();
        }
      }
      return '';
    },
    generatePDF(item) {
  this.$nextTick(() => {
    const printableElement = document.createElement("div");
    printableElement.id = "printableArea";
    printableElement.style.padding = "20px";
    printableElement.style.fontFamily = "Arial, sans-serif";
    printableElement.style.textAlign = "center";

        const checkDocuments = () => {
      documents.value.forEach(doc => {
        doc.checked = item.documents.includes(doc.name);
      });
    };

    const formatDateTime = (dateString) => {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        // Format: "MM/DD/YYYY HH:MM AM/PM"
        return date.toLocaleString([], { 
          month: '2-digit', 
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit', 
          minute: '2-digit'
        });
      } catch (e) {
        console.error("Error formatting date:", e);
        return '';
      }
    };

    const getProcessedDocuments = () => {
      if (!item.documents) return [];
      
      // If documents is a string, try to parse it
      if (typeof item.documents === 'string') {
        try {
          return JSON.parse(item.documents);
        } catch (e) {
          console.error("Error parsing documents JSON:", e);
          return [];
        }
      }
      
      // If documents is already an array, return it properly formatted
      if (Array.isArray(item.documents)) {
        return item.documents.map(doc => {
          // If doc is already an object with name and releaseDate, return it
          if (typeof doc === 'object' && doc !== null) {
            return doc;
          }
          // Otherwise, create an object with default values
          return { name: doc, releaseDate: '', remarks: '' };
        });
      }
      
      return [];
    };
    
    const processedDocs = getProcessedDocuments();

    function renderOthersDocumentRow(item, processedDocs) {
  let othersText = "";
    
  // First check if otherDocuments is directly available
  if (item.otherDocuments) {
    othersText = item.otherDocuments;
  } 
  // Then check if otherDocumentText is available from the form
  else if (item.otherDocumentText) {
    othersText = item.otherDocumentText;
  }
  // Check in the documents array for an "Others" entry with custom name
  else {
    // Look for an "Others" entry in processed documents
    const othersDoc = processedDocs.find(doc => {
      if (typeof doc === 'object') {
        // Check if this is the others document (could be renamed from "Others")
        return doc.originalName === "OTHERS" || doc.name.includes("Others:") || doc.name === "Others";
      }
      return doc === "Others" || doc.includes("Others:");
    });
    
    if (othersDoc) {
      if (typeof othersDoc === 'object') {
        // If the object has a custom name different from "Others", use that
        if (othersDoc.name !== "Others" && !othersDoc.name.includes("Others:")) {
          othersText = othersDoc.name;
        }
        // If there's additional text stored
        else if (othersDoc.additionalText) {
          othersText = othersDoc.additionalText;
        }
      } else if (typeof othersDoc === 'string' && othersDoc.includes("Others:")) {
        // Extract the text after "Others:"
        const match = othersDoc.match(/Others:\s*(.+)$/);
        if (match && match[1]) {
          othersText = match[1].trim();
        }
      }
    }
  }
  
  // Return the rendered table row with the extracted othersText
  return `
    <tr class="documents-row">
      <td><input type="checkbox" ${isDocumentRequested('Others') ? 'checked' : ''} /></td>
      <td>Others: ${othersText ? othersText : '_______________________________'}</td>
      <td>${getTimeReleasedForDoc('Others')}</td>
      <td>${releasedBy('Others')}</td>
      <td></td>
    </tr>
  `;
}
    let othersText = "";
    
    // First check if otherDocuments is directly available
    if (item.otherDocuments) {
      othersText = item.otherDocuments;
    } 
    // Then check if otherDocumentText is available from the form
    else if (item.otherDocumentText) {
      othersText = item.otherDocumentText;
    }
    // Check in the documents array for an "Others" entry with custom name
    else {
      // Look for an "Others" entry in processed documents
      const othersDoc = processedDocs.find(doc => {
        if (typeof doc === 'object') {
          // Check if this is the others document (could be renamed from "Others")
          return doc.originalName === "OTHERS" || doc.name.includes("Others:") || doc.name === "Others";
        }
        return doc === "Others" || doc.includes("Others:");
      });
      
      if (othersDoc) {
        if (typeof othersDoc === 'object') {
          // If the object has a custom name different from "Others", use that
          if (othersDoc.name !== "Others" && !othersDoc.name.includes("Others:")) {
            othersText = othersDoc.name;
          }
          // If there's additional text stored
          else if (othersDoc.additionalText) {
            othersText = othersDoc.additionalText;
          }
        } else if (typeof othersDoc === 'string' && othersDoc.includes("Others:")) {
          // Extract the text after "Others:"
          const match = othersDoc.match(/Others:\s*(.+)$/);
          if (match && match[1]) {
            othersText = match[1].trim();
          }
        }
      }
    }
    
    // Function to generate rating option HTML based on current rating
    const generateRatingOption = (value, label) => {
  // Only parse and apply rating if it exists and is not null/undefined/empty
  const hasRating = item.rating !== undefined && item.rating !== null && item.rating !== '';
  const currentRating = hasRating ? parseInt(item.rating) : null;
  const isSelected = hasRating && currentRating === value;
  
  // Add revision text only for Very dissatisfied rating (value 1)
  const revisionText = value === 1 ? '<span style="margin-left: 340px; font-weight: normal;">revised document Feb 2025</span>' : '';

  
  return `
    <div class="rating-option ${isSelected ? 'selected' : ''}">
      <span class="star ${isSelected ? 'filled' : 'empty'}">${isSelected ? '★' : '☆'}</span>
      <strong>${value} - ${label}</strong>
      ${revisionText}
    </div>
  `;
};

const releasedBy = (docName) => {
  const doc = processedDocs.find(d => 
    (typeof d === 'object' && d.name === docName) || d === docName
  );
  
  let isReleased = false;
  
  if (doc && typeof doc === 'object') {
    // Check if the document has a release date or remarks containing "Released"
    if (doc.releaseDate) {
      isReleased = true;
    } else if (doc.remarks && doc.remarks.includes('Released')) {
      isReleased = true;
    }
  }
  
  // Return "Joanne Rose O. Alvarez" if the document is released
  return isReleased ? 'Joanne Rose O. Alvarez' : '';
};



const isDocumentRequested = (docName) => {
      return processedDocs.some(doc => 
        (typeof doc === 'object' && doc.name === docName) || doc === docName
      );
    };
    
    const getTimeReleasedForDoc = (docName) => {
      const doc = processedDocs.find(d => 
        (typeof d === 'object' && d.name === docName) || d === docName
      );

      let isReleased = false;
      let releaseTime = '';


      
      if (doc && typeof doc === 'object' && doc.releaseDate) {
        return formatDateTime(doc.releaseDate);
      }
      
      // Check if remarks contain "Released" which might indicate it was released
      if (doc && typeof doc === 'object' && doc.remarks && doc.remarks.includes('Released')) {
        // If the document is marked as released but doesn't have a date, use current time
        return formatDateTime(new Date());
      }

      if (doc && typeof doc === 'object') {
    // Check if the document has a release date or remarks containing "Released"
    if (doc.releaseDate) {
      isReleased = true;
      releaseTime = formatDateTime(doc.releaseDate);
    } else if (doc.remarks && doc.remarks.includes('Released')) {
      isReleased = true;
      releaseTime = formatDateTime(new Date());
    }
  }
      
      return '';


      
    };
    printableElement.innerHTML = `
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-section">
              <img src="${this.logoPath}" alt="DENR Logo" class="logo">
              <div class="title-section">
                <h3>Republic of the Philippines</h3>
                <h4>Department of Environment and Natural Resources</h4>
                <h4>MINES AND GEOSCIENCES BUREAU</h4>
                <h4>Regional Office No. X</h4>
                <p>DENR-X Compound, Puntod, Cagayan de Oro City</p>
                <p>Telefax Nos. (088) 856-2110;(088) 856-1331; Email: region10@mgb.gov.ph</p>
              </div>
            </div>
            <div class="certification-section">
              <div class="certification-images">
                <img src="/api/placeholder/50/50" alt="ISO Certification">
                <img src="/api/placeholder/50/50" alt="Quality Certification">
              </div>
            </div>
          </div>
          
          <div class="form-title">REQUEST SLIP FORM</div>
          <div class="admin-section">(Administrative Section-Procurement/Property)</div>
          
          <div class="form-content">
            <table>
              <tr class="form-row">
                <td><strong>Requestor:</strong></td>
                <td>${this.getName(item.name_id)}</td>
                <td rowspan="3"></td>
              </tr>
              <tr class="form-row">
                <td><strong>Division:</strong></td>
                <td>${this.findDivisionName(item.division_id)}</td>
              </tr>
              <tr class="form-row">
                <td><strong>Date & Time Requested:</strong></td>
                <td>${item.date}</td>
              </tr>
              
              <tr class="documents-header">
                <td colspan="2">DOCUMENT(S) REQUESTED</td>
                <td style="width: 20%;">Date & Time Released</td>
                <td style="width: 30%;">Released By</td>
              </tr>
              
      <tr class="documents-row">
                <td><input type="checkbox" ${isDocumentRequested('PURCHASE REQUEST - REQUISITION AND ISSUE SLIP') ? 'checked' : ''} /></td>
                <td>PURCHASE REQUEST - REQUISITION AND ISSUE SLIP</td>
                <td>${getTimeReleasedForDoc('PURCHASE REQUEST - REQUISITION AND ISSUE SLIP')}</td>
                <td>${releasedBy('PURCHASE REQUEST - REQUISITION AND ISSUE SLIP')}</td>
                <td></td>
              </tr>
              <tr class="documents-row">
                <td><input type="checkbox" ${isDocumentRequested('CERTIFICATE OF EMPLOYMENT WITH COMPENSATION') ? 'checked' : ''} /></td>
                <td>CERTIFICATE OF EMPLOYMENT WITH COMPENSATION</td>
                <td>${getTimeReleasedForDoc('CERTIFICATE OF EMPLOYMENT WITH COMPENSATION')}</td>
                <td>${releasedBy('CERTIFICATE OF EMPLOYMENT WITH COMPENSATION')}</td>
                <td></td>
              </tr>
              <tr class="documents-row">
                <td><input type="checkbox" ${isDocumentRequested('INVENTORY CUSTODIAN SLIP') ? 'checked' : ''} /></td>
                <td>INVENTORY CUSTODIAN SLIP</td>
                <td>${getTimeReleasedForDoc('INVENTORY CUSTODIAN SLIP')}</td>
                <td>${releasedBy('INVENTORY CUSTODIAN SLIP')}</td>
                <td></td>
              </tr>
              <tr class="documents-row">
                <td><input type="checkbox" ${isDocumentRequested('PROPERTY ACKNOWLEDGEMENT RECEIPT') ? 'checked' : ''} /></td>
                <td>PROPERTY ACKNOWLEDGEMENT RECEIPT</td>
                <td>${getTimeReleasedForDoc('PROPERTY ACKNOWLEDGEMENT RECEIPT')}</td>
                <td>${releasedBy('PROPERTY ACKNOWLEDGEMENT RECEIPT')}</td>
                <td></td>
              </tr>
              <tr class="documents-row">
                <td><input type="checkbox" ${isDocumentRequested('GATE PASS') ? 'checked' : ''} /></td>
                <td>GATE PASS</td>
                <td>${getTimeReleasedForDoc('GATE PASS')}</td>
                <td>${releasedBy('GATE PASS')}</td>
                <td></td>
              </tr>
              <tr class="documents-row">
                <td><input type="checkbox" ${isDocumentRequested('PO FUEL') ? 'checked' : ''} /></td>
                <td>PO FUEL</td>
                <td>${getTimeReleasedForDoc('PO FUEL')}</td>
                <td>${releasedBy('PO FUEL')}</td>
                <td></td>
              </tr>
              <tr class="documents-row">
                <td><input type="checkbox" ${isDocumentRequested('PROPERTY RETURN SLIP') ? 'checked' : ''} /></td>
                <td>PROPERTY RETURN SLIP</td>
                <td>${getTimeReleasedForDoc('PROPERTY RETURN SLIP')}</td>
                <td>${releasedBy('PROPERTY RETURN SLIP')}</td>
                <td></td>
              </tr>
              <tr class="documents-row">
                <td><input type="checkbox" ${isDocumentRequested('R&M OF MOTOR VEHICLES') ? 'checked' : ''} /></td>
                <td>R&M OF MOTOR VEHICLES</td>
                <td>${getTimeReleasedForDoc('R&M OF MOTOR VEHICLES')}</td>
                <td>${releasedBy('R&M OF MOTOR VEHICLES')}</td>
                <td></td>
              </tr>
              <tr class="documents-row">
                <td><input type="checkbox" ${isDocumentRequested('JOB ORDER FOR FURNITURE & FIXTURES, LIGHTINGS, PLUMBING, & A/C') ? 'checked' : ''} /></td>
                <td>JOB ORDER FOR FURNITURE & FIXTURES, LIGHTINGS, PLUMBING, & A/C</td>
                <td>${getTimeReleasedForDoc('JOB ORDER FOR FURNITURE & FIXTURES, LIGHTINGS, PLUMBING, & A/C')}</td>
                <td>${releasedBy('JOB ORDER FOR FURNITURE & FIXTURES, LIGHTINGS, PLUMBING, & A/C')}</td>>
                <td></td>
              </tr>
              <tr class="documents-row">
                <td><input type="checkbox" ${isDocumentRequested('Others') ? 'checked' : ''} /></td>
                <td>Others: ${othersText ? othersText : '_______________________________'}</td>
                <td>${getTimeReleasedForDoc('Others')}</td>
                <td>${releasedBy('Others')}</td>
                <td></td>
              </tr>
              
<tr>
  <td colspan="4" class="rating-label">RATING</td>
</tr>
<tr class="rating-row">
  <td colspan="4">
    ${generateRatingOption(4, 'Very Satisfied')}
    ${generateRatingOption(3, 'Satisfied')}
    ${generateRatingOption(2, 'Dissatisfied')}
    ${generateRatingOption(1, 'Very dissatisfied')}
  </td>
</tr>
            </table>
          </div>
        </div>
      </body>

      <style scoped>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #000;
        }
        
        .container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #ccc;
        }
        
        .header {
          display: flex;
          border-bottom: 1px solid #ccc;
          padding: 10px;
        }
        
        .logo-section {
          display: flex;
          width: 70%;
        }
        
        .logo {
          width: 100px;
          height: 100px;
        }
        
        .title-section {
          padding-left: 10px;
          line-height: 1.2;
        }
        
        .title-section h3, .title-section h4 {
          margin: 0;
        }
        
        .title-section h3 {
          font-weight: normal;
        }
        
        .title-section h4 {
          color: #000080;
        }
        
        .title-section p {
          margin: 5px 0;
          font-size: 13px;
        }
        
        .certification-section {
          width: 30%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        
        .certification-images img {
          height: 50px;
        }
        
        .form-title {
          text-align: center;
          font-weight: bold;
          font-size: 18px;
          margin: 10px 0;
        }
        
        .admin-section {
          text-align: center;
          margin-bottom: 10px;
          font-style: italic;
        }
        
        .form-content {
          width: 100%;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        td {
          border: 1px solid #ccc;
          padding: 5px 10px;
        }
        
        .form-row td:first-child {
          width: 20%;
          font-weight: bold;
        }
        
        .form-row td:nth-child(2) {
          width: 50%;
          border-bottom: 1px solid #000;
        }
        
        .form-row td:last-child {
          width: 30%;
        }
        
        .documents-header td {
          font-weight: bold;
          text-align: center;
        }
        
        .documents-row td:first-child {
          width: 5%;
          text-align: center;
        }
        
        .documents-row td:nth-child(2) {
          width: 50%;
        }
        
        .checkbox {
          width: 15px;
          height: 15px;
          border: 1px solid #000;
          display: inline-block;
        }
        
        .rating-row td {
          padding: 0;
        }
        
        .rating-label {
          font-weight: bold;
          padding: 5px 10px;
        }
        
        .star {
          display: inline-block;
          margin-right: 5px;
          color: #000080;
        }
        
        .rating-option {
        display: flex;
        align-items: center;
        margin: 5px 0;
        padding-left: 60px; /* Add space on the left for the revision text */

        }
        .rating-option.selected {
          font-weight: bold;
        }
        
        .star.filled {
          color: black;
        }
        
        .star.empty {
          color: #ccc;
        }
      </style>
    `;

    document.body.appendChild(printableElement);
    
    // Create an iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.display = 'none'; // Hide the iframe
    document.body.appendChild(printFrame); // Append it to the body

    // Prepare the content for the iframe
    const printDocument = printFrame.contentWindow.document;
    printDocument.open();
    printDocument.write(`
      <html>
        <head>
          <title>Print Request Slip</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            h2 { margin-bottom: 10px; }
          </style>
        </head>
        <body>${printableElement.innerHTML}</body>
      </html>
    `);
    printDocument.close();

    // Focus on the iframe and trigger print
    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();

    // Clean up: remove the iframe after printing
    printFrame.parentNode.removeChild(printFrame);

    // Remove the printable element from the document
    document.body.removeChild(printableElement);
  });
},

findDivisionName(division_Id) {
  if (this.divisions && this.divisions.length > 0) {
    const division = this.divisions.find(div => div.division_id === division_Id);
    return division?.division_name || 'UNKNOWN';
  }
  return 'UNKNOWN';
},

padWithZeroes(travel_order_id) {
  if (travel_order_id === undefined || travel_order_id === null) {
    console.warn('travel_order_id is undefined or null');
    return ''; // or return a default value, e.g., '0000'
  }
  const idString = travel_order_id.toString();
  return idString.padStart(4, '0');
},
    fetchDocuments() {
      axios.get(`${API_BASE_URL}/get_request`)
        .then(response => {
          this.documents = response.data;
        })
        .catch(error => {
          console.error('Error fetching documents:', error);
        });
    },
    openRatingPopup(item) {
      this.currentItem = item; 
      this.showRatingPopup = true;
    },
    add(item) {
      this.addNote = true; 
      this.noteText = item.note || "";
      this.currentItem = item; 
    },
    saveNote(updatedNote) {
      if (!this.isAdmin) {
    alert("You do not have permission to save notes.");
    return; // Exit the method if the user is not an admin
  }
  if (!this.currentItem || !this.currentItem.id) return;

  axios.post(`${API_BASE_URL}/FADRFupdate_request/${this.currentItem.id}`, {
    note: updatedNote,
  })
  .then(() => {
    this.currentItem.note = updatedNote;
    alert("Note saved successfully!");
  })
  .catch(error => {
    console.error("Error updating note:", error);
    alert("Failed to update note.");
  });
},
    closeNote() {
      this.addNote = false; // Hide the Add Note popup
      this.viewNote = false;
    },
    postNote(note) {
      const formData = new FormData();
      formData.append('note', note);
      axios.post(`${API_BASE_URL}/FADRFupdate_form/${this.notenum}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.fetchData();
        this.closeNote();
      }).catch(error => {
        console.error('Error:', error);
      });
    },
  
    getDocumentName(doc) {
  if (!doc) return "No document";
  return typeof doc === "object" ? doc.name || "Unknown" : doc;
},

    getReleasedStatus(doc) {
  return doc.remarks?.trim() === 'Released' ? 'Released' : 'Unreleased';
},

    openEditDetailsPopup(item) {
      this.currentItem = item; 
      this.showEditDetailsPopup = true; 
    },
    handleEditDetails(updatedDocuments) {
  if (!this.currentItem || !this.currentItem.id) {
    alert("No current item selected for update.");
    return;
  }

  
  const routes = [
  // other routes...
  {
    path: '/pdf',
    name: 'PDF',
    component: PDF,
    props: true // This allows you to pass props to the PDF component
  }
];

const processedDocuments = updatedDocuments.map(doc => {
    // Create a new object to avoid modifying the original
    const updatedDoc = { ...doc };
    
    // If a document is marked as released but doesn't have a releaseDate, add current timestamp
    if (updatedDoc.remarks && updatedDoc.remarks.trim() === 'Released' && !updatedDoc.releaseDate) {
      updatedDoc.releaseDate = new Date().toISOString();
    }
    
    return updatedDoc;
  });
  const payload = {
    documents: updatedDocuments,
    documents: processedDocuments,
    remarks: updatedDocuments.map(doc => doc.remarks).join(', ') // Join remarks for storage
  };
  axios.post(`${API_BASE_URL}/FADRFupdate_request/${this.currentItem.id}`, payload)
    .then(response => {
      if (response.status === 200) {
        alert("Documents updated successfully!");
        this.currentItem.documents = processedDocuments; 
        
        // Update the form data to reflect changes in the UI
        this.formData = this.formData.map(item => {
          if (item.id === this.currentItem.id) {
            return { ...item, documents: processedDocuments };
          }
          return item;
        });
      }
    })
    .catch(error => {
      console.error("Error updating documents:", error);
      alert("Failed to update documents. Please try again.");
    });


(`${API_BASE_URL}/FADRFupdate_request/${this.currentItem.id}`, payload)
    .then(response => {
      if (response.status === 200) {
        alert("Remarks updated successfully!");
        this.currentItem.documents = updatedDocuments; 
      }
    })
    .catch(error => {
      console.error("Error updating documents:", error);
      alert("Failed to update documents. Please try again.");
    });
},
    handleRating(rating) {
      const payload = { rating: rating };
      axios.post(`${API_BASE_URL}/FADRFupdate_request/${this.currentItem.id}`, payload)
        .then(response => {
          if (response.status === 200) {
            alert('Rating submitted successfully!');
            this.currentItem.rating = rating; 
          }
        })
        .catch(error => {
          console.error('Error submitting rating:', error);
          alert('Failed to submit rating. Please try again.');
        })
        .finally(() => {
          this.showRatingPopup = false; 
        });
    },
    closeEdit() {
      this.selectedTravelOrderIdEdit = 0;
    },
    printzz() {
      window.print();
    },
    closeNote() {
      this.addNote = false;
      this.viewNote = false;
    },
    postNote(note) {
  if (!this.currentItem || !this.currentItem.id) {
    alert("No request selected.");
    return;
  }

  const formData = new FormData();
  formData.append('note', note);

  axios.post(`${API_BASE_URL}/FADRFupdate_request/${this.currentItem.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(response => {
    if (response.status === 200) {
      alert("Note added successfully!");

      // Update the frontend state
      this.formData = this.formData.map(item =>
        item.id === this.currentItem.id ? { ...item, note } : item
      );

      this.closeNote();
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Failed to submit note. Please try again.");
  });
},
    fetchAccounts() {
      axios.get(`${API_BASE_URL}/get_accounts_json`)
        .then(response => {
          this.acc = response.data.find(result => result.account_id == this.accountId);
          this.fetchData();
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    fetchData() {
      axios.get(`${API_BASE_URL}/FADRFget_request`)
        .then(response => {
          this.mawala = true;
          this.load = false;
          this.formData = response.data.map(item => {
        let documents = [];

        try {
          documents = item.documents ? JSON.parse(item.documents) : [];
        } catch (error) {
          console.error("Error parsing documents JSON:", error);
        }

        return {
          ...item,
          documents: documents.map(doc => ({
            name: doc.name || doc, 
            remarks: doc.remarks?.trim() ? doc.remarks : 'No Remarks'
          })),
          rating: item.rating || null
        };
      });

      this.formData = this.formData.filter(item => {
            return this.nameId === '2' || this.nameId === '76' || item.name_id == this.nameId;
          });

      console.log("Processed FormData:", this.formData);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      this.load = false;
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
    padWithZeroes(travel_order_id) {
    if (travel_order_id === undefined || travel_order_id === null) {
        console.warn("padWithZeroes received an undefined or null value");
        return "0000"; // or some default value, depending on your requirements
    }
    
    const idString = travel_order_id.toString();
    return idString.padStart(4, '0');
},
    fetchDocuments() {
      axios.get(`${API_BASE_URL}/FADRFget_request`)
        .then(response => {
          this.documents = response.data;
        })
        .catch(error => {
          console.error('Error fetching documents:', error);
        });
    },
  },
  computed: {
    pendingCount() {
      return this.formData.filter(form => form.note === null && form.initial !== null).length;
    },
    filteredFormData() {
      return this.formData; // This can be used in the template for rendering
    },
    isAdmin() {
      return this.nameId === '2' || this.nameId === '76'; // Check if the user is an admin
    },
    reversedFormData() {
      return this.formData.slice().reverse().filter(item => {
      const paddedToNum = this.padWithZeroes(item.to_num);
      return paddedToNum.includes(this.searchQuery) || 
      String(this.getName(item.name_id)).toLowerCase().includes(this.searchQuery.toLowerCase());
      });
      },
},
};
</script>
  
  
  
  <style scoped>
  
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
    width: 100%;
    border-collapse: collapse;
  }
  
  th,
  td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
    position: sticky;
    top: -2px;
  }
  
  .scrollable-table {
    max-height: 630px;
    overflow-y: auto;
    margin: 15px;
  }
  
  .outer {
    border: 1px solid black;
    box-shadow: 0px 0px 4px black, 0px 0px 3px black inset;
    border-radius: 5px;
    width: 100%;
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
    border-radius: 10px;
    background: linear-gradient(150deg, #DDC7AD, #92785b);
    border: solid black 2px;
    padding: 10px 20px;
    color: rgb(0, 0, 0);
    cursor: pointer;
    transition: background 0.3s;
    margin: 0 5px;
    height: fit-content;
    justify-content: center;    
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
  
   .prent {
      position: fixed;
      top: 0;
      left: 0;
      width: fit-content;
      height: 100%; 
      max-height: 1000px; 
      z-index: 9999; 
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