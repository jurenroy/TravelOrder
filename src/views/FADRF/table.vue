<template>
  <div style="display: flex; flex-direction: column">
    <h2
      style="display: flex; flex-direction: row; align-self: center"
      class="hist"
    >
      Documents Status
      <select v-model="selectedStatus" id="status" class="styled-select">
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <span v-if="pendingCount !== 0" class="notification-count">{{
        pendingCount
      }}</span>
    </h2>
    <div v-if="load" class="loadings">
      <img src="../../assets/loading.gif" width="auto" height="100px" />
    </div>
    <div
      style="display: flex; flex-direction: column; align-items: center"
      v-if="otp"
    >
      <otpz />
    </div>


    <div  class="search-box" >
      <input 
        class="pholder" 
        type="text"
        name="text" 
        v-model="searchQuery" 
        placeholder="Search Name or Documents..." 
        />
        <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
    <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z" fill-rule="evenodd"></path>
</svg>         
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
              <th style="text-align: center">Requestor</th>
              <th style="text-align: center">Document Requested</th>
              <th style="text-align: center">Date & Time</th>
              <th style="text-align: center">Status</th>
              <th style="text-align: center">Rating</th>
              <th style="text-align: center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in processedFormData" :key="index">
              <td>{{ getName(item.name_id) }}</td>
              <td>
                <span
                  v-if="Array.isArray(item.documents) && item.documents.length"
                >
                  <span
                    v-for="(doc, docIndex) in item.documents"
                    :key="docIndex"
                  >
                    {{ getDocumentName(doc) }} <br />
                  </span>
                </span>
                <span v-else>No documents requested</span>
              </td>
              <td>{{ item.date }}</td>
              <td>
                <span
                  v-if="Array.isArray(item.documents) && item.documents.length"
                >
                  <span
                    v-if="allDocumentsReleased(item.documents)"
                    class="released-text"
                  >
                    All documents released
                  </span>
                  <span v-else>
                    <span
                      v-for="(doc, docIndex) in item.documents"
                      :key="'remarks-' + docIndex"
                      :class="getRemarks(doc)"
                    >
                      {{ doc.remarks || "No remarks" }} <br />
                    </span>
                  </span>
                </span>
                <span v-else>No remarks</span>
              </td>
              <td style="text-align: center">
                <span v-if="item.rating !== null">
                  <span v-for="n in item.rating" :key="n">⭐</span>
                </span>
                <button
                  v-else-if="nameId == item.name_id"
                  @click="openRatingPopup(item)"
                >
                  Rating
                </button>
                <span v-else>No ratings yet</span>
              </td>

              <td>
                <button
                  v-if="canEditRequest(item)"
                  @click="openEditRequestForm(item)"
                >
                  Edit
                </button>
                <button v-if="isAdmin" @click="openEditDetailsPopup(item)">
                  Remarks
                </button>
                <button @click="generatePDF(item, getName(item.name_id))">
                  View PDF
                </button>
                <button @click="add(item)">
                 {{ isAdmin ? "Add Note" : "View Note"}}
                </button>
              </td>
            </tr>
            <h1
              style="text-align: center; margin-bottom: 0px"
              v-if="processedFormData.length == 0"
            >
              NO MATCH FOUND
            </h1>
          </tbody>
        </table>
        <editform
          v-if="showEditRequestForm"
          :requestData="currentItem"
          :requestId="currentItem.id"
          :names="names"
          :employees="employees"
          :divisions="divisions"
          @close="closeEditRequestForm"
          @update-success="handleEditRequestSuccess"
          @update-error="handleEditRequestError"
        />
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
  <PDF
    :item="selectedItem"
    :name="selectedName"
    :signature="selectedSignature"
    :documents="documentList"
  />
</template>

<script>
import axios from "axios";
import editform from "./EditRequest.vue";
import PDF from "./PDF.vue";
import RatingPopup from "./Rating.vue";
import { API_BASE_URL } from "@/config";
import EditDetailsPopup from "./EditDetailsPopup.vue";
import Note from "./Note.vue";

