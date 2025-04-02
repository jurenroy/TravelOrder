<template>
  <div style="display: flex; flex-direction: column">
    <div v-if="!isPrinting" class="dropdown-container">
      <div class="dropdown-docstat">
        <h2 style="display: flex; flex-direction: row; align-self: center" class="hist">

          <select v-model="selectedStatus" id="status" class="styled-select">
            <option v-for="option in options" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <!-- <span v-if="pendingCount !== 0" class="notification-count">{{
        pendingCount
      }}</span> -->
        </h2>
        <div class="dropdown-categ">
          <h2 style="display: flex; flex-direction: row; align-self: center" class="hist">

            <select v-model="selectedCategory" id="status" class="styled-select">
              <option v-for="option in category" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </h2>

          <div class="dropdown-limits">
            <h2 style="display: flex; flex-direction: row; align-self: center" class="hist">
              <select v-model="fetchLimit" @change="fetchData" class="styled-select">
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
                <option :value="200">200</option>
                <option :value="500">500</option>
                <option :value="1000">1000</option>
                <option :value="15000">5000</option>
                <option :value="10000">10000</option>
              </select>
            </h2>

          </div>
        </div>
      </div>
    </div>



    <div class="search-box">
      <input class="pholder" type="text" name="text" v-model="searchQuery" placeholder="Search Name or Documents..." />
      <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
          fill-rule="evenodd"></path>
      </svg>
    </div>
    <div v-if="showNotification" class="notification">
      {{ notificationMessage }}
    </div>


    <div v-if="load" class="loadings">
      <img src="../../assets/sample_loaders.gif" width="auto" height="480px" />
    </div>
    <div style="display: flex; flex-direction: column; align-items: center" v-if="otp">
      <otpz />
    </div>

    <div v-if="mawala" class="outer">
      <div v-if="showRatingPopup">
        <RatingPopup @submit="handleRating" @close="showRatingPopup = false" />
      </div>

      <EditDetailsPopup v-if="showEditDetailsPopup" :documents="currentItem.documents" @submit="handleEditDetails"
        @close="showEditDetailsPopup = false" />

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
                <span v-if="Array.isArray(item.documents) && item.documents.length">
                  <span v-for="(doc, docIndex) in item.documents" :key="docIndex">
                    {{ getDocumentName(doc) }} <br />
                  </span>
                </span>
                <span v-else>No documents requested</span>
              </td>
              <td>{{ item.date }}</td>
              <td>
                <span v-if="Array.isArray(item.documents) && item.documents.length">
                  <span v-if="allDocumentsReleased(item.documents)" class="released-text">
                    All documents released
                  </span>
                  <span v-else>
                    <span v-for="(doc, docIndex) in item.documents" :key="'remarks-' + docIndex"
                      :class="getRemarksszzz(doc)">
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
                <button v-else-if="nameId == item.name_id" @click="openRatingPopup(item)">
                  Rating
                </button>
                <span v-else class="norating">No ratings yet</span>
              </td>
              <td>
                <button v-if="canEditRequest(item)" @click="openEditRequestForm(item)">
                  EDIT
                </button>
                <button v-if="isAdmin" @click="openEditDetailsPopup(item)">
                  REMARKS
                </button>
                <button @click="generatePDF(item, getName(item.name_id))">
                  VIEW PDF
                </button>
                <button @click="add(item)">
                  {{ isAdmin ? "ADD NOTE" : "VIEW NOTE" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <h1 style="text-align: center; margin-bottom: 0px" v-if="processedFormData.length == 0">
          NO MATCH FOUND
        </h1>

        <editform v-if="showEditRequestForm" :requestData="currentItem" :requestId="currentItem.id" :names="names"
          :employees="employees" :divisions="divisions" @close="closeEditRequestForm"
          @update-success="handleEditRequestSuccess" @update-error="handleEditRequestError" />

        <Note v-if="addNote" :initialNote="currentItem.note || ''" :isAdmin="isAdmin" @close-note="closeNote"
          @save-note="saveNote" />
      </div>
    </div>
  </div>

  <PDF :item="selectedItem" :name="selectedName" :signature="selectedSignature" :documents="documentList" />
</template>

  <script>
  import axios from "axios";
  import editform from "./EditRequest.vue";
  import PDF from "./PDF.vue";
  import RatingPopup from "./rating.vue";
  import { API_BASE_URL } from "@/config";
  import EditDetailsPopup from "./remarks.vue";
  import Note from "./Note.vue";

  export default {
    name: "DocumentRequestManager",

    components: {
      PDF,
      RatingPopup,
      editform,
      EditDetailsPopup,
      Note,
    },

    props: {
      data: {
        type: Object,
        required: true,
      },
      item: {
        type: Object,
        required: false,
      },
      names: {
        type: Object,
        required: false,
      },
      divisions: {
        type: Array,
        required: false,
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

    data() {
      return {
        showEditDetailsPopup: false,
        showEditRequestForm: false,
        divisions: [],
        showRatingPopup: false,
        othersDocName: null,
        processedDocs: [],
        currentItem: "",
        selectedStatus: "All",
        options: ["All", "Pending", "Released", "No Remarks"],
        selectedCategory: "All",
        category: [
          "All",
          "SERVICE RECORD",
          "CERTIFICATE OF EMPLOYMENT",
          "CERTIFICATE OF EMPLOYMENT WITH COMPENSATION",
          "OFFICE CLEARANCE",
          "LBP BC LIST",
          "CERTIFICATE OF LEAVE CREDITS",
          "PHOTOCOPY OF TRAVEL ORDER",
          "OTHERS",
        ],
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
        parsedDocuments: [],
        selectedDocuments: [],
        timeReleased: "",
        dateTimeReleased: "",
        rating: null,
        nameId: localStorage.getItem("nameId"),
        selectedName: "",
        selectedSignature: "",
        selectedItem: [],
        accounts: [],
        showNotification: false,
        notificationMessage: "",
        documentList: [
          "SERVICE RECORD",
          "CERTIFICATE OF EMPLOYMENT",
          "CERTIFICATE OF EMPLOYMENT WITH COMPENSATION",
          "OFFICE CLEARANCE",
          "LBP BC LIST",
          "CERTIFICATE OF LEAVE CREDITS",
          "PHOTOCOPY OF TRAVEL ORDER",
          "OTHERS",
        ],
        fetchLimit: 10, // Default limit
        currentPage: 1, // If you want pagination support
      };
    },

    created() {
      if (this.item) {
        this.parseRequestedDocuments();
      }
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

    computed: {
      pendingCount() {
        return this.formData.filter(
          (form) => form.note === null && form.initial !== null
        ).length;
      },

      filteredFormData() {
        return this.formData;
      },

      isAdmin() {
        return this.nameId === "2" || this.nameId === "76";
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

            const statusMatches =
              this.selectedStatus === "All" ||
              item.documents.some(
                (doc) =>
                  doc.remarks.trim().toLowerCase() ===
                  this.selectedStatus.toLowerCase()
              );

            if (!statusMatches) return false;

            const categoryMatches =
              this.selectedCategory === "All" ||
              item.documents.some((doc) => {
                if (this.selectedCategory === "OTHERS") {
                  return (
                    doc.name &&
                    !this.documentList.includes(doc.name.trim().toUpperCase())
                  );
                }
                return (
                  doc.name &&
                  doc.name.trim().toLowerCase() === this.selectedCategory.toLowerCase()
                );
              });

            if (!categoryMatches) return false;

            return true;
          })
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, this.fetchLimit);
      },
    },

    methods: {
      otherDocumentText() {
        console.log("Initial item:", this.item);
        console.log("Processed Docs:", this.processedDocs);

        if (this.item.otherDocuments) {
          console.log("Found otherDocuments:", this.item.otherDocuments);
          return this.item.otherDocuments;
        }

        if (this.item.otherDocumentText) {
          console.log("Found otherDocumentText:", this.item.otherDocumentText);
          return this.item.otherDocumentText;
        }

        const othersDoc = this.processedDocs.find((doc) => {
          if (typeof doc === "object") {
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

        this.othersDocName = othersDoc ? othersDoc.name : null;
        console.log("Found othersDoc:", othersDoc);
        return othersDoc || null;
      },

      parseRequestedDocuments() {
        const requestedDocs = Array.isArray(this.item.documents)
          ? this.item.documents
          : JSON.parse(this.item.documents || "[]");

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
        if (this.parsedDocuments.length === 0) {
          this.parseRequestedDocuments();
        }

        const doc = this.parsedDocuments.find((d) => d.name === documentName);
        return doc ? doc.isChecked : false;
      },

      isOthersDoc(doc) {
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
              return `OTHERS: ${othersDoc.name}`;
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
              return `OTHERS: ${extractedText}`;
            }
          }
        }

        console.log("No other document text found, returning empty string");
        return "";
      },

      getDocumentName(doc) {
        if (!doc) return "No document";
        return typeof doc === "object" ? doc.name || "Unknown" : doc;
      },

      getReleasedStatus(doc) {
        return doc.remarks?.trim() === "Released" ? "Released" : "Unreleased";
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
        return "N/A";
      },

      async fetchAccounts() {
        try {
          const response = await axios.get(`${API_BASE_URL}/get_accounts_json`);
          this.accounts = response.data;
          this.acc = this.accounts.find(
            (result) => result.account_id == this.accountId
          );
          return this.accounts;
        } catch (error) {
          console.error("Error fetching accounts:", error);
          this.accounts = [];
          return [];
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

      fetchData() {
        axios
          .get(`${API_BASE_URL}/get_request`, {
            params: {
              limit: this.fetchLimit * 2,
              page: this.currentPage, // Optional: for pagination
              name_id: this.nameId,
            },
          })
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

            console.log("Processed FormData:", this.formData);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            this.load = false;
          });
      },
      changeLimit(newLimit) {
        this.fetchLimit = newLimit;
        this.fetchData(); // Reload data with new limit
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

      getName(nameId) {
        const name = this.names[nameId - 1];
        if (name) {
          const { first_name, middle_init, last_name } = name;
          return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
        }
        return "Unknown";
      },

      getSignatureByNameId(nameId) {
        console.log("getSignatureByNameId called with nameId:", nameId);

        if (!this.accounts || !Array.isArray(this.accounts)) {
          console.log("No accounts available or accounts is not an array");
          return "___________________";
        }

        const account = this.accounts.find((acc) => acc.id === parseInt(nameId));
        console.log("Found account:", account);

        if (account && account.signature) {
          console.log("Found signature:", account.signature);
          return `<img src="${account.signature}" alt="Signature" style="height: 40px; max-width: 150px; display: inline-block;">`;
        } else {
          console.log("No signature found, using default line");
          return "___________________";
        }
      },

      getRemarksszzz(doc) {
        if (doc.remarks === "No Remarks") return "no-remarks-text";
        if (doc.remarks === "Released") return "releasedeg-text";
        if (doc.remarks === "Pending") return "incomplete-text";
        return "";
      },

      allDocumentsReleased(documents) {
        if (!documents || documents.length === 0) {
          return false;
        }
        return documents.every((doc) => doc.remarks === "Released");
      },

      canEditRequest(item) {
        const userId = Number(this.nameId);
        const requestorId = Number(item.name_id);

        return (
          userId === requestorId && !this.allDocumentsReleased(item.documents)
        );
      },

      openEditRequestForm(item) {
        this.currentItem = item;
        this.showEditRequestForm = true;
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
        this.showNotification = true;
        this.notificationMessage = "Documents Updated Successfully!";
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      },

      handleEditRequestError(error) {
        console.error("Error updating request:", error);
        this.showNotification = true;
        this.notificationMessage = "Failed to add Note. Please try again.";

        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
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

        const processedDocuments = updatedDocuments.map((doc) => {
          const updatedDoc = { ...doc };

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

        const formeme = {
          documents: processedDocuments.map(doc => doc.name),  // Only store names in documents
          remarks: processedDocuments.map(doc => doc.remarks).join(', ')

        };

        console.log(processedDocuments);
        console.log(formeme);

        axios
          .post(`${API_BASE_URL}/update_request/${this.currentItem.id}`, formeme)
          .then((response) => {
            if (response.status === 200) {
              this.showNotification = true;
              this.notificationMessage = "Remarks Updated";
              setTimeout(() => {
                this.showNotification = false;
              }, 3000);
              console.log("gana man lage", formeme);
              this.currentItem.documents = processedDocuments;

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
            this.showNotification = true;
            this.notificationMessage = "Failed to add Remarks. Please try again.";

            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
          });
      },

      openRatingPopup(item) {
        this.currentItem = item;
        this.showRatingPopup = true;
      },

      handleRating(rating) {
        if (!this.currentItem || !this.currentItem.id) {
          alert("No request selected.");
          return;
        }



        const payload = { rating: rating };

        axios
          .post(`${API_BASE_URL}/update_request/${this.currentItem.id}`, payload)
          .then((response) => {
            if (response.status === 200) {
              this.showNotification = true;
              this.notificationMessage = "Rating submitted successfully!";
              this.currentItem.rating = rating;

              setTimeout(() => {
                this.showNotification = false;
              }, 3000);
            }
          })
          .catch((error) => {
            console.error("Error submitting rating:", error);

            this.showNotification = true;
            this.notificationMessage =
              "Failed to submit rating. Please try again.";

            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
          })
          .finally(() => {
            this.showRatingPopup = false;
          });
      },

      add(item) {
        this.addNote = true;
        this.noteText = item.note || "";
        this.currentItem = item;
      },

      saveNote(updatedNote) {
        if (!this.isAdmin) {
          alert("You do not have permission to save notes.");
          return;
        }

        if (!this.currentItem || !this.currentItem.id) return;

        axios
          .post(`${API_BASE_URL}/update_request/${this.currentItem.id}`, {
            note: updatedNote,
          })
          .then(() => {
            this.currentItem.note = updatedNote;
            this.showNotification = true;
            this.notificationMessage = "Note Saved!";
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
          })
          .catch((error) => {
            console.error("Error updating note:", error);
            this.showNotification = true;
            this.notificationMessage = "Failed to add Note. Please try again.";

            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
          });
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
            `${API_BASE_URL}/update_request/${this.currentItem.id}`,
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

      focusTextarea(text) {
        this.noteText = text;
        this.$refs.noteInput.focus();
      },

      generatePDF(item, name) {
        this.selectedItem = item;
        this.selectedName = name;
        this.selectedSignature =
          "http://202.137.117.84:8011/storage/" +
          this.accounts.filter((acc) => acc.name_id === item.name_id)[0]
            .signature;
        console.log(this.selectedSignature);

        setTimeout(() => {
          this.printzz();
        }, 500);
      },

      printzz() {
        window.print();
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

<style src="./CSS/table.css" scoped></style>
