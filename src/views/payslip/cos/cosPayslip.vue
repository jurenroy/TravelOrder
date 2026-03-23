<template>
  <div class="bulkprintcos-container">
    <div v-for="(page, pageIndex) in pages" :key="pageIndex" class="bulkprintcos-page">
      <div v-for="employee in page" :key="employee.id" class="bulkprintcos-slip">
        <!-- Payslip Content -->
        <div class="bulkprintcos-header">
          <h2>MINES AND GEOSCIENCES BUREAU</h2>
          <h3>REGIONAL OFFICE NO. X</h3>
        </div>

        <div class="bulkprintcos-period">
          <p>SALARY OF JOB ORDERS AND CONTRACTUAL FOR</p>
          <p>THE PERIOD {{ employee.period }}</p>
        </div>

        <div class="bulkprintcos-name">
          <strong>{{ getName(employee.name_id) }}</strong>
        </div>

        <table class="bulkprintcos-salary-table">
          <tr>
            <td>{{ employee.days }}</td>
            <td>x</td>
            <td>{{ formatCurrency(employee.rate) }}</td>
            <td>=</td>
            <td>{{ formatCurrency(employee.rate_total) }}</td>
          </tr>
          <tr>
            <td>Add: Premium ({{ employee.premium_rate }}%)</td>
            <td>+</td>
            <td>{{ employee.premium }}</td>
            <td>=</td>
            <td>{{ formatCurrency(employee.premium_total) }}</td>
          </tr>
          <tr>
            <td>Additional Salary</td>
            <td>+</td>
            <td>{{ formatCurrency(employee.additional) }}</td>
            <td>=</td>
            <td>{{ formatCurrency(employee.additional) }}</td>
          </tr>
          <tr class="bulkprintcos-gross">
            <td colspan="4" class="right"></td>
            <td>{{ formatCurrency(employee.subtotal) }}</td>
          </tr>
        </table>

        <div class="bulkprintcos-deductions">
          <h4>Deductions:</h4>
          <table>
            <tr v-for="item in deductions" :key="item.key">
              <td class="left">{{ item.label }}</td>
              <td class="right">{{ formatCurrency(employee[item.key]) }}</td>
            </tr>
            <tr class="total">
              <td>Total Deductions</td>
              <td class="right">{{ formatCurrency(employee.total_deductions) }}</td>
            </tr>
            <tr class="net">
              <td>Total</td>
              <td class="right">{{ formatCurrency(employee.total) }}</td>
            </tr>
          </table>
        </div>

        <div class="bulkprintcos-footer">
          <p>CERTIFIED TRUE AND CORRECT</p>
          <h2>{{ getName(employee.certify) }}</h2>
          <p>{{ employee.certipos }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_BASE_URL } from "../../../config";

export default {
  props: {
    dtrvalues: { type: String, required: true },
  },
  data() {
    return {
      names: {},
      employees: [],
      deductions: [
        { key: "overpayment", label: "Overpayment" },
        { key: "penalty", label: "LATE/UT" },
        { key: "pass_slip", label: "Pass Slip" },
        { key: "tax", label: "Tax" },
        { key: "PhilHealth", label: "PhilHealth" },
        { key: "PhilHealthDiff", label: "PhilHealth Differential" },
        { key: "Pagibig", label: "Pag-IBIG" },
        { key: "MP2", label: "MP2" },
        { key: "MPL", label: "Pag-IBIG MPL" },
        { key: "MGB_coop_loan", label: "MGB Coop Loan" },
      ],
    };
  },
  computed: {
    pages() {
      const chunkSize = 4; // 4 payslips per page
      const pages = [];
      for (let i = 0; i < this.employees.length; i += chunkSize) {
        pages.push(this.employees.slice(i, i + chunkSize));
      }
      return pages;
    },
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await axios.get(`http://172.31.10.43:8011/payslip-cos/period/February 1-15, 2026`);
        this.employees = response.data;
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },
    formatCurrency(value) {
      if (!value) return "0.00";
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value));
    },
    fetchNames() {
      axios
        .get(`${API_BASE_URL}/get_names_json`)
        .then((res) => {
          this.names = res.data;
        })
        .catch((err) => console.error(err));
    },
    getName(id) {
      const n = this.names[id - 1];
      return n ? `${n.first_name.toUpperCase()} ${n.middle_init.toUpperCase()} ${n.last_name.toUpperCase()}` : "UNKNOWN";
    },
  },
  mounted() {
    this.fetchNames();
    this.fetchEmployees();
  },
};
</script>

<style scoped>
/* Container styling */
.bulkprintcos-container {
  width: 100%;
}

/* Each page */
.bulkprintcos-page {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}

/* Each payslip */
.bulkprintcos-slip {
  width: calc(50% - 5mm);
  height: calc(50% - 5mm);
  margin: 2.5mm;
  border: 1px solid #000;
  padding: 5mm;
  box-sizing: border-box;
  page-break-inside: avoid;
  overflow: visible;
}

.bulkprintcos-header,
.bulkprintcos-period,
.bulkprintcos-name,
.bulkprintcos-deductions,
.bulkprintcos-footer {
  text-align: center;
  margin-bottom: 5px;
}

.bulkprintcos-salary-table,
.bulkprintcos-deductions table {
  width: 100%;
  border-collapse: collapse;
}

.bulkprintcos-salary-table td,
.bulkprintcos-deductions td {
  padding: 3px;
}

.right {
  text-align: right;
}

.left {
  text-align: left;
  padding-left: 5mm;
}

.bulkprintcos-gross td {
  border-top: 1px solid #000;
  font-weight: bold;
}

.bulkprintcos-deductions .total td,
.bulkprintcos-deductions .net td {
  border-top: 1px solid #000;
  font-weight: bold;
}

@media print {
  body,
  html {
    margin: 0;
    padding: 0;
    overflow: visible !important;
  }

  .bulkprintcos-page {
    width: 210mm;
    height: 297mm;
    display: flex;
    flex-wrap: wrap;
    page-break-after: always;
    overflow: visible !important;
  }

  .bulkprintcos-slip {
    width: calc(50% - 5mm);
    height: calc(50% - 5mm);
    page-break-inside: avoid;
    border: 1px solid #000;
    padding: 5mm;
    box-sizing: border-box;
    overflow: visible !important;
  }
}
</style>
