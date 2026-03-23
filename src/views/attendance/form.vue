<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-content">
      <div class="modal-header">
        <h3>
          Generate DTR {{ dtrForm.startDate }} -
          {{ dtrForm.endDate }}
        </h3>
      </div>

      <form @submit.prevent="generateDTR">
        <!-- Display logged-in user's name -->
        <div class="form-group">
          <label>Employee Type: {{ dtrForm.employeeType == "cos" ? "COS" : dtrForm.employeeType == "regular" ? "Regular" : "Others" }}</label>
          <div class="radio-group-dtr" :style="{ '--active-index': dtrForm.employeeTypeIndex }">
            <label class="label-dtr">
              <input type="radio" value="regular" v-model="dtrForm.employeeType" @change="dtrForm.employeeTypeIndex = 0" />
              <span class="text-dtr">Regular</span>
            </label>

            <label class="label-dtr">
              <input type="radio" value="cos" v-model="dtrForm.employeeType" @change="dtrForm.employeeTypeIndex = 1" />
              <span class="text-dtr">COS</span>
            </label>

            <label class="label-dtr">
              <input type="radio" value="others" v-model="dtrForm.employeeType" @change="dtrForm.employeeTypeIndex = 2" />
              <span class="text-dtr">Others</span>
            </label>
          </div>
        </div>
        <!-- <div class="form-group">
          <label>Assigned Personnel:</label>
          <div class="multi-select">
            <div v-if="selectedPersonnel.length > 0" class="selected-items">
              <span v-for="(person, index) in selectedPersonnel" :key="person.name_id" class="selected-item">
                {{ person.first_name.toUpperCase() }} {{ person.middle_init.toUpperCase() }} {{ person.last_name.toUpperCase() }}
                <button type="button" @click="removePersonnel(index)">×</button>
              </span>
            </div>
            <input type="text" v-model="personnelSearch" @input="filterPersonnel" placeholder="Type to search personnel..." class="personnel-input" />
            <div v-if="showDropdown" class="dropdown">
              <div v-for="person in filteredPersonnel" :key="person.name_id" @click="selectPersonnel(person)" class="dropdown-item">
                {{ person.first_name.toUpperCase() }} {{ person.middle_init.toUpperCase() }} {{ person.last_name.toUpperCase() }}
              </div>
            </div>
          </div>
        </div> -->

        <div class="date-group">
          <div class="form-group">
            <label for="startDate">Start Date</label>
            <input type="date" v-model="dtrForm.startDate" id="startDate" required />
          </div>

          <div class="form-group">
            <label for="endDate">End Date</label>
            <input type="date" v-model="dtrForm.endDate" id="endDate" required />
          </div>
        </div>

        <div class="form-actions">
          <button class="generate-btn" type="submit" :class="{ 'loading-btn': isLoading }" :disabled="isLoading">Generate</button>
          <button class="cancel-btn" type="button" @click="closeForm" :class="{ 'loading-btn': isLoading }" :disabled="isLoading">Cancel</button>
        </div>

        <div v-if="isLoading" class="progress-wrapper">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <p class="progress-text">{{ progress }}%</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { API_BASE_URL } from "../../config";

