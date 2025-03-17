<template>
  <div class="popup-overlay">
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-header">
          <h2 class="title">EDIT REQUEST SLIP</h2>
          <h4 class="subtitle">(Administrative Section)</h4>
          <button type="button" class="close-btn" @click="$emit('close')">×</button>
        </div>

        <div class="info-container">
          <div class="info-item">
            <label for="name">Name:</label>
            <select
              v-model="form.name_id"
              id="name"
              required
              @change="fetchSelectedEmployee"
              :disabled="!isAdmin"
            >
              <option disabled value="">Select a name</option>
              <option
                v-for="option in availableNames"
                :key="option.name_id"
                :value="option.name_id"
              >
                {{ option.last_name }}, {{ option.first_name }}
                {{ option.middle_init }}
              </option>
            </select>
          </div>
          <div class="info-item">
            <label for="division">Division:</label>
            <input type="text" v-model="division" required readonly />
          </div>
          <div class="info-item">
            <label for="dateToday">Date and Time:</label>
            <input type="text" id="dateToday" v-model="form.date" readonly />
          </div>
        </div>

        <table class="request-table">
          <thead>
            <tr>
              <th>DOCUMENT(S) REQUESTED</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(doc, index) in documentOptions" :key="doc.name">
              <td>
                <label>
                  <input type="checkbox" v-model="doc.checked" id="cbx" style="display: none;" />
                  <div class="check">
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
      <polyline points="1 9 7 14 15 4"></polyline>
    </svg>
  </div>
                  {{ doc.name }}
                </label>
                <input
                  v-if="doc.name === 'OTHERS' && doc.checked"
                  type="text"
                  v-model="otherDocumentText"
                  placeholder="Please specify..."
                  class="others-input"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div class="button-container">
          <button type="submit" :disabled="formDisable">Update Request</button>
          <button type="button" @click="$emit('close')">Cancel</button>
        </div>

        <div v-if="pleaseWait" class="formcorrect">
          <p>Updating!! Please wait for a moment...</p>
        </div>
        <div v-else-if="loading" class="loading">
          <div class="loader"></div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { API_BASE_URL } from "@/config";
import axios from "axios";

