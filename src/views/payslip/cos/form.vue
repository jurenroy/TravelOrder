<template>
  <div class="page-container">
    <div class="dashboard-card">
      <!-- Generate Payslip Section -->
      <div v-if="activeTab === 'generate'" class="generate-section">
        <p class="subtitle">
          <strong>Payroll Period: {{ cutoffDates }}</strong>
        </p>

        <div class="form-row">
          <!-- Year -->
          <div class="input-group">
            <label>Year</label>
            <select v-model="selectedYear">
              <option disabled value="">Select Year</option>
              <option v-for="year in years" :key="year" :value="year" :disabled="year > todayYear">
                {{ year }}
              </option>
            </select>
          </div>

          <!-- Month -->
          <div class="input-group">
            <label>Month</label>
            <select v-model="selectedMonth">
              <option disabled value="">Select Month</option>
              <option v-for="(month, index) in months" :key="month" :value="month" :disabled="isFutureMonth(index)">
                {{ month }}
              </option>
            </select>
          </div>

          <!-- Cutoff -->
          <div class="input-group">
            <label>Cut-off</label>
            <select v-model="selectedCutoff">
              <option disabled value="">Select Cut-off {{ tabStatus }}</option>
              <option v-for="cutoff in cutoffs" :key="cutoff" :value="cutoff" :disabled="isFutureCutoff(cutoff)">
                {{ cutoff }}
              </option>
            </select>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="button-container">
          <button
            class="submit-btn"
            :class="{ 'loading-btn': isLoading, 'disabled-btn': !selectedMonth || !selectedYear || isLoading }"
            @click="submitPayslip"
            :disabled="!selectedMonth || !selectedCutoff || !selectedYear || isLoading"
          >
            {{ tabStatus === "generate" ? "Generate Payslip" : "View Payslip" }}
          </button>
        </div>

        <!-- PRINT ALL PAYSLIP -->
        <!-- <button class="submit-btn">PRINT ALL PAYSLIP</button> -->

        <div v-if="isLoading" class="progress-wrapper">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <p class="progress-text">{{ progress }}%</p>
        </div>

        <!-- Table -->
      </div>
    </div>
  </div>
  <!-- Progress Bar -->
</template>

<script>
import Table from "./table.vue";
import axios from "axios";

export default {
  props: {
    // Define props to receive from the parent
    tabStatus: {
      type: String,
      required: true,
    },
  },
  name: "PayrollDashboard",
  components: { Table },

  data() {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonthIndex = today.getMonth();
    const todayDate = today.getDate();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const cutoffs = ["First Cut-off (1 - 15)", "Second Cut-off (16 - End)"];
    const defaultCutoff = todayDate <= 15 ? cutoffs[0] : cutoffs[1];

    return {
      activeTab: "generate", // default active tab
      todayYear,
      todayMonthIndex,
      todayDate,

      selectedYear: todayYear,
      selectedMonth: months[todayMonthIndex],
      selectedCutoff: defaultCutoff,
      showTable: false,

      years: Array.from({ length: 11 }, (_, i) => todayYear - 5 + i),
      months,
      cutoffs,
      isLoading: false,
      progress: 0,
    };
  },

  computed: {
    cutoffDates() {
      if (!this.selectedYear || !this.selectedMonth || !this.selectedCutoff) return "";

      const monthIndex = this.months.indexOf(this.selectedMonth);
      const lastDay = new Date(this.selectedYear, monthIndex + 1, 0).getDate();

      if (this.selectedCutoff === "First Cut-off (1 - 15)") {
        return `${this.selectedMonth} 1-15, ${this.selectedYear}`;
      }

      if (this.selectedCutoff === "Second Cut-off (16 - End)") {
        return `${this.selectedMonth} 16-${lastDay}, ${this.selectedYear}`;
      }
    },
  },

  methods: {
    submitPayslip() {
      this.showTable = true;
      if (this.tabStatus === "generate") {
        // If it's the "Generate" tab, make the HTTP request
        this.generatePayslip();
      } else {
        // If it's the "View" tab, emit the data
        this.$emit("sendDataToB", this.cutoffDates);
      }
    },
    generatePayslip() {
      this.isLoading = true;
      this.progress = 0;

      // Fake progress animation
      const interval = setInterval(() => {
        if (this.progress < 90) {
          this.progress += 10;
        }
      }, 300);

      // POST request without parameters to the URL
      axios
        .post("http://172.31.10.43:8011/cos-generate-batch-payslips") // URL for your API
        .then((response) => {
          clearInterval(interval);
          this.progress = 100;

          setTimeout(() => {
            this.isLoading = false;
          }, 500);

          window.location.reload();

          console.log("Batch payslips generated:", response.data);
          // You can handle success here (e.g., show a success message)
        })
        .catch((error) => {
          // Error callback
          clearInterval(interval);
          this.isLoading = false;
          this.progress = 0;
          console.error("Error generating payslips:", error);
          // Handle error (e.g., show an error message)
        });
    },
    isFutureMonth(monthIndex) {
      return this.selectedYear === this.todayYear && monthIndex > this.todayMonthIndex;
    },
    isFutureCutoff(cutoff) {
      if (this.selectedYear === this.todayYear && this.months.indexOf(this.selectedMonth) === this.todayMonthIndex && cutoff === "Second Cut-off (16 - End)" && this.todayDate <= 15) {
        return true;
      }
      return false;
    },
    switchTab(tabName) {
      this.activeTab = tabName;

      if (tabName === "view") {
        this.showTable = false;
      }
    },
  },
};
</script>

<style>
.page-container {
  background: transparent;
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* Container for Dashboard */
.dashboard-card {
  background: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  max-width: 1000px;
  width: 100%;
}

.subtitle {
  margin-bottom: 20px;
  color: black;
}

.button-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: black;
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.action-btn.active,
.action-btn:hover {
  background: #ecbf67;
  color: black;
}

.form-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* disabled button (gray + not allowed) */
.disabled-btn {
  background-color: #ccc;
  cursor: not-allowed;
}

/* loading button (optional, pointer not allowed too) */
.loading-btn {
  opacity: 0.7;
  cursor: not-allowed;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #444;
}

select {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.button-container {
  margin-top: 20px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: black;
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.submit-btn:hover {
  background: #ecbf67;
  color: black;
}

.submit-btn:disabled {
  background: #b8c3d6;
  cursor: not-allowed;
}

.cutoff-display {
  margin-top: 15px;
  background: #eef3ff;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
}

.table-container {
  margin-top: 30px;
  width: 100%;
  max-width: 3000px;
}

.progress-wrapper {
  margin-top: 20px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #000, #ecbf67);
  width: 0%;
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 8px;
  font-size: 14px;
  color: #333;
}

@media (max-width: 600px) {
  .dashboard-card {
    padding: 20px;
  }
  .form-row {
    flex-direction: column;
  }
}
</style>
