<template>
  <div class="popup-overlay">
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-header">
          <h2 class="title">EDIT REQUEST SLIP</h2>
          <h4 class="subtitle">(Administrative Section)</h4>
          <button type="button" class="close-btn" @click="$emit('close')">
            ×
          </button>
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
                  <input
                    type="checkbox"
                    v-model="doc.checked"
                    id="cbx"
                    style="display: none"
                    :disabled="hasReleasedRemark(doc.name)"
                  />
                  <div class="check">
                    <svg width="18" height="18" viewBox="0 0 18 18">
                      <path
                        d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"
                      ></path>
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
                  :disabled="hasReleasedRemark(doc.name)"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div class="button-container">
          <button type="submit" :disabled="formDisable">Update Request</button>
         
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
      required: true,
    },
    names: {
      type: Array,
      required: true,
    },
    employees: {
      type: Array,
      required: true,
    },
    divisions: {
      type: Array,
      required: true,
    },
    requestId: {
      type: [Number, String],
      required: true,
    },
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
        {
          name: "PURCHASE REQUEST - REQUISITION AND ISSUE SLIP",
          checked: false,
        },
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
    },
  },

  computed: {
    isAdmin() {
      return this.nameId === "2" || this.nameId === "76";
    },
    availableNames() {
      if (this.isAdmin) {
        return this.names;
      } else {
        return this.names.filter(
          (name) => name.name_id === parseInt(this.nameId)
        );
      }
    },
  },

  created() {
    this.initializeForm();
  },

  methods: {
    hasReleasedRemark(docName) {
     const existingDoc = this.requestData.documents.find(d => 
       (typeof d === 'object' && d.name === docName)
     );
     return existingDoc && existingDoc.remarks === "Released";
   },
    initializeForm() {
      this.form.name_id = this.requestData.name_id;
      this.form.date = this.requestData.date;

      this.fetchSelectedEmployee();

      if (this.requestData.documents && this.requestData.documents.length > 0) {
        // Convert documents to a consistent format for easier comparison
        const requestedDocs = this.requestData.documents.map((doc) =>
          typeof doc === "object" ? doc.name : doc
        );

        // Find standard document types
        const standardDocNames = this.documentOptions
          .filter((option) => option.name !== "OTHERS")
          .map((option) => option.name);

        // Check each document option
        this.documentOptions.forEach((docOption) => {
          if (docOption.name === "OTHERS") {
            // Find any document that doesn't match standard options
            const otherDocs = requestedDocs.filter(
              (requestedDoc) => !standardDocNames.includes(requestedDoc.trim())
            );

            if (otherDocs.length > 0) {
              docOption.checked = true;
              // Use the first non-standard document as the "OTHERS" text
              this.otherDocumentText = otherDocs[0];
            }
          } else {
            // For standard options, check if they exist in the requested docs
            docOption.checked = requestedDocs.some(
              (requestedDoc) => requestedDoc.trim() === docOption.name.trim()
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
        const othersDocument = this.documentOptions.find(
          (doc) => doc.name === "OTHERS"
        );
        if (othersDocument && othersDocument.checked) {
          const otherDocumentName = this.otherDocumentText.toUpperCase();

          this.form.documents = this.documentOptions
            .filter((doc) => doc.checked)
            .map((doc) =>
              doc.name === "OTHERS" ? otherDocumentName : doc.name
            );
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
        alert(
          "Please fill all required fields and select at least one document."
        );
        return;
      }

      const formattedDocuments = this.form.documents.map((docName) => {
        const existingDoc = this.requestData.documents.find(
          (d) => (typeof d === "object" && d.name === docName) || d === docName
        );

        if (
          existingDoc &&
          typeof existingDoc === "object" &&
          existingDoc.remarks
        ) {
          return {
            name: docName,
            remarks: existingDoc.remarks,
          };
        } else {
          return {
            name: docName,
            remarks: "No Remarks",
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
          documents: formattedDocuments,
        };

        const response = await axios.post(
          `${API_BASE_URL}/FADRFupdate_request/${this.requestId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // And then update your response handling
        if (response.status < 200 || response.status >= 300) {
          throw new Error("Failed to update request");
        }

        // Emit success event with updated data
        this.$emit("update-success", response.data);
      } catch (error) {
        console.error("Error updating request:", error);
        alert("Failed to update the request. Please try again.");
        // Emit failure event
        this.$emit("update-error", error);
      } finally {
        // Reset states after submission
        this.pleaseWait = false;
        this.loading = false;
        this.formDisable = false;
      }
    },
  },
};
</script>

<style src="./CSS/editrequest.css" scoped></style>
