<template>
  <div>
    <button @click="fetchData">Load Payslips</button>

    <!-- Editable Formula/Value Tab (Only shows when a cell is selected) -->
    <div class="value-tab" v-if="currentCellValue">
      <input type="text" v-model="currentCellValue" 
             @input="updateCurrentCell" 
             :placeholder="'Edit cell value'" />
    </div>

    <div class="table-container">
      <table class="excel-table">
        <thead>
          <tr>
            <!-- Only one sticky Name column -->
            <th class="sticky-name">Name</th>
            <th v-for="(col, colIndex) in columns" :key="col" class="sticky-column">
              {{ columnMapping[col] || col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in data" :key="row.id">
            <!-- Sticky Name column -->
            <td class="sticky-name" contenteditable
                @input="updateCell($event, rowIndex, 'name')"
                @keydown="handleArrowKeys($event, rowIndex, -1)"
                @focus="handleCellFocus($event, rowIndex, 'name')"
                @click="handleCellClick($event, rowIndex, 'name')">
              {{ row.name }}
            </td>

            <!-- Table columns excluding the redundant 'name' column -->
            <td v-for="(col, colIndex) in columns" :key="col"
                :contenteditable="!calculatedColumns.includes(col)"
                @input="updateCell($event, rowIndex, col)"
                @keydown="handleArrowKeys($event, rowIndex, colIndex)"
                @focus="handleCellFocus($event, rowIndex, col)"
                @click="handleCellClick($event, rowIndex, col)"
                @dblclick="handleCellDoubleClick($event, rowIndex, col)">
              <!-- Calculated columns -->
              <span v-if="calculatedColumns.includes(col)">
                {{ calculate(row, col).toFixed(2) }}
              </span>
              <span v-else>{{ row[col] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="saveData">Save All</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      data: [],
      columns: [
        "period", "rate", "aca_pera", "subtotal", "gsis", "pagibig", "MP2", "PhilHealth", "wtax", 
        "gsis_conso_loan", "gsis_policy_loan", "gsis_emergency_loan", "gsis_uoli1", "gsis_uoli2", "gsis_uoli_loan1", 
        "gsis_uoli_loan_2", "gsis_housing_loan", "gsis_educational_loan", "gsis_computer_loan", "gsis_mpl", "gsis_gfal", 
        "pagibig_housing_loan", "pagibig_mpl", "lbp_salary_loan", "cola_disallowance", "praise_disallowance", 
        "enrp_mowel", "ucpb_salary_loan", "mgbea10", "total_deductions", "total", "first_cutoff", "second_cutoff", 
        "certify", "certiby", "certipos", "dtrs_id"
      ],
      calculatedColumns: ["subtotal", "total_deductions", "total", "first_cutoff", "second_cutoff"],
      columnMapping: {
        "period": "Period", "rate": "Rate", "aca_pera": "ACA Pera", 
        "subtotal": "Subtotal", "gsis": "GSIS", "pagibig": "Pagibig", "MP2": "MP2", "PhilHealth": "PhilHealth", 
        "wtax": "WTax", "gsis_conso_loan": "GSIS Conso Loan", "gsis_policy_loan": "GSIS Policy Loan", 
        "gsis_emergency_loan": "GSIS Emergency Loan", "gsis_uoli1": "GSIS UOLI1", "gsis_uoli2": "GSIS UOLI2", 
        "gsis_uoli_loan1": "GSIS UOLI Loan1", "gsis_uoli_loan_2": "GSIS UOLI Loan2", "gsis_housing_loan": "GSIS Housing Loan", 
        "gsis_educational_loan": "GSIS Educational Loan", "gsis_computer_loan": "GSIS Computer Loan", 
        "gsis_mpl": "GSIS MPL", "gsis_gfal": "GSIS GFAL", "pagibig_housing_loan": "Pagibig Housing Loan", 
        "pagibig_mpl": "Pagibig MPL", "lbp_salary_loan": "LBP Salary Loan", "cola_disallowance": "COLA Disallowance", 
        "praise_disallowance": "Praise Disallowance", "enrp_mowel": "ENRP Mowel", "ucpb_salary_loan": "UCPB Salary Loan", 
        "mgbea10": "MGBEA10", "total_deductions": "Total Deductions", "total": "Total", "first_cutoff": "First Cutoff", 
        "second_cutoff": "Second Cutoff", "certify": "Certified By", "certiby": "Certify By ID", "certipos": "Certification Type", 
        "dtrs_id": "DTRS ID"
      },
      currentCellValue: "", // Stores the value of the currently focused cell
      currentRowIndex: null, // To track the current focused row
      currentColumn: null, // To track the current focused column
      isEditing: false, // Track if the user is editing a cell
    };
  },
  methods: {
    async fetchData() {
      try {
        const res = await axios.get("http://172.31.10.43:8011/payslip-regular");
        this.data = res.data.map(row => ({
          ...row,
          name: `Employee ${row.name_id}`,
          // Ensure numbers
          rate: Number(row.rate || 0),
          aca_pera: Number(row.aca_pera || 0),
          gsis: Number(row.gsis || 0),
          pagibig: Number(row.pagibig || 0),
          MP2: Number(row.MP2 || 0),
          PhilHealth: Number(row.PhilHealth || 0),
          wtax: Number(row.wtax || 0),
          gsis_conso_loan: Number(row.gsis_conso_loan || 0),
          gsis_policy_loan: Number(row.gsis_policy_loan || 0),
          gsis_emergency_loan: Number(row.gsis_emergency_loan || 0),
          gsis_uoli1: Number(row.gsis_uoli1 || 0),
          gsis_uoli2: Number(row.gsis_uoli2 || 0),
          gsis_uoli_loan1: Number(row.gsis_uoli_loan1 || 0),
          gsis_uoli_loan_2: Number(row.gsis_uoli_loan_2 || 0),
          gsis_housing_loan: Number(row.gsis_housing_loan || 0),
          gsis_educational_loan: Number(row.gsis_educational_loan || 0),
          gsis_computer_loan: Number(row.gsis_computer_loan || 0),
          gsis_mpl: Number(row.gsis_mpl || 0),
          gsis_gfal: Number(row.gsis_gfal || 0),
          pagibig_housing_loan: Number(row.pagibig_housing_loan || 0),
          pagibig_mpl: Number(row.pagibig_mpl || 0),
          lbp_salary_loan: Number(row.lbp_salary_loan || 0),
          cola_disallowance: Number(row.cola_disallowance || 0),
          praise_disallowance: Number(row.praise_disallowance || 0),
          enrp_mowel: Number(row.enrp_mowel || 0),
          ucpb_salary_loan: Number(row.ucpb_salary_loan || 0),
          mgbea10: Number(row.mgbea10 || 0)
        }));
      } catch (err) {
        console.error(err);
        alert("Error fetching data");
      }
    },

    updateCell(e, rowIndex, col) {
      let value = e.target.innerText.trim();
      if (value === "") value = 0; // Auto zero
      if (!this.calculatedColumns.includes(col)) {
        this.data[rowIndex][col] = isNaN(value) ? value : Number(value);
        this.updateCurrentCellValue(value); // Update the value tab when the user updates a cell
      }
    },

    calculate(row, col) {
      const subtotal = row.rate + row.aca_pera; // Subtotal calculation: rate + aca_pera
      const total_deductions = [
        "gsis", "pagibig", "MP2", "PhilHealth", "wtax", "gsis_conso_loan", "gsis_policy_loan", "gsis_emergency_loan", 
        "gsis_uoli1", "gsis_uoli2", "gsis_uoli_loan1", "gsis_uoli_loan_2", "gsis_housing_loan", "gsis_educational_loan", 
        "gsis_computer_loan", "gsis_mpl", "gsis_gfal", "pagibig_housing_loan", "pagibig_mpl", "lbp_salary_loan", 
        "cola_disallowance", "praise_disallowance", "enrp_mowel", "ucpb_salary_loan", "mgbea10"
      ].reduce((acc, key) => acc + (row[key] || 0), 0);

      const total = subtotal - total_deductions;
      const first_cutoff = Math.ceil(total / 2);
      const second_cutoff = total - first_cutoff;

      switch (col) {
        case "subtotal": return subtotal;
        case "total_deductions": return total_deductions;
        case "total": return total;
        case "first_cutoff": return first_cutoff;
        case "second_cutoff": return second_cutoff;
        default: return row[col];
      }
    }
  }
};
</script>

<style>
.table-container {
  max-height: 500px;
  overflow: auto;
  border: 2px solid #ccc;
}

.excel-table {
  border-collapse: collapse;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.excel-table th, .excel-table td {
  border: 1px solid #ddd;
  padding: 6px 8px;
  min-width: 100px;
  text-align: left;
}

.excel-table th {
  position: sticky;
  top: 0;
  background: #f2f2f2;
  z-index: 2;
}

.sticky-name {
  position: sticky;
  left: 0;
  background: #f2f2f2;
  z-index: 3;
}

.excel-table td:focus {
  outline: 2px solid #4a90e2;
  background: #eaf2ff;
}

.value-tab {
  font-size: 16px;
  color: #4a90e2;
  text-align: center;
  margin-bottom: 10px;
  border: 2px solid #4a90e2;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.value-tab input {
  width: 80%;
  border: none;
  text-align: center;
  font-size: 16px;
  padding: 5px;
  outline: none;
  border-radius: 4px;
}

td {
  position: relative;
}

button {
  margin: 10px 0;
  padding: 6px 12px;
  cursor: pointer;
}
</style>