export default {
  props: {
    requestData: {
      type: Object,
      required: true
    },
    names: {
      type: Array,
      required: true
    },
    employees: {
      type: Array,
      required: true
    },
    divisions: {
      type: Array,
      required: true
    },
    requestId: {
      type: [Number, String],
      required: true
    }
  },
  
  data() {
    return {
      form: {
        name_id: "",
        division_id: "",
        date: "",
        documents: [],
      },
      otherDocumentText: "",
      division: "",
      pleaseWait: false,
      loading: false,
      formDisable: false,
      documentOptions: [
        { name: "PURCHASE REQUEST - REQUISITION AND ISSUE SLIP", checked: false },
        { name: "CERTIFICATE OF EMPLOYMENT WITH COMPENSATION", checked: false },
        { name: "INVENTORY CUSTODIAN SLIP", checked: false },
        { name: "PROPERTY ACKNOWLEDGEMENT RECEIPT", checked: false },
        { name: "GATE PASS", checked: false },
        { name: "PO FUEL", checked: false },
        { name: "PROPERTY RETURN SLIP", checked: false },
        { name: "R&M OF MOTOR VEHICLES", checked: false },
        {
          name: "JOB ORDER FOR FURNITURE & FIXTURES, LIGHTINGS, PLUMBING, & A/C",
          checked: false,
        },
      { name: "OTHERS", checked: false },
      ],
      
      nameId: localStorage.getItem("nameId"),
      
    };
  },
  watch: {
    otherDocumentText(newValue) {
      if (newValue !== newValue.toUpperCase()) {
        this.otherDocumentText = newValue.toUpperCase();
      }
    }
  },
  
  computed: {
    isAdmin() {
      return this.nameId === "2" || this.nameId === "76";
    },
    availableNames() {
      if (this.isAdmin) {
        return this.names;
      } else {
        return this.names.filter(name => name.name_id === parseInt(this.nameId));
      }
    }
  },
  
  created() {
    this.initializeForm();
  },
  
  methods: {
    initializeForm() {
  this.form.name_id = this.requestData.name_id;
  this.form.date = this.requestData.date;

  this.fetchSelectedEmployee();
  
  if (this.requestData.documents && this.requestData.documents.length > 0) {
    // Convert documents to a consistent format for easier comparison
    const requestedDocs = this.requestData.documents.map(doc => 
      typeof doc === 'object' ? doc.name : doc
    );
    
    // Find standard document types
    const standardDocNames = this.documentOptions
      .filter(option => option.name !== "OTHERS")
      .map(option => option.name);
    
    // Check each document option
    this.documentOptions.forEach(docOption => {
      if (docOption.name === "OTHERS") {
        // Find any document that doesn't match standard options
        const otherDocs = requestedDocs.filter(requestedDoc => 
          !standardDocNames.includes(requestedDoc.trim())
        );
        
        if (otherDocs.length > 0) {
          docOption.checked = true;
          // Use the first non-standard document as the "OTHERS" text
          this.otherDocumentText = otherDocs[0];
        }
      } else {
        // For standard options, check if they exist in the requested docs
        docOption.checked = requestedDocs.some(requestedDoc => 
          requestedDoc.trim() === docOption.name.trim()
        );
      }
    });
  }
},
    capitalizeOtherDocument() {
    this.otherDocumentText = this.otherDocumentText.toUpperCase();
  },
    fetchSelectedEmployee() {
      const selectedEmployee = this.employees.find(
        (emp) => emp.name_id === parseInt(this.form.name_id)
      );
      
      if (selectedEmployee) {
        this.form.division_id = selectedEmployee.division_id;
        this.division = this.findDivisionName(selectedEmployee.division_id);
      } else {
        this.form.division_id = "";
        this.division = "";
      }
    },
    
    findDivisionName(divisionId) {
      const divisionItem = this.divisions.find(
        (div) => div.division_id === divisionId
      );
      return divisionItem ? divisionItem.division_name : "";
    },
    
    async handleSubmit() {
      if (this.otherDocumentText) {
        const othersDocument = this.documentOptions.find((doc) => doc.name === "OTHERS");
        if (othersDocument && othersDocument.checked) {
        
          const otherDocumentName = this.otherDocumentText.toUpperCase();
          
          this.form.documents = this.documentOptions
            .filter((doc) => doc.checked)
            .map((doc) => doc.name === "OTHERS" ? otherDocumentName : doc.name);
        } else {
          this.form.documents = this.documentOptions
            .filter((doc) => doc.checked)
            .map((doc) => doc.name);
        }
      } else {
        this.form.documents = this.documentOptions
          .filter((doc) => doc.checked)
          .map((doc) => doc.name);
      }
      
      if (
        !this.form.name_id ||
        !this.form.division_id ||
        this.form.documents.length === 0 
      ) {
        alert("Please fill all required fields and select at least one document.");
        return;
      }
   
      const formattedDocuments = this.form.documents.map(docName => {
   
        const existingDoc = this.requestData.documents.find(d => 
          (typeof d === 'object' && d.name === docName) || d === docName
        );
        
        if (existingDoc && typeof existingDoc === 'object' && existingDoc.remarks) {
          return {
            name: docName,
            remarks: existingDoc.remarks
          };
        } else {
          return {
            name: docName,
            remarks: "No Remarks"
          };
        }
      });
      
      this.pleaseWait = true;
      this.loading = true;
      this.formDisable = true;
      
      try {
        // Prepare the payload
        const payload = {
          name_id: this.form.name_id,
          division_id: this.form.division_id,
          documents: formattedDocuments
        };
        
        const response = await axios.post(
  `${API_BASE_URL}/FADRFupdate_request/${this.requestId}`,
  payload,
  {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }
);

// And then update your response handling
if (response.status < 200 || response.status >= 300) {
  throw new Error('Failed to update request');
}

// Emit success event with updated data
this.$emit('update-success', response.data);
      } catch (error) {
        console.error('Error updating request:', error);
        alert('Failed to update the request. Please try again.');
        // Emit failure event
        this.$emit('update-error', error);
      } finally {
        // Reset states after submission
        this.pleaseWait = false;
        this.loading = false;
        this.formDisable = false;
      }
    }
  }
};
</script>
  
  <style scoped>
 [id^="cbx"]:checked + .check svg {
  stroke: black;
}