export default {
  components: {
    name: "PDF",
    props: {
      item: {
        type: Object,
        required: true,
      },
      names: {
        type: Object,
        required: true,
      },
      divisions: {
        type: Array,
        required: true,
      },
      logoPath: {
        type: String,
        default: "",
      },
      debugMode: {
        type: Boolean,
        default: false,
      },
    },
    RatingPopup,
    editform,
    EditDetailsPopup,
    Note,
    PDF,
    editform,
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
  },

  data() {
    return {
      showEditDetailsPopup: false,
      showEditRequestForm: false,
      divisions: [],
      showRatingPopup: false,
      othersDocName: null,
      processedDocs: [],
      showEditDetailsPopup: false,
      currentItem: "",
      selectedStatus: "All",
      options: ["All", "Pending", "Released", "No Remarks"],
      yearToday: new Date().getFullYear(),
      formData: [],
      names: {},
      employees: {},
      accountId: localStorage.getItem("accountId"),
      acc: [],
      load: true,
      mawala: false,
      addNote: false,
      viewNote: false,
      noteText: "",
      searchQuery: "",
      documents: [],
      name: "PDF",
      props: ["data"],
      parsedDocuments: [],
      selectedDocuments: [],
      timeReleased: "",
      dateTimeReleased: "",
      rating: null,
      nameId: localStorage.getItem("nameId"),
      selectedName: "",
      selectedSignature: "",
      selectedItem: [],

      documentList: [
        "PURCHASE REQUEST - REQUISITION AND ISSUE SLIP",
        "CERTIFICATE OF EMPLOYMENT WITH COMPENSATION",
        "INVENTORY CUSTODIAN SLIP",
        "PROPERTY ACKNOWLEDGEMENT RECEIPT",
        "GATE PASS",
        "PO FUEL",
        "PROPERTY RETURN SLIP",
        "R&M OF MOTOR VEHICLES",
        "JOB ORDER FOR FURNITURE & FIXTURES, LIGHTINGS, PLUMBING, & A/C",
        "Others",
      ],

      created() {
        this.parseRequestedDocuments();
      },

      props: {
        data: {
          type: Object,
          required: true,
        },
      },
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
    this.loadAccounts();
  },

  methods: {
    // In your script section
    data() {
      return {
        othersDocName: null, // Add this to your data
      };
    },
    methods: {
      otherDocumentText() {
        console.log("Initial item:", item);
        console.log("Processed Docs:", processedDocs);

        // First check if otherDocuments is directly available
        if (item.otherDocuments) {
          console.log("Found otherDocuments:", item.otherDocuments);
          return item.otherDocuments;
        }

        // Then check if otherDocumentText is available from the form
        if (item.otherDocumentText) {
          console.log("Found otherDocumentText:", item.otherDocumentText);
          return item.otherDocumentText;
        }

        // Check in the documents array for an "Others" entry with custom name
        const othersDoc = processedDocs.find((doc) => {
          if (typeof doc === "object") {
            // Check if this is the others document (could be renamed from "Others")
            const isOthersDoc =
              doc.originalName === "OTHERS" ||
              doc.name.includes("Others:") ||
              doc.name === "Others";
            console.log("Checking doc:", doc, "isOthersDoc:", isOthersDoc);
            return isOthersDoc;
          }
          const isOthersDoc = doc === "Others" || doc.includes("Others:");
          console.log("Checking string doc:", doc, "isOthersDoc:", isOthersDoc);
          return isOthersDoc;
        });

        // Store the name in the data property
        this.othersDocName = othersDoc ? othersDoc.name : null;

        console.log("Found othersDoc:", othersDoc);

        return othersDoc || null;
      },
    },
    focusTextarea(text) {
      this.noteText = text;
      this.$refs.noteInput.focus();
    },

    getTimeRequested(dateString) {
      try {
        const dateObj = new Date(dateString);
        if (!isNaN(dateObj.getTime())) {
          // Format time as HH:MM AM/PM
          return dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      } catch (e) {
        console.error("Error parsing date:", e);
      }
      return "N/A"; // Return N/A if there's an error
    },
    findDivisionName(division_Id) {
      if (this.divisions && this.divisions.length > 0) {
        const division = this.divisions.find(
          (div) => div.division_id === division_Id
        );
        return division?.division_name || "UNKNOWN";
      }
      return "UNKNOWN";
    },

    fetchDivisions() {
      axios
        .get(`${API_BASE_URL}/get_divisions_json`) // Adjust the endpoint as necessary
        .then((response) => {
          this.divisions = response.data; // Store the fetched divisions
        })
        .catch((error) => {
          console.error("Error fetching divisions:", error);
        });
    },
    async loadAccounts() {
      try {
        // Replace with your actual API call
        const response = await fetch(`${API_BASE_URL}/get_accounts_json`);
        const data = await response.json();
        this.accounts = data;
        console.log("Accounts loaded successfully:", this.accounts);
        return this.accounts;
      } catch (error) {
        console.error("Error loading accounts:", error);
        this.accounts = [];
        return [];
      }
    },
    async fetchAccounts() {
      try {
        const response = await axios.get(`${API_BASE_URL}/get_accounts_json`);

        this.accounts = response.data;
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    },

    async fetchNames() {
      try {
        const response = await axios.get(`${API_BASE_URL}/get_names_json`);
        this.names = response.data;
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    },

    parseRequestedDocuments() {
      // Make sure documents is an array
      const requestedDocs = Array.isArray(this.item.documents)
        ? this.item.documents
        : JSON.parse(this.item.documents || "[]");

      // Check each document in our list against the requested documents
      this.parsedDocuments = this.documentList.map((docName) => {
        return {
          name: docName,
          isChecked: requestedDocs.includes(docName),
        };
      });

      console.log("Parsed Documents:", this.parsedDocuments);
      return this.parsedDocuments;
    },

    isDocumentRequested(documentName) {
      // Parse documents if not already parsed
      if (this.parsedDocuments.length === 0) {
        this.parseRequestedDocuments();
      }

      // Find the document and return whether it's checked
      const doc = this.parsedDocuments.find((d) => d.name === documentName);
      return doc ? doc.isChecked : false;
    },

    isOthersDoc(doc) {
      // Check in the documents array for an "Others" entry with custom name
      const othersDoc = this.processedDocs.find((d) => {
        if (typeof d === "object") {
          const isOthersDoc =
            d.originalName === "OTHERS" ||
            d.name.includes("Others:") ||
            d.name === "Others";
          console.log("Checking doc:", d, "isOthersDoc:", isOthersDoc);
          return isOthersDoc;
        }
        const isOthersDoc = d === "Others" || d.includes("Others:");
        console.log("Checking string doc:", d, "isOthersDoc:", isOthersDoc);
        return isOthersDoc;
      });

      console.log("Found othersDoc:", othersDoc);

      if (othersDoc) {
        if (typeof othersDoc === "object") {
          if (
            othersDoc.name !== "Others" &&
            !othersDoc.name.includes("Others:")
          ) {
            console.log("Returning custom name:", othersDoc.name);
            return othersDoc.name;
          }
          if (othersDoc.additionalText) {
            console.log("Returning additionalText:", othersDoc.additionalText);
            return othersDoc.additionalText;
          }
        } else if (
          typeof othersDoc === "string" &&
          othersDoc.includes("Others:")
        ) {
          const match = othersDoc.match(/Others:\s*(.+)$/);
          if (match && match[1]) {
            const extractedText = match[1].trim();
            console.log("Returning extracted text:", extractedText);
            return extractedText;
          }
        }
      }

      console.log("No other document text found, returning empty string");
      return "";
    },

    // Add this method to your component
    async getSignatureByNameId(nameId) {
      console.log("getSignatureByNameId called with nameId:", nameId);

      // If accounts aren't loaded yet, load them now
      if (!this.accounts || !Array.isArray(this.accounts)) {
        console.log("Accounts not loaded, fetching now...");
        await this.fetchAccounts();
      }

      console.log("Accounts after potential fetch:", this.accounts);

      if (!this.accounts || !Array.isArray(this.accounts)) {
        console.log("Still no accounts available");
        return "___________________";
      }

      const account = this.accounts.find(
        (acc) => acc.name_id === parseInt(nameId)
      );
      console.log("Found account:", account);

      if (account && account.signature) {
        console.log("Found signature:", account.signature);
        return `<img src="${account.signature}" alt="Signature" style="height: 40px; max-width: 150px; display: inline-block;">`;
      } else {
        console.log("No signature found for nameId:", nameId);
        return "___________________";
      }
    },

    getSignatureByNameId(nameId) {
      console.log("getSignatureByNameId called with nameId:", nameId);
      console.log("this.accounts:", this.accounts);

      if (!this.accounts || !Array.isArray(this.accounts)) {
        console.log("No accounts available or accounts is not an array");
        return "___________________";
      }

      const account = this.accounts.find((acc) => {
        console.log(
          "Checking account:",
          acc,
          "against nameId:",
          parseInt(nameId)
        );
        return acc.id === parseInt(nameId);
      });

      console.log("Found account:", account);

      if (account && account.signature) {
        console.log("Found signature:", account.signature);
        return `<img src="${account.signature}" alt="Signature" style="height: 40px; max-width: 150px; display: inline-block;">`;
      } else {
        console.log("No signature found, using default line");
        return "___________________";
      }
    },
    generatePDF(item, name) {
      this.selectedItem = item;
      this.selectedName = name;
      this.selectedSignature =
        "http://202.137.117.84:8011/storage/" +
        this.accounts.filter((acc) => acc.name_id === item.name_id)[0]
          .signature;
      console.log(this.selectedSignature);

      // Set a delay of 0.5 seconds (500 milliseconds) before calling printzz
      setTimeout(() => {
        this.printzz();
      }, 500);
    },

    findDivisionName(division_Id) {
      if (this.divisions && this.divisions.length > 0) {
        const division = this.divisions.find(
          (div) => div.division_id === division_Id
        );
        return division?.division_name || "UNKNOWN";
      }
      return "UNKNOWN";
    },

    padWithZeroes(travel_order_id) {
      if (travel_order_id === undefined || travel_order_id === null) {
        console.warn("travel_order_id is undefined or null");
        return ""; // or return a default value, e.g., '0000'
      }
      const idString = travel_order_id.toString();
      return idString.padStart(4, "0");
    },
    fetchDocuments() {
      axios
        .get(`${API_BASE_URL}/get_request`)
        .then((response) => {
          this.documents = response.data;
        })
        .catch((error) => {
          console.error("Error fetching documents:", error);
        });
    },
    openEditRequestForm(item) {
      this.currentItem = item;
      this.showEditRequestForm = true;
    },
    canEditRequest(item) {
      const userId = Number(this.nameId);
      const requestorId = Number(item.name_id);

      return (
        userId === requestorId && !this.allDocumentsReleased(item.documents)
      );
    },
    closeEditRequestForm() {
      this.showEditRequestForm = false;
    },

    handleEditRequestSuccess(updatedRequest) {
      let documentsArray = [];

      if (updatedRequest.documents) {
        if (Array.isArray(updatedRequest.documents)) {
          documentsArray = updatedRequest.documents;
        } else if (typeof updatedRequest.documents === "string") {
          try {
            documentsArray = JSON.parse(updatedRequest.documents);
          } catch (e) {
            console.error("Error parsing documents JSON:", e);
          }
        }
      }
      this.formData = this.formData.map((item) => {
        if (item.id === updatedRequest.id) {
          return {
            ...item,
            ...updatedRequest,
            documents: documentsArray.map((doc) => ({
              name: doc.name || doc,
              remarks: doc.remarks?.trim() ? doc.remarks : "No Remarks",
            })),
          };
        }
        return item;
      });

      this.showEditRequestForm = false;
      alert("Request updated successfully!");
    },

    handleEditRequestError(error) {
      console.error("Error updating request:", error);
      alert("Failed to update request. Please try again.");
    },
    fetchDivisions() {
      axios
        .get(`${API_BASE_URL}/get_divisions_json`)
        .then((response) => {
          this.divisions = response.data;
        })
        .catch((error) => {
          console.error("Error fetching divisions:", error);
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

      axios
        .post(`${API_BASE_URL}/FADRFupdate_request/${this.currentItem.id}`, {
          note: updatedNote,
        })
        .then(() => {
          this.currentItem.note = updatedNote;
          alert("Note saved successfully!");
        })
        .catch((error) => {
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
      formData.append("note", note);
      axios
        .post(`${API_BASE_URL}/FADRFupdate_form/${this.notenum}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          this.fetchData();
          this.closeNote();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    getDocumentName(doc) {
      if (!doc) return "No document";
      return typeof doc === "object" ? doc.name || "Unknown" : doc;
    },

    getReleasedStatus(doc) {
      return doc.remarks?.trim() === "Released" ? "Released" : "Unreleased";
    },
    getRemarks(doc){
      if (doc.remarks === 'No Remarks') return 'no-remarks-text';
      if (doc.remarks === 'Released') return 'releasedeg-text';
      if (doc.remarks === 'Pending') return 'incomplete-text';
      return '';
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
          path: "/pdf",
          name: "PDF",
          component: PDF,
          props: true, // This allows you to pass props to the PDF component
        },
      ];

      const processedDocuments = updatedDocuments.map((doc) => {
        // Create a new object to avoid modifying the original
        const updatedDoc = { ...doc };

        // If a document is marked as released but doesn't have a releaseDate, add current timestamp
        if (
          updatedDoc.remarks &&
          updatedDoc.remarks.trim() === "Released" &&
          !updatedDoc.releaseDate
        ) {
          updatedDoc.releaseDate = new Date().toISOString();
          console.log("yawa");
        }

        return updatedDoc;
      });
      const payload = {
        documents: processedDocuments,
        remarks: updatedDocuments.map((doc) => doc.remarks).join(", "), // Join remarks for storage
      };
      // const formeme = new FormData();
      // formeme.append('documents', JSON.stringify(processedDocuments)); // Append as JSON string
      const formeme = {
        documents: processedDocuments,
      };

      // Log the processedDocuments
      console.log(processedDocuments);
      console.log(payload);

      // Log the contents of the FormData
      console.log(formeme);

      axios
        .post(
          `${API_BASE_URL}/FADRFupdate_request/${this.currentItem.id}`,
          formeme
        )
        .then((response) => {
          if (response.status === 200) {
            alert("Documents updated successfullyxxxx!");
            console.log("gana man lage", formeme);
            this.currentItem.documents = processedDocuments;

            // Update the form data to reflect changes in the UI
            this.formData = this.formData.map((item) => {
              if (item.id === this.currentItem.id) {
                return { ...item, documents: processedDocuments };
              }
              return item;
            });
          }
        })
        .catch((error) => {
          console.error("Error updating documents:", error);
          alert("Failed to update documents. Please try again.");
        });

      (`${API_BASE_URL}/FADRFupdate_request/${this.currentItem.id}`, payload)
        .then((response) => {
          if (response.status === 200) {
            alert("Remarks updated successfullyzzzz!");
            this.currentItem.documents = updatedDocuments;
          }
        })
        .catch((error) => {
          console.error("Error updating documents:", error);
          alert("Failed to update documents. Please try again.");
        });
    },

    handleRating(rating) {
      if (!this.currentItem || !this.currentItem.id) {
        alert("No Request Selected");
        return;
      }
      const userId = Number(this.nameId);
      const requestorId = Number(this.currentItem.name_id);
      if ((userId === 30 || userId === 76) && userId !== requestorId) {
        alert("You are not allowed to rate this request.");
        return;
      }
      const payload = { rating: rating };
      axios
        .post(
          `${API_BASE_URL}/FADRFupdate_request/${this.currentItem.id}`,
          payload
        )
        .then((response) => {
          if (response.status === 200) {
            alert("Rating submitted successfully!");
            this.currentItem.rating = rating;
          }
        })
        .catch((error) => {
          console.error("Error submitting rating:", error);
          alert("Failed to submit rating. Please try again.");
        })
        .finally(() => {
          this.showRatingPopup = false;
        });
    },
    allDocumentsReleased(documents) {
      if (!documents || documents.length === 0) {
        return false;
      }
      return documents.every((doc) => doc.remarks === "Released");
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
      formData.append("note", note);

      axios
        .post(
          `${API_BASE_URL}/FADRFupdate_request/${this.currentItem.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            alert("Note added successfully!");

            // Update the frontend state
            this.formData = this.formData.map((item) =>
              item.id === this.currentItem.id ? { ...item, note } : item
            );

            this.closeNote();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to submit note. Please try again.");
        });
    },
    fetchAccounts() {
      axios
        .get(`${API_BASE_URL}/get_accounts_json`)
        .then((response) => {
          this.acc = response.data.find(
            (result) => result.account_id == this.accountId
          );
          this.fetchData();
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    fetchData() {
      axios
        .get(`${API_BASE_URL}/FADRFget_request`)
        .then((response) => {
          this.mawala = true;
          this.load = false;
          this.formData = response.data.map((item) => {
            let documents = [];

            try {
              documents = item.documents ? JSON.parse(item.documents) : [];
            } catch (error) {
              console.error("Error parsing documents JSON:", error);
            }

            return {
              ...item,
              documents: documents.map((doc) => ({
                name: doc.name || doc,
                remarks: doc.remarks?.trim() ? doc.remarks : "No Remarks",
                releaseDate: doc.releaseDate ? doc.releaseDate : "",
              })),
              rating: item.rating || null,
            };
          });

          this.formData = this.formData.filter((item) => {
            return (
              this.nameId === "30" ||
              this.nameId === "76" ||
              item.name_id == this.nameId
            );
          });

          console.log("Processed FormData:", this.formData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.load = false;
        });
    },
    fetchNames() {
      axios
        .get(`${API_BASE_URL}/get_names_json`)
        .then((response) => {
          this.names = response.data;
        })
        .catch((error) => {
          console.error("Error fetching names:", error);
        });
    },
    fetchEmployees() {
      axios
        .get(`${API_BASE_URL}/get_employees_json`)
        .then((response) => {
          this.employees = response.data;
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
        });
    },
    getName(nameId) {
      const name = this.names[nameId - 1];
      if (name) {
        const { first_name, middle_init, last_name } = name;
        return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
      }
      return "Unknown";
    },
    padWithZeroes(travel_order_id) {
      if (travel_order_id === undefined || travel_order_id === null) {
        console.warn("padWithZeroes received an undefined or null value");
        return "0000"; // or some default value, depending on your requirements
      }

      const idString = travel_order_id.toString();
      return idString.padStart(4, "0");
    },
    fetchDocuments() {
      axios
        .get(`${API_BASE_URL}/FADRFget_request`)
        .then((response) => {
          this.documents = response.data;
        })
        .catch((error) => {
          console.error("Error fetching documents:", error);
        });
    },
  },
  computed: {
    pendingCount() {
      return this.formData.filter(
        (form) => form.note === null && form.initial !== null
      ).length;
    },
    filteredFormData() {
      return this.formData; // This can be used in the template for rendering
    },
    isAdmin() {
      return this.nameId === "30" || this.nameId === "76"; // Check if the user is an admin
    },

    processedFormData() {
      return this.formData
        .filter((item) => {
          const requestorName = this.getName(item.name_id).toLowerCase();
          const documentNames = item.documents
            .map((doc) => (doc.name ? doc.name.toLowerCase() : ""))
            .join(" ");

          const query = this.searchQuery.toLowerCase();

          const matchesSearch =
            requestorName.includes(query) || documentNames.includes(query);

          if (!matchesSearch) return false;

          if (this.selectedStatus !== "All") {
            return item.documents.some(
              (doc) =>
                doc.remarks.trim().toLowerCase() ===
                this.selectedStatus.toLowerCase()
            );
          }

          return true;
        })
        .slice()
        .reverse();
    },
  },
};
window.onload = function () {
  var img = new Image();
  img.src = "src/assets/bago.png";
  img.src = "src/assets/logo.png";
  img.src = `http://202.137.117.84:8011/storage/VeNHQjkJ3QJIvccRXCrQlSglM4MQqlB706xHXDte.png`;
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
  border-radius: 5px;
  border: none;
  outline: none;
}
.search-box svg {
    position: relative; 
    top: 100%; 
    left: 15px; 
    transform: translateY(-100%); 
    cursor: pointer; 
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
  transition-duration: 0.3s;
  border: 2px solid black;
  margin-bottom: 2px;
  background-color: white;
}
.sign {
  width: 100%;
  transition-duration: 0.3s;
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
  transition-duration: 0.3s;
}

.Btn:hover {
  background-color: white;
  width: 230px;
  border: 2px solid black;
  border-radius: 5px;
  transition-duration: 0.3s;
  position: relative;
}

.Btn:hover .text {
  opacity: 1;
  width: 70%;
  transition-duration: 0.3s;
  padding-right: 10px;
}

.Btn:hover .sign {
  width: 30%;
  transition-duration: 0.3s;
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
  background: #bfa16dd7;
 
  color: black;
  font-weight: bold;
  font-size: 12px;
  border: solid black 2px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.3s;
  margin: 0 5px;
  height: fit-content;
  justify-content: center;
  font-family: "Segoe UI", sans-serif;
  border-radius: 5px;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);


}

button:hover {
  background: #bfa16d;
  animation: button-particles 1s ease-in-out infinite;
  transform: translateY(-2px);;
}
button:active  {
  transform: scale(0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
.released-text {
  font-weight: bold;
  font-size: 18px;
  color: red;
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
.released-text {
  font-weight: bold;
  font-size: 18px;
  color: green;
}
.releasedeg-text{
  font-weight: bold;
  font-size: 18px;
  color: blue;
}
.no-remarks-text {
  font-weight: bold;
  font-size: 18px;
  color: red;
}
.incomplete-text {
  font-weight: bold;
  font-size: 18px;
  color: orange;
}
.styled-select:focus {
  border-color: #007bff;
  outline: none;
}

.styled-select option {
  padding: 10px;
  font-weight: bold;
}





.pholder {
  display: block;
  width: 245px;
  height: 50px;
  padding: 0 48px 0 30px;
  font-size: 14px;
  color: #000;
  background-color: #fff;
  border: 1px solid #59473d;
  border-radius: 8px;
  outline: none;
  appearance: none;
  transition: all .2s ease-in-out;
  outline: none;
  opacity: 0.8;
}

.pholder:focus {
  border-color: transparent;
  outline: 2px solid #000;
  box-shadow: none;
  opacity: 1;
  width: 280px;
}

.pholder:hover {
  border-color: #59473d;
}

.imgsearch {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  height: 20px;
  width: 22px;
  z-index: 10;
}

/* Add this for the floating label effect */
.search-box::before {
  
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  font-size: 14px;
  color: #888;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.pholder:focus + .search-box::before,
.pholder:not(:placeholder-shown) + .search-box::before {
  top: 0;
  transform: translateY(-50%) scale(0.75);
  background-color: white;
  padding: 0 4px;
  z-index: 10;
  
}


@media screen and (max-width: 768px) {
  .Btn {
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
  .prent .buttons {
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
  .note,
  .sign,
  .Btn,
  .dropdown {
    display: none !important;
  }
    .search-box { /* Add this line */
    display: none !important; /* Hide search box during print */
  }
  .buttons {
    display: none !important;
  }
}
</style>
