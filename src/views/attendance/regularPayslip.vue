<template>
  <div class="print-page">
    <div class="payslip" v-for="(employee, index) in employees" :key="index">
      <div class="header">
        <div>Mines and Geosciences Bureau, Regional Office No. X</div>
        <strong>Payslip</strong>
        <div>For the period {{ employee.period }}</div>
      </div>

      <div class="info">
        <div>{{ employee_id }} {{ getName(employee.name_id) }}</div>
      </div>

      <table>
        <tbody>
          <tr>
            <td>MONTHLY SALARY</td>
            <td>{{ money(employee.rate) }}</td>
          </tr>
          <tr>
            <td>ACA/PERA</td>
            <td>{{ money(employee.aca_pera) }}</td>
          </tr>
          <tr>
            <td></td>
            <td>{{ money(employee.subtotal) }}</td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <tr colspan="2" class="deductions">Deductions:</tr>
          </tr>
          <table>
            <tr v-for="item in deductions" :key="item.key">
              <td class="left">{{ item.label }}</td>
              <td class="right">{{ employee[item.key] }}</td>
            </tr>
          </table>
        </thead>
      </table>
      <br />
      <table>
        <tbody>
          <tr>
            <td><strong>TOTAL DEDUCTIONS</strong></td>
            <td>
              <strong>
                {{ money(employee.total_deductions) }}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <table>
        <tbody>
          <tr>
            <td><strong>NET TAKE HOME PAY</strong></td>
            <td>
              <strong>{{ money(employee.total) }}</strong>
            </td>
          </tr>
          <tr>
            <td><strong>February 1-15</strong></td>
            <td>{{ money(employee.first_cutoff) }}</td>
          </tr>
          <tr>
            <td><strong>February 16-28</strong></td>
            <td>{{ money(employee.second_cutoff) }}</td>
          </tr>
        </tbody>
      </table>
      <div id="footer">
        <div>CERTIFIED TRUE AND CORRECT</div>
        <br />
        <br />
        <div class="name_id">{{ getName(employee.certify) }}</div>
        <p class="par">{{ employee.certiby }} / {{ employee.certipos }}</p>
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
      employee_id: "",
      names: {},
      employees: [],
      deductions: [
        { key: "gsis", label: "GSIS" },
        { key: "pagibig", label: "Pag-IBIG" },
        { key: "MP2", label: "MP2" },
        { key: "PhilHealth", label: "PhilHealth" },
        { key: "wtax", label: "Withholding Tax" },
        { key: "gsis_conso_loan", label: "GSIS Conso Loan" },
        { key: "gsis_policy_loan", label: "GSIS Policy Loan" },
        { key: "gsis_emergency_loan", label: "GSIS Emergency Loan" },
        { key: "gsis_uoli1", label: "GSIS UOLI 1" },
        { key: "gsis_uoli2", label: "GSIS UOLI 2" },
        { key: "gsis_uoli_loan1", label: "GSIS UOLI Loan 1" },
        { key: "gsis_uoli_loan_2", label: "GSIS UOLI Loan 2" },
        { key: "gsis_housing_loan", label: "GSIS Housing Loan" },
        { key: "gsis_educational_loan", label: "GSIS Educational Loan" },
        { key: "gsis_computer_loan", label: "GSIS Computer Loan" },
        { key: "gsis_mpl", label: "GSIS MPL" },
        { key: "gsis_gfal", label: "GSIS GFAL" },
        { key: "pagibig_housing_loan", label: "Pag-IBIG Housing Loan" },
        { key: "pagibig_mpl", label: "Pag-IBIG MPL" },
        { key: "lbp_salary_loan", label: "LBP Salary Loan" },
        { key: "cola_disallowance", label: "COLA Disallowance" },
        { key: "praise_disallowance", label: "PRAISE Disallowance" },
        { key: "enrp_mowel", label: "ENRP MOWEL" },
        { key: "ucpb_salary_loan", label: "UCPB Salary Loan" },
        { key: "mgbea10", label: "MGBEA - 10" },
      ],
    };
  },
  mounted() {
    this.fetchEmployees();
    this.fetchNames();
  },
  methods: {
    async fetchEmployees() {
      try {
        console.log("cjoy");
        const response = await axios.get(`http://172.31.10.43:8011/payslip-regular/dtrs/${this.dtrvalues}`);
        // const response = await axios.get(`http://172.31.10.43:8011/payslip-regular/dtrs/1555`);

        // Check if response has data
        if (response.data && response.data.length > 0) {
          this.employees = response.data; // Store the employee array

          // For example, take the first employee
          const firstEmployee = this.employees[0];
          console.log("First Employee ID:", firstEmployee.name_id);

          // Fetch more data for that employee
          const employeeDetails = await axios.get(`${API_BASE_URL}/get_employees_json/${firstEmployee.name_id}`);
          console.log("Employee details:", employeeDetails.data);

          // Store employee ID
          this.employee_id = firstEmployee.name_id;
        }

        console.log("Employees fetched:", this.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
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

    money(val) {
      return new Intl.NumberFormat("en-PH", {
        minimumFractionDigits: 2,
      }).format(val);
    },
  },
};
</script>
<style></style>

<style scoped>
/* PAPER */

.print-page {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 100%;
  width: 2000px;
  gap: 8px;
}

/* PAYSLIP */
.payslip {
  border: 1px dashed black;
  padding: 6px;
  font-size: 10px;
  box-sizing: border-box;
}

/* HEADER */
.header {
  text-align: center;
  margin-bottom: 4px;
}

/* INFO */
.info {
  font-size: 10px;
  margin-bottom: 5px;
}

/* TABLES */
table {
  width: 100%;
  border-collapse: collapse;
}

table,
th,
td {
  padding: 2px 5px;
  font-size: 8px;
}

table td:first-child,
table th:first-child {
  width: 70%;
  text-align: left;
}

table td:last-child,
table th:last-child {
  width: 30%;
  text-align: right;
}
.deductions{
  font-weight: bold;
  font-size:12px;
}

/* NET PAY */
.net {
  text-align: right;
  font-weight: bold;
  font-size: 11px;
}

#footer {
  text-align: center; /* Center everything */
  margin-top: 20px;
  font-size: 10px;
  line-height: 1.2;
}

#footer .name_id {
  font-weight: bold; /* Make name_id bold */
  font-size: 10px;
  text-align: center;
}
#footer .par {
  text-align: center;
  font-size: 10px;
}

@media print {
  body {
    margin: 0;
  }
}

.print-page {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 payslips per row */
  height: 100%;
  gap: 8px;
  page-break-inside: avoid; /* optional: prevent splitting a payslip across pages */
}
</style>