[id^="cbx"]:checked + .check svg path {
  stroke-dashoffset: 60;
  transition: all 0.3s linear;
}

[id^="cbx"]:checked + .check svg polyline {
  stroke-dashoffset: 42;
  transition: all 0.2s linear;
  transition-delay: 0.15s;
}

.check {
  cursor: pointer;
  position: relative;
  width: 18px;
  height: 18px;
  -webkit-tap-highlight-color: transparent;
  transform: translate3d(0, 0, 0);
  display: inline-block; /* Change to inline-block */
  vertical-align: middle; /* Align vertically */
  margin-right: 10px; /* Add margin to separate from label text */
  float: left; /* Float to the left */
}

.check:before {
  content: "";
  position: absolute;
  top: -15px;
  left: -15px;
  width: 48px;
  height: 48px;
  border-radius: 5px;
  background: rgba(34,50,84,0.03);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.check svg {
  position: relative;
  z-index: 1;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: black;
  stroke-width: 1.5;
  transform: translate3d(0, 0, 0);
  transition: all 0.2s ease;
}

.check svg path {
  stroke-dasharray: 60;
  stroke-dashoffset: 0;
}

.check svg polyline {
  stroke-dasharray: 22;
  stroke-dashoffset: 66;
}

.check:hover:before {
  opacity: 1;
}

.check:hover svg {
  stroke: black;
}

/* Apply proper spacing for label text */
.request-table label {
  display: flex;
  align-items: center;
  padding: 5px 0;
}

/* Ensure the "Others" input aligns properly */
.others-input {
  margin-top: 10px;
  width: calc(100% - 28px); /* Account for checkbox width */
  margin-left: 28px; /* Align with text after checkbox */
  padding: 8px;
  border: 1px solid #8b5e34;
  border-radius: 5px;
}
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .form-container {
    margin: 2em auto;
  font-family: "Poppins", sans-serif;
  flex-direction: column;
  width: 90%;
  max-width: 900px;
  background: #fffbf2;
  padding: 60px;
  border-radius: 5px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  }
  
  .form-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  
  .title {
    text-align: center;
    margin-bottom: 5px;
  }
  
  .subtitle {
    text-align: center;
    margin-top: 0;
    margin-bottom: 20px;
    color: #666;
  }
  
  .close-btn {
    display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  position: absolute;
  
  right: -3rem;
  font-size: 2rem;
  height: 3rem;
  width: 3rem;

  position: absolute;
  top: -3rem;
  
  }
  .close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
    
  }
  .info-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .info-item {
    flex: 1 0 30%;
    min-width: 200px;
  }
  
  .info-item label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .info-item input,
  .info-item select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .request-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  .request-table th {
    padding: 10px;
    text-align: left;
  }
  
  .request-table td {
    padding: 10px;
  }
  
  .others-input {
    margin-top: 10px;
    width: 100%;
    padding: 8px;
    border: 1px solid #8b5e34;
    border-radius: 5px;
  }
  
  .button-container {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  
  .button-container button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .button-container button:hover {
    background-position: right top;
  }
  
  .button-container button[type="submit"] {
    padding: 0.9em 1.4em;
  border-radius: 5px;
  font-size: 16px;
  min-width: 85px;
  min-height: 35px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: none;
  transition: 0.8s;
  background-size: 280% auto;
  background-image: linear-gradient(
    325deg,
    #bfa16d 0%,
    #bfa16dc2 60%,
    #bfa16d 90%
  );
  color: #fffbf2;
  }
  
  .button-container button[type="button"] {
    padding: 0.9em 1.4em;
  border-radius: 5px;
  font-size: 16px;
  min-width: 85px;
  min-height: 35px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: none;
  transition: 0.8s;
  background-size: 280% auto;
  background-image: linear-gradient(
    325deg,
    #bfa16d 0%,
    #bfa16dc2 60%,
    #bfa16d 90%
  );
  color: #fffbf2;
  }
  
  
  .loading {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 2s linear infinite;
  }
  
  .formcorrect {
    text-align: center;
    color: green;
    margin-top: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  </style>