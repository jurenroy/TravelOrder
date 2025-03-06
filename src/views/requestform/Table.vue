<template>
  <div style="display: flex; flex-direction: column">
    <h2
      style="display: flex; flex-direction: row; align-self: center"
      class="hist"
    >
      Document Status:
      <select v-model="selectedStatus" class="styled-select">
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
    <div
      class="search"
      style="
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: end;
        margin-top: 15px;
        margin-bottom: 10px;
        height: 35px;
      "
    >
      <div
        v-if="mawala"
        style="
          display: flex;
          border: 2px solid black;
          border-radius: 5px;
          align-items: center;
          height: 30px;
          position: relative;
        "
      >
        <img
          class="imgsearch"
          style="
            height: 20px;
            width: 20px;
            position: relative;
            padding-left: 5px;
          "
          src="../../assets/search.png"
        />
        <input
          class="pholder"
          type="text"
          v-model="searchQuery"
          placeholder="Search Document Requested or Name"
        />
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
              <td style="text-align: center">{{ getName(item.name_id) }}</td>
              <td style="text-align: center">
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
              <td style="text-align: center">{{ item.date }}</td>
              <td style="text-align: center">
                <span
                  v-if="Array.isArray(item.documents) && item.documents.length"
                >
                  <span
                    v-for="(doc, docIndex) in item.documents"
                    :key="'remarks-' + docIndex"
                  >
                    {{ doc.remarks || "No remarks" }} <br />
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
              <td style="text-align: center">
                <button v-if="isAdmin" @click="openEditDetailsPopup(item)">
                  Edit
                </button>
                <button @click="generatePDF(item)">View PDF</button>
                <button @click="add(item)">View Note</button>
              </td>
            </tr>
            <tr v-if="processedFormData.length == 0">
              <td colspan="100%" style="text-align: center; padding: 20px">
                <h1 style="margin: 0">NO REQUEST FOUND</h1>
              </td>
            </tr>
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
import axios from "axios";
import editform from "./../editform.vue";
import RatingPopup from "./rating.vue";
import { API_BASE_URL } from "@/config";
import EditDetailsPopup from "./EditDetailsPopup.vue";
import Note from "./Note.vue";

export default {
  components: {
    RatingPopup,
    editform,
    EditDetailsPopup,
    Note,
  },

  data() {
    return {
      showRatingPopup: false,
      showEditDetailsPopup: false,
      currentItem: "",
      selectedStatus: "All",
      options: ["All", "Incomplete", "Released", "No Remarks"],
      yearToday: new Date().getFullYear(),
      formData: [],
      names: {},
      employees: {},
      accountId: localStorage.getItem("accountId"),
      load: true,
      mawala: false,
      addNote: false,
      viewNote: false,
      noteText: "",
      searchQuery: "",
      documents: [],
      nameId: localStorage.getItem("nameId"), // Retrieve nameId from localStorage
    };
  },
  mounted() {
    this.fetchAccounts();
    this.fetchEmployees();
    this.fetchNames();
    this.fetchData();
  },
  methods: {
    focusTextarea(text) {
      this.noteText = text;
      this.$refs.noteInput.focus();
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
        return;
      }
      if (!this.currentItem || !this.currentItem.id) return;

      axios
        .post(`${API_BASE_URL}/update_request/${this.currentItem.id}`, {
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
      this.addNote = false;
      this.viewNote = false;
    },
    getDocumentName(doc) {
      if (!doc) return "No document";
      return typeof doc === "object" ? doc.name || "Unknown" : doc;
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

      const payload = {
        documents: updatedDocuments,
        remarks: updatedDocuments.map((doc) => doc.remarks).join(", "),
      };

      axios
        .post(`${API_BASE_URL}/update_request/${this.currentItem.id}`, payload)
        .then((response) => {
          if (response.status === 200) {
            alert("Remarks updated successfully!");

            // Update local state
            this.formData = this.formData.map((item) => {
              if (item.id === this.currentItem.id) {
                return {
                  ...item,
                  documents: updatedDocuments,
                };
              }
              return item;
            });

            this.showEditDetailsPopup = false;
          }
        })
        .catch((error) => {
          console.error("Error updating documents:", error);
          alert("Failed to update documents. Please try again.");
        });
    },
    handleRating(rating) {
      if (!this.currentItem || !this.currentItem.id) {
        alert("No request selected.");
        return;
      }

      const userId = Number(this.nameId); // Convert to number
      const requestorId = Number(this.currentItem.name_id); // Convert to number

      // Restrict users 2 and 76 to rate only their own requests
      if ((userId === 2 || userId === 76) && userId !== requestorId) {
        alert("You can only rate your own request.");
        return;
      }

      const payload = { rating: rating };
      axios
        .post(`${API_BASE_URL}/update_request/${this.currentItem.id}`, payload)
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
        .get(`${API_BASE_URL}/get_request`)
        .then((response) => {
          this.mawala = true;
          this.load = false;
          console.log("Fetched Data:", response.data);

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
              })),
              rating: item.rating || null,
            };
          });

          // Filter based on nameId
          this.formData = this.formData.filter((item) => {
            return (
              this.nameId === "2" ||
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
  },
  computed: {
    pendingCount() {
      return this.formData.filter(
        (form) => form.note === null && form.initial !== null
      ).length;
    },
    
    isAdmin() {
      return this.nameId === "2" || this.nameId === "76"; // Check if the user is an admin
    },
    processedFormData() {
    return this.formData
      .filter((item) => {
        const requestorName = this.getName(item.name_id).toLowerCase();
        const documentNames = item.documents
          .map((doc) => (doc.name ? doc.name.toLowerCase() : ""))
          .join(" ");

        const query = this.searchQuery.toLowerCase();

        // Search filtering
        const matchesSearch =
          requestorName.includes(query) || documentNames.includes(query);

        if (!matchesSearch) return false;

        // Status filtering
        if (this.selectedStatus !== "All") {
          return item.documents.some(
            (doc) =>
              doc.remarks.trim().toLowerCase() ===
              this.selectedStatus.toLowerCase()
          );
        }

        return true;
      })
      .slice() // Make a copy before reversing
      .reverse(); // Reverse after filtering
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
  width: 20px;
  /* Adjust size */
  height: 20px;
  /* Adjust size */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  /* Adjust font size */
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
  background: linear-gradient(150deg, #ddc7ad, #92785b);
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
  .search,
  .note,
  .sign,
  .Btn,
  .dropdown {
    display: none !important;
  }

  .buttons {
    display: none !important;
  }
}
</style>
