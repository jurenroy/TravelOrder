<template>
  <div class="luxury-container">
    <div v-if="load" class="loader"></div>
    <!-- Loader here -->

    <div class="luxury-search-container">
      <div class="luxury-title">
        <!-- <div class="radio-inputs">
      <label class="radio" v-for="option in options" :key="option">
        <input type="radio" name="status" v-model="selectedStatus" :value="option">
        <span class="name">
          {{ option }}
          <span class="pending-count" v-if="option == 'Pending'">{{ pendingCount < 9 ? pendingCount : '9+'}}</span>
        </span>
      </label>
    </div> -->
        <div></div>
      </div>
      <br />
      <br />
      <div class="luxury-search-bar">
        <div v-if="mawala" class="luxury-search-box">
          <img class="luxury-search-icon" @click="fetchData(true)" src="../../assets/search.png" alt="Search" style="cursor: pointer" />
          <input class="luxury-search-input" type="text" v-model="searchQuery" @keyup.enter="fetchData(true)" placeholder="Search TO number or Name 1" />
        </div>

        <button v-if="mawala && [2, 15, 24, 76, 39].includes(nameId)" class="luxury-btn" @click="downloadCSV">
          <div class="luxury-btn-icon">
            <img class="luxury-download-icon" src="../../assets/download_excel.png" alt="Download" />
          </div>
          <div class="luxury-btn-text">Download Summary Reports</div>
        </button>
      </div>
    </div>

    <div v-if="mawala" class="outer">
      <div>
        <!--  class="scrollable-table"  ref="scrollContainer" @scroll.passive="handleScroll" -->
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <!-- New column for numbering -->
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in reversedFormData" :key="item.id">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <!-- Row number -->
              <td class="name">{{ getName(item.name_id) }}</td>
              <td>{{ item.start_date }}</td>
              <td>{{ item.end_date }}</td>
              <td>
                <button @click="openDTR(item)">View DTR</button>
                <button @click="openPayslip(item, getStatus(item.name_id))" v-if="getStatus(item.name_id) == 0">View Payslip {{ getStatus(item.name_id) }}</button>
                <button @click="openPayslip(item, getStatus(item.name_id))" v-if="getStatus(item.name_id) == 1">View Payslip {{ getStatus(item.name_id) }}</button>
              </td>
            </tr>
          </tbody>
        </table>
        <h1 v-if="reversedFormData.length == 0" class="no-match">NO MATCH FOUND</h1>
      </div>
      <div class="pagination" v-if="totalPages > 1">
        <button :disabled="currentPage === 1" @click="prevPage">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage">Next</button>
      </div>
    </div>
  </div>

  <div v-if="selectedDTR" class="prent full-screen">
    <pdf v-if="selectedPDFtype === 'dtr'" :key="pdfKey" :dtrvalues="selectedDTR" :name="getName(pasa.name)" :month="getMonth(pasa.startDate)" />
    <!--   -->
    <payslip v-if="selectedPDFtype === 'payslip'" :key="pdfKey" :dtrvalues="String(selectedDTR)" />
    <regularPayslip v-if="selectedPDFtype === 'payslipreg'" :key="pdfKey" :dtrvalues="String(selectedDTR)" />
  </div>
</template>

<script>
import axios from "axios";
import pdf from "./pdf.vue";
import payslip from "./cosPayslip.vue";
import regularPayslip from "./regularPayslip.vue";
import { API_BASE_URL } from "../../config";
import { useAuthStore } from "../../store/auth";
import { usePendingStore } from "@/store/pending";