export default {
  name: "DTRForm",
  // props: {
  //   nameId: {
  //     type: Number,
  //     required: true
  //   },
  //   showDTRForm: {
  //     type: Boolean,
  //     required: true
  //   }
  // },
  data() {
    const authStore = useAuthStore();
    return {
      names: {},
      dtrForm: {
        employeeType: "regular",
        startDate: "",
        endDate: "",
      },
      nameId: authStore.name_id,
      isVisible: true,
      allPersonnel: [],
      selectedPersonnel: [],
      personnelSearch: "",
      filteredPersonnel: [],
      showDropdown: false, // <-- added
      rsoData: { rso_name: "" }, // <-- added
      isLoading: false,
      progress: 0,
      isFormDirty: false, // new flag
    };
  },
  watch: {
    // Watch the form for changes to mark it dirty
    dtrForm: {
      handler() {
        this.isFormDirty = true;
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchNames();
    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.beforeUnloadHandler);
  },
  methods: {
    beforeUnloadHandler(e) {
      if (this.isFormDirty) {
        e.preventDefault();
        e.returnValue = ""; // Chrome requires this to show the prompt
      }
    },
    closeForm() {
      if (this.isFormDirty) {
        const confirmClose = confirm("You have unsaved changes! Are you sure you want to close?");
        if (!confirmClose) return;
      }
      this.$emit("close");
      this.isFormDirty = false; // reset
    },
    async fetchNames() {
      try {
        const response = await axios.get(`${API_BASE_URL}/get_names_json`);
        this.allPersonnel = response.data;

        // Add "Select All Personnel" entry to the allPersonnel list
        this.allPersonnel.unshift({
          name_id: "all",
          first_name: "select",
          middle_init: "all",
          last_name: "personnel",
        });

        this.filteredPersonnel = [
          ...this.allPersonnel, // Spread the personnel data after 'All' entry
        ];
        console.log(this.filteredPersonnel);
      } catch (error) {
        console.error("Error loading personnel:", error);
      }
    },
    filterPersonnel() {
      if (this.personnelSearch.trim() === "") {
        this.filteredPersonnel = [];
        this.showDropdown = false;
      } else {
        const searchTerm = this.personnelSearch.toLowerCase();
        // Filter out selected personnel
        this.filteredPersonnel = this.allPersonnel.filter(
          (person) =>
            !this.selectedPersonnel.some((selected) => selected.name_id === person.name_id) && `${person.first_name} ${person.middle_init} ${person.last_name}`.toLowerCase().includes(searchTerm),
        );
        this.showDropdown = this.filteredPersonnel.length > 0;
      }
    },
    selectPersonnel(person) {
      // Check if "All Personnel" is already selected
      const allPersonnelEntry = this.selectedPersonnel.find((p) => p.name_id === "all");

      if (allPersonnelEntry) {
        // If "All Personnel" is selected and the user adds another person, remove "All Personnel"
        this.selectedPersonnel = this.selectedPersonnel.filter((p) => p.name_id !== "all");
      }

      // Now add the selected person (if not already added)
      if (!this.selectedPersonnel.find((p) => p.name_id === person.name_id)) {
        this.selectedPersonnel.push(person);
      }
      this.personnelSearch = "";
      this.showDropdown = false;
      this.updateRsoName();
    },
    removePersonnel(index) {
      this.selectedPersonnel.splice(index, 1);
      this.updateRsoName();
    },
    updateRsoName() {
      // Convert selected personnel to comma-separated string of name_ids
      this.rsoData.rso_name = this.selectedPersonnel.map((person) => person.name_id).join(", ");
    },

    getName(nameId) {
      const name = this.names[nameId - 1];
      if (name) {
        const { first_name, middle_init, last_name } = name;
        return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
      }
      return "Unknown";
    },
    async generateDTR() {
      this.isLoading = true;
      this.progress = 0;

      // Fake progress animation
      const interval = setInterval(() => {
        if (this.progress < 90) {
          this.progress += 10;
        }
      }, 300);

      const formatMonthYear = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      };

      const monthYear = formatMonthYear(this.dtrForm.startDate);
      this.$emit("update:showDTRForm", false);

      console.log("DTR Generation Info:", this.nameId, this.dtrForm.startDate, this.dtrForm.endDate, this.dtrForm.employeeType);

      // Determine endpoint and payload
      let endpoint = `${API_BASE_URL}/dtrlog`;
      let payload = {
        start_date: this.dtrForm.startDate,
        end_date: this.dtrForm.endDate,
      };

      if (this.dtrForm.employeeType === "regular") {
        endpoint = `${API_BASE_URL}/generate-dtr-regular`;
        payload = {
          start_date: this.dtrForm.startDate,
          end_date: this.dtrForm.endDate,
        };
      } else if (this.dtrForm.employeeType === "cos") {
        endpoint = `${API_BASE_URL}/generate-dtr-cos`;
        payload = {
          start_date: this.dtrForm.startDate,
          end_date: this.dtrForm.endDate,
        };
      } else if (this.dtrForm.employeeType === "others") {
        endpoint = `${API_BASE_URL}/generate-dtr-others`;
        payload = {
          start_date: this.dtrForm.startDate,
          end_date: this.dtrForm.endDate,
        };
      }

      try {
        const response = await axios.post(endpoint, payload);
        const dtrData = response.data;

        // Success callback
        clearInterval(interval);
        this.progress = 100;

        setTimeout(() => {
          this.isLoading = false;
        }, 500);

        console.log("DTR Data:", dtrData);

        if (!dtrData || dtrData.length === 0) {
          alert("No attendance data found for the selected date range.");
          return;
        }

        // Emit DTR data to parent for print preview or further processing
        this.$emit("dtrGenerated", dtrData);
        this.closeForm();
        this.$emit("refresh-data"); // tell parent to refresh
      } catch (error) {
        console.error(error);
        // Error callback
        clearInterval(interval);
        this.isLoading = false;
        this.progress = 0;
        alert("Error: No attendance recorded today.");
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 500px;
  max-width: 90%;
  background: linear-gradient(150deg, #f0c36d, #b8860b);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 20px;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-out;
  border: 2px solid black;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.modal-content h3 {
  color: black;
  font-weight: bold;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 15px;
}

.modal-content label {
  color: black;
  font-weight: 600;
  margin-bottom: 5px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  font-family: Arial, sans-serif;
}

.form-group input {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
  transition: 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.15);
}

.date-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap; /* allows wrapping on small screens */
}

.date-group .form-group {
  flex: 1 1 45%; /* flexible width, wraps nicely */
}

.form-actions {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.generate-btn,
.cancel-btn {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  flex: 1 1 45%; /* buttons stack nicely on small screens */
}

.generate-btn {
  background-color: #000000;
  color: #ffffff;
  border: none;
}

.generate-btn:hover {
  transform: scale(1.05);
  background-color: #2e2e2e;
  color: #ffffff;
}

.cancel-btn {
  background-color: transparent;
  color: #000;
  border: 2px solid #000000;
}

.cancel-btn:hover {
  background-color: #000000;
  color: #ffffff;
  transform: scale(1.05);
}

.radio-group-dtr {
  display: flex;
  width: 100%;
  gap: 8px;
  position: relative;
  background-color: #222;
  border-radius: 12px;
  overflow: hidden;
  --active-index: 0;
  border: 2px solid #555;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.radio-group-dtr::before {
  content: "";
  position: absolute;
  top: 0;
  left: calc(var(--active-index) * (100% / 3));
  width: calc(100% / 3);
  height: 100%;
  background: linear-gradient(135deg, #ffd700, #ffc700, #ffb700);
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
  transition: left 0.3s ease;
  z-index: 0;
}

.label-dtr {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  z-index: 1;
  padding: 14px 8px;
  text-align: center;
  transition: color 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  /* Remove background for active highlight to show through */
  background: none;
}

/* Hide the default radio buttons */
.label-dtr input {
  display: none;
}

/* Text inside label */
.label-dtr .text-dtr {
  font-weight: 700;
  text-transform: uppercase;
  transition: color 0.3s ease;
  user-select: none;
}

/* Active label text */
.label-dtr input:checked + .text-dtr {
  color: black;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
}

/* Inactive label text */
.label-dtr input:not(:checked) + .text-dtr {
  color: white;
}

/* Rounded corners for first/last buttons */
.label-dtr:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.label-dtr:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* Optional hover effect for inactive buttons */
.label-dtr:not(:has(input:checked)):hover {
  background: rgba(255, 255, 255, 0.05);
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
  height: 42px;
  margin-bottom: 5px;
}

.selected-item {
  display: inline-flex;
  align-items: center;
  background-color: #f0f0f0;
  height: 30px;
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

/* loading button (optional, pointer not allowed too) */
.loading-btn {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    padding: 15px;
  }

  .modal-content h3 {
    font-size: 1.2rem;
  }

  .form-group input {
    font-size: 14px;
    padding: 6px 8px;
  }

  .generate-btn,
  .cancel-btn {
    font-size: 14px;
    padding: 8px 12px;
  }
}
</style>
