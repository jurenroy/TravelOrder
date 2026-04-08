<template>
  <div class="payslip-grid">
    <div class="payslip" v-for="(employee, index) in employees" :key="index">
      <!-- Include all your existing payslip HTML here -->
      <div class="header">
        <h2>MINES AND GEOSCIENCES BUREAU</h2>
        <h3>REGIONAL OFFICE NO. X</h3>
      </div>

      <div class="period">
        <p>SALARY OF JOB ORDERS AND CONTRACTUAL FOR</p>
        <p>THE PERIOD {{ employee.period }}</p>
      </div>

      <div class="name">
        <strong>{{ getName(employee.name_id) }}</strong>
      </div>

      <table class="salary-table">
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

        <tr class="gross">
          <td colspan="4" class="right"></td>
          <td>{{ formatCurrency(employee.subtotal) }}</td>
        </tr>
      </table>

      <div class="deductions">
        <h4>Deductions:</h4>
        <table>
          <tr v-for="item in deductions" :key="item.key">
            <td class="left">{{ item.label }}</td>
            <td class="right">{{ formatCurrency(employee[item.key]) }}</td>
          </tr>
          <tr class="total">
            <td>Total Deductions</td>
            <td class="right">{{ employee.total_deductions }}</td>
          </tr>
          <tr class="net">
            <td>Total</td>
            <td class="right">{{ formatCurrency(employee.total) }}</td>
          </tr>
        </table>
      </div>

      <div class="footer">
        <p>CERTIFIED TRUE AND CORRECT</p>
        <br />
        <h2>{{ getName(employee.certify) }}</h2>
        <p>{{ employee.certipos }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_BASE_URL } from "../../config";

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

  methods: {
    async fetchEmployees() {
      try {
        const response = await axios.get(`${API_BASE_URL}/payslip-cos/dtrs/${this.dtrvalues}`);
        // Assuming the response data is an array of employees
        this.employees = response.data;
        console.log("Employees fetched:", this.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },
    formatCurrency(value) {
      if (value === null || value === undefined || value === "") return "0.00";

      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value));
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

    getName(nameId) {
      const name = this.names[nameId - 1];
      if (name) {
        const { first_name, middle_init, last_name } = name;
        return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
      }
      return "Unknown";
    },
  },
  watch: {
    dtrvalues(newValue) {
      // Your logic when dtrvalues has a value
      this.fetchEmployees();
    },
  },
  mounted() {
    this.fetchNames();
    if (this.dtrvalues && this.dtrvalues.length > 0) {
      this.fetchEmployees();
    }
  },
};
</script>

<style scoped>
.payslip {
  width: 400px;
  margin: auto;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
}

.header {
  text-align: center;
  font-weight: bold;
}

.period {
  text-align: center;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.name {
  margin-bottom: 10px;
}

.salary-table {
  width: 100%;
  border-collapse: collapse;
}

.salary-table td {
  padding: 4px;
}

.right {
  text-align: right;
}
.left {
  text-align: left;
  padding-left: 100px;
}

.gross td {
  border-top: 1px solid #000;
  font-weight: bold;
}

.deductions {
  margin-top: 10px;
}

.deductions table {
  width: 100%;
}

.total td {
  border-top: 1px solid #000;
  font-style: italic;
  text-align: right;
}

.net td {
  border-top: 2px double #000;
  font-weight: bold;
  font-style: italic;
  text-align: right;
}

.footer {
  text-align: center;
  margin-top: 40px;
}
.footer p {
  margin: 5px 0;
}

.footer h2 {
  margin: 10px 0;
}

.payslip-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 20px;
}

.payslip {
  border: 1px solid #000;
  padding: 10px;
  box-sizing: border-box;
  page-break-inside: avoid; /* Avoid breaking inside a payslip */
}

/* Print styling */
@media print {
  body {
    margin: 0;
  }
  .payslip-grid {
    grid-template-columns: 2fr 2fr;
    gap: 10px;
  }
  .payslip {
    page-break-inside: avoid;
  }
}
</style>