export default {
  provide() {
    return {
      close: this.close,
    };
  },
  components: {
    pdf,
    payslip,
    regularPayslip,
  },
  props: {
    refreshTrigger: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.fetchEmployees();
    this.fetchNames();
    this.fetchData(true);
    window.addEventListener("afterprint", this.handleAfterPrint);
  },
  beforeDestroy() {
    clearInterval(this.fetchInterval); // Clear the interval when the component is destroyed
    window.removeEventListener("afterprint", this.handleAfterPrint);
  },
  data() {
    const authStore = useAuthStore();
    return {
      authStore,
      currentPage: 1, // Current page number
      pageSize: 5, // Number of items per page
      totalItems: 0, // Total items from the backend
      totalPages: 0, // Calculated total pages
      pdfKey: 0,
      pendingStore: usePendingStore(),
      numberOfRows: 4, // Default number of rows to fetch
      selectedStatus: "Pending",
      optionsEmp: ["Pending", "Done", "All"],
      options: ["Pending", "Done", "Me"],
      yearToday: new Date().getFullYear(),
      formData: [],
      names: {},
      employees: {},
      selectedTravelOrderId: 0,
      selectedPDFtype: "",
      selectedTravelOrderIdEdit: 0,
      accountId: authStore.name_id,
      nameId: authStore.name_id,
      load: true,
      mawala: false,
      searchQuery: "",
      isVisible: true,
      fetchInterval: null, // To store the interval ID
      isNoteModalVisible: false, // Control visibility of the modal
      isAdding: false, // Control whether we are adding or viewing a note
      socket: "",
      selectedDTR: [],
      pasa: {
        startDate: "",
        endDate: "",
        name: "",
      },
    };
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // GET MONTH
    getMonth(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleString("default", { month: "long" }); // Gets the month name (e.g., "February")
    },
    handleAfterPrint() {
      // Code to execute after printing
      this.close();
      // You can reset any flags or perform cleanup here
    },
    printzz() {
      window.print();
    },
    // handleScroll() {
    //   const container = this.$refs.scrollContainer;
    //   if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
    //     console.log("scroll");
    //     // Near bottom, load more
    //     this.fetchData();
    //   }
    // },
    fetchData(reset = false) {
      if (reset) {
        this.formData = []; // Clear the array only when status changes
        this.currentPage = 1;
      }
      this.load = true;
      const params = {};
      if (this.searchQuery) params.search = this.searchQuery;
      // params.name_id = this.nameId;
      // alert(this.formData.length)
      axios
        .get(`${API_BASE_URL}/dtrlog/filter`, { params })
        .then((response) => {
          this.mawala = true;
          this.load = false;
          this.csvformdata = response.data;

          // this.formData=response.data
          // Get the IDs already present
          const existingIds = new Set(this.formData.map((item) => item.id));

          // Filter out duplicates
          const uniqueNewData = response.data.filter((item) => !existingIds.has(item.id));

          // Append only unique items
          // this.formData = [...this.formData, ...uniqueNewData];

          // Display LOGGED IN employee Data only
          // this.formData = response.data.filter((item) => item.name_id === this.nameId);

          // If the user is an admin or a specific employee, show all data
          // Check if the user is admin // ADMIN id=76, JUREN id=77
          // const adminIds = [2, 15, 24, 76, 39];
          if (this.isAdmin) {
            console.log(`Admin: ${this.authStore?.name_id} user detected. Showing all data.`);
            this.formData = response.data;
          } else {
            console.log(`Employee user detected. Filtering data for user ID: ${this.authStore?.name_id}`);
            this.formData = response.data.filter((item) => item.name_id === this.authStore?.name_id);
          }
          // Check if there's any data
          if (this.formData.length === 0) {
            console.warn(`No data found for user ID: ${this.nameId}`);
          }
          // If API returns total count, use it
          this.totalItems = this.formData.length;
          this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));

          // Sort Form from recent Date
          this.formData.sort((a, b) => {
            // Convert to Date object for comparison
            const dateA = new Date(a.start_date);
            const dateB = new Date(b.start_date);
            return dateB - dateA; // a - b for ascending, b - a for descending
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    // Filtered data for the logged-in employee
    filteredEmployeeData() {
      return this.formData; // Return filtered data based on the logged-in employee's nameId
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
        .get(`${API_BASE_URL}/get_employees_json/`)
        .then((response) => {
          this.employees = response.data;
          console.log("This Employee", response.data);
        })
        .catch((error) => {
          console.error("Error fetching employeess:", error);
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
    getStatus(nameId) {
      const employee = this.employees.find((emp) => emp.name_id === nameId);
      return employee ? employee.status : "Unknown";
    },
    openDTR(item) {
      this.pdfKey++;
      this.selectedPDFtype = "dtr";
      this.selectedDTR = item;
      this.pasa.startDate = this.selectedDTR ? this.selectedDTR.start_date : "";
      this.pasa.endDate = this.selectedDTR ? this.selectedDTR.end_date : "";
      this.pasa.name = this.selectedDTR ? this.selectedDTR.name_id : "";
      console.log("This selected DTR", this.selectedDTR, "This is PASA", this.pasa, "GIKAN table.vue");

      setTimeout(() => {
        this.printzz();
      }, 1000); // 500 milliseconds = 0.5 seconds
    },
    openPayslip(item, type) {
      this.pdfKey++;
      if (type === 0) {
        this.selectedPDFtype = "payslip";
        console.log("cos");
      }
      if (type === 1) {
        this.selectedPDFtype = "payslipreg";
        console.log("reg");
      }
      this.selectedDTR = item.id;
      console.log(this.selectedDTR);
      setTimeout(() => {
        this.printzz();
      }, 1000);
    },

    close() {
      this.selectedTravelOrderId = 0;
      this.selectedPDFtype = "";
      this.selectedDTR = null;
    },
    updateVisibleItems() {
      this.visibleItems = this.formData.slice(0, 20);
    },
  },

  computed: {
    isAdmin() {
      const adminIds = [2, 15, 24, 76, 39];
      return adminIds.includes(this.authStore?.name_id);
    },

    pendingCount() {
      return this.pendingStore.travelorder;
    },
    filteredData() {
      return this.formData; // Return all if not section chief
    },
    reversedFormData() {
      //let data = this.formData.slice().reverse(); // Make a copy of the original data
      // let data = this.formData.slice(); // Make a copy of the original data
      // return data;
      // Calculate start and end indexes
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;

      // Sort by start_date descending and slice only current page
      return this.formData
        .slice()
        .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
        .slice(start, end);
    },
  },
  watch: {
    selectedStatus() {
      this.fetchData(true); // Pass true to reset on status change
    },
    numberOfRows: "fetchData", // Watch for changes in number of rows

    refreshTrigger() {
      this.fetchData(true);
    },
  },
};
</script>

<style>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
  font-family: Arial, sans-serif;
}

.pagination button {
  background-color: #d4af37; /* Blue color */
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 16px; /* readable font size */
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination button:disabled {
  background-color: #c0c0c0; /* Gray out when disabled */
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: black; /* Darker blue on hover */
}

.pagination span {
  font-size: 16px;
  font-weight: bold;
  margin: 0 8px;
}
.name {
  text-align: left;
}
</style>
