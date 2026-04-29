<template>
  <div class="luxury-container">
    <div v-if="load" class="loader"></div>
    <div class="luxury-search-container">
      <div class="luxury-title">
        <div></div>
      </div>
      <br />
      <br />
      <div class="luxury-search-bar">
        <div v-if="mawala" class="luxury-search-box">
          <img class="luxury-search-icon" @click="fetchData(true)" src="../../assets/search.png" alt="Search" style="cursor: pointer" />
          <input class="luxury-search-input" type="text" v-model="searchQuery" @keyup.enter="fetchData(true)" placeholder="Search TO number or Name" />
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
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in reversedFormData" :key="item.id">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
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
    clearInterval(this.fetchInterval);
    window.removeEventListener("afterprint", this.handleAfterPrint);
  },
  data() {
    const authStore = useAuthStore();
    return {
      currentPage: 1,
      pageSize: 5,
      totalItems: 0,
      totalPages: 0,
      pdfKey: 0,
      pendingStore: usePendingStore(),
      numberOfRows: 4,
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
      fetchInterval: null,
      isNoteModalVisible: false,
      isAdding: false,
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

    getMonth(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleString("default", { month: "long" });
    },
    handleAfterPrint() {
      this.close();
    },
    printzz() {
      window.print();
    },

    fetchData(reset = false) {
      if (reset) {
        this.formData = [];
        this.currentPage = 1;
      }
      this.load = true;
      const params = {};
      if (this.searchQuery) params.search = this.searchQuery;
      axios
        .get(`${API_BASE_URL}/dtrlog/filter`, { params })
        .then((response) => {
          this.mawala = true;
          this.load = false;
          this.csvformdata = response.data;

          this.totalItems = response.data.total || response.data.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);

          const existingIds = new Set(this.formData.map((item) => item.id));

          const uniqueNewData = response.data.filter((item) => !existingIds.has(item.id));

          this.formData = [...this.formData, ...uniqueNewData];

          if (this.formData.length === 0) {
            console.warn(`No data found for user ID: ${this.nameId}`);
          }

          this.formData.sort((a, b) => {
            const dateA = new Date(a.start_date);
            const dateB = new Date(b.start_date);
            return dateB - dateA;
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },

    filteredEmployeeData() {
      return this.formData;
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

      setTimeout(() => {
        this.printzz();
      }, 1000);
    },
    openPayslip(item, type) {
      this.pdfKey++;
      if (type === 0) {
        this.selectedPDFtype = "payslip";
      }
      if (type === 1) {
        this.selectedPDFtype = "payslipreg";
      }
      this.selectedDTR = item.id;
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
    pendingCount() {
      return this.pendingStore.travelorder;
    },
    filteredData() {
      return this.formData;
    },
    reversedFormData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;

      return this.formData
        .slice()
        .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
        .slice(start, end);
    },
  },
  watch: {
    selectedStatus() {
      this.fetchData(true);
    },
    numberOfRows: "fetchData",

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
  background-color: #d4af37;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination button:disabled {
  background-color: #c0c0c0;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: black;
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
