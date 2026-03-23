<template>
  <div>
    <!-- Editable Formula/Value Tab (Only shows when a cell is selected) -->
    <div class="value-tab" v-if="currentCellValue">
      <input type="text" v-model="currentCellValue" @input="updateCurrentCell" :placeholder="'Edit cell value'" />
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
            <td
              class="sticky-name"
              contenteditable
              @input="updateCell($event, rowIndex, 'name')"
              @keydown="handleArrowKeys($event, rowIndex, -1)"
              @focus="handleCellFocus($event, rowIndex, 'name')"
              @click="handleCellClick($event, rowIndex, 'name')"
            >
              {{ getName(row.name) }}
            </td>

            <!-- Table columns excluding the redundant 'name' column -->
            <td
              v-for="(col, colIndex) in columns"
              :key="col"
              :contenteditable="!calculatedColumns.includes(col)"
              @input="updateCell($event, rowIndex, col)"
              @keydown="handleArrowKeys($event, rowIndex, colIndex)"
              @focus="handleCellFocus($event, rowIndex, col)"
              @click="handleCellClick($event, rowIndex, col)"
              @dblclick="handleCellDoubleClick($event, rowIndex, col)"
            >
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
import { API_BASE_URL } from "../../../config";

export default {
  props: {
    receivedData: String, // Assuming the parent is passing `receivedData` as a prop
  },
  data() {
    return {
      names: {},
      data: [],
      columns: [
        "period",
        "rate",
        "aca_pera",
        "subtotal",
        "gsis",
        "pagibig",
        "MP2",
        "PhilHealth",
        "wtax",
        "gsis_conso_loan",
        "gsis_policy_loan",
        "gsis_emergency_loan",
        "gsis_uoli1",
        "gsis_uoli2",
        "gsis_uoli_loan1",
        "gsis_uoli_loan_2",
        "gsis_housing_loan",
        "gsis_educational_loan",
        "gsis_computer_loan",
        "gsis_mpl",
        "gsis_gfal",
        "pagibig_housing_loan",
        "pagibig_mpl",
        "lbp_salary_loan",
        "cola_disallowance",
        "praise_disallowance",
        "enrp_mowel",
        "ucpb_salary_loan",
        "mgbea10",
        "total_deductions",
        "total",
        "first_cutoff",
        "second_cutoff",
        "certify",
        "certiby",
        "certipos",
        "dtrs_id",
      ],
      calculatedColumns: ["subtotal", "total_deductions", "total", "first_cutoff", "second_cutoff"],
      columnMapping: {
        period: "Period",
        rate: "Rate",
        aca_pera: "ACA Pera",
        subtotal: "Subtotal",
        gsis: "GSIS",
        pagibig: "Pagibig",
        MP2: "MP2",
        PhilHealth: "PhilHealth",
        wtax: "WTax",
        gsis_conso_loan: "GSIS Conso Loan",
        gsis_policy_loan: "GSIS Policy Loan",
        gsis_emergency_loan: "GSIS Emergency Loan",
        gsis_uoli1: "GSIS UOLI1",
        gsis_uoli2: "GSIS UOLI2",
        gsis_uoli_loan1: "GSIS UOLI Loan1",
        gsis_uoli_loan_2: "GSIS UOLI Loan2",
        gsis_housing_loan: "GSIS Housing Loan",
        gsis_educational_loan: "GSIS Educational Loan",
        gsis_computer_loan: "GSIS Computer Loan",
        gsis_mpl: "GSIS MPL",
        gsis_gfal: "GSIS GFAL",
        pagibig_housing_loan: "Pagibig Housing Loan",
        pagibig_mpl: "Pagibig MPL",
        lbp_salary_loan: "LBP Salary Loan",
        cola_disallowance: "COLA Disallowance",
        praise_disallowance: "Praise Disallowance",
        enrp_mowel: "ENRP Mowel",
        ucpb_salary_loan: "UCPB Salary Loan",
        mgbea10: "MGBEA10",
        total_deductions: "Total Deductions",
        total: "Total",
        first_cutoff: "First Cutoff",
        second_cutoff: "Second Cutoff",
        certify: "Certified By",
        certiby: "Certify By ID",
        certipos: "Certification Type",
        dtrs_id: "DTRS ID",
      },
      currentCellValue: "", // Stores the value of the currently focused cell
      currentRowIndex: null, // To track the current focused row
      currentColumn: null, // To track the current focused column
      isEditing: false, // Track if the user is editing a cell
    };
  },
  methods: {
    async saveData() {
      try {
        // Prepare the data to send to the backend (make sure to format it correctly if needed)
        const updatedData = this.data.map((row) => ({
          ...row,
          // Ensure only relevant data is sent to the backend, exclude calculated fields
          // If you need to update specific fields, modify this as needed
          period: row.period,
          rate: row.rate,
          aca_pera: row.aca_pera,
          subtotal: row.rate + row.aca_pera,
          gsis: row.gsis,
          pagibig: row.pagibig,
          MP2: row.MP2,
          PhilHealth: row.PhilHealth,
          wtax: row.wtax,
          gsis_conso_loan: row.gsis_conso_loan,
          gsis_policy_loan: row.gsis_policy_loan,
          gsis_emergency_loan: row.gsis_emergency_loan,
          gsis_uoli1: row.gsis_uoli1,
          gsis_uoli2: row.gsis_uoli2,
          gsis_uoli_loan1: row.gsis_uoli_loan1,
          gsis_uoli_loan_2: row.gsis_uoli_loan_2,
          gsis_housing_loan: row.gsis_housing_loan,
          gsis_educational_loan: row.gsis_educational_loan,
          gsis_computer_loan: row.gsis_computer_loan,
          gsis_mpl: row.gsis_mpl,
          gsis_gfal: row.gsis_gfal,
          pagibig_housing_loan: row.pagibig_housing_loan,
          pagibig_mpl: row.pagibig_mpl,
          lbp_salary_loan: row.lbp_salary_loan,
          cola_disallowance: row.cola_disallowance,
          praise_disallowance: row.praise_disallowance,
          enrp_mowel: row.enrp_mowel,
          ucpb_salary_loan: row.ucpb_salary_loan,
          mgbea10: row.mgbea10,
          total_deductions:
            (row.gsis || 0) +
            (row.pagibig || 0) +
            (row.MP2 || 0) +
            (row.PhilHealth || 0) +
            (row.wtax || 0) +
            (row.gsis_conso_loan || 0) +
            (row.gsis_policy_loan || 0) +
            (row.gsis_emergency_loan || 0) +
            (row.gsis_uoli1 || 0) +
            (row.gsis_uoli2 || 0) +
            (row.gsis_uoli_loan1 || 0) +
            (row.gsis_uoli_loan_2 || 0) +
            (row.gsis_housing_loan || 0) +
            (row.gsis_educational_loan || 0) +
            (row.gsis_computer_loan || 0) +
            (row.gsis_mpl || 0) +
            (row.gsis_gfal || 0) +
            (row.pagibig_housing_loan || 0) +
            (row.pagibig_mpl || 0) +
            (row.lbp_salary_loan || 0) +
            (row.cola_disallowance || 0) +
            (row.praise_disallowance || 0) +
            (row.enrp_mowel || 0) +
            (row.ucpb_salary_loan || 0) +
            (row.mgbea10 || 0),
          total:
            row.rate +
            row.aca_pera -
            (row.gsis || 0) +
            (row.pagibig || 0) +
            (row.MP2 || 0) +
            (row.PhilHealth || 0) +
            (row.wtax || 0) +
            (row.gsis_conso_loan || 0) +
            (row.gsis_policy_loan || 0) +
            (row.gsis_emergency_loan || 0) +
            (row.gsis_uoli1 || 0) +
            (row.gsis_uoli2 || 0) +
            (row.gsis_uoli_loan1 || 0) +
            (row.gsis_uoli_loan_2 || 0) +
            (row.gsis_housing_loan || 0) +
            (row.gsis_educational_loan || 0) +
            (row.gsis_computer_loan || 0) +
            (row.gsis_mpl || 0) +
            (row.gsis_gfal || 0) +
            (row.pagibig_housing_loan || 0) +
            (row.pagibig_mpl || 0) +
            (row.lbp_salary_loan || 0) +
            (row.cola_disallowance || 0) +
            (row.praise_disallowance || 0) +
            (row.enrp_mowel || 0) +
            (row.ucpb_salary_loan || 0) +
            (row.mgbea10 || 0),
          certify: row.certify,
          certiby: row.certiby,
          certipos: row.certipos,
        }));

        console.log(updatedData);

        // Send the updated data to the server (adjust the URL to your API endpoint)
        const response = await axios.post("http://172.31.10.43:8011/payslip-regular/update", updatedData);

        // Handle the server response
        if (response.data.success) {
          alert("Data saved successfully!");
        } else {
          alert("Data saved successfully!");
        }
      } catch (err) {
        console.error(err);
        alert("Error occurred while saving data.");
      }
    },
    async fetchData() {
      try {
        const res = await axios.get(`http://172.31.10.43:8011/payslip-regular/period/${this.receivedData}`);
        this.data = res.data.map((row) => ({
          ...row,
          name: row.name_id,
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
          mgbea10: Number(row.mgbea10 || 0),
        }));
      } catch (err) {
        console.error(err);
        alert("Error fetching data");
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
        "gsis",
        "pagibig",
        "MP2",
        "PhilHealth",
        "wtax",
        "gsis_conso_loan",
        "gsis_policy_loan",
        "gsis_emergency_loan",
        "gsis_uoli1",
        "gsis_uoli2",
        "gsis_uoli_loan1",
        "gsis_uoli_loan_2",
        "gsis_housing_loan",
        "gsis_educational_loan",
        "gsis_computer_loan",
        "gsis_mpl",
        "gsis_gfal",
        "pagibig_housing_loan",
        "pagibig_mpl",
        "lbp_salary_loan",
        "cola_disallowance",
        "praise_disallowance",
        "enrp_mowel",
        "ucpb_salary_loan",
        "mgbea10",
      ].reduce((acc, key) => acc + (row[key] || 0), 0);

      const total = subtotal - total_deductions;
      const first_cutoff = Math.ceil(total / 2);
      const second_cutoff = total - first_cutoff;

      switch (col) {
        case "subtotal":
          return subtotal;
        case "total_deductions":
          return total_deductions;
        case "total":
          return total;
        case "first_cutoff":
          return first_cutoff;
        case "second_cutoff":
          return second_cutoff;
        default:
          return row[col];
      }
    },
    handleArrowKeys(e, rowIndex, colIndex) {
      const rowCount = this.data.length;
      const colCount = this.columns.length;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Tab"].includes(e.key)) {
        e.preventDefault(); // Prevent default behavior

        let newRow = rowIndex;
        let newCol = colIndex;

        // Remove the previous tab-focus class from the last focused cell
        const previousCell = this.$el.querySelector(".tab-focus");
        if (previousCell) {
          previousCell.classList.remove("tab-focus");
        }

        // Determine new row and column based on the key pressed
        switch (e.key) {
          case "ArrowUp":
            newRow = Math.max(rowIndex - 1, 0);
            break;
          case "ArrowDown":
            newRow = Math.min(rowIndex + 1, rowCount - 1);
            break;
          case "ArrowLeft":
            newCol = Math.max(colIndex - 1, 0);
            break;
          case "ArrowRight":
            newCol = Math.min(colIndex + 1, colCount - 1);
            break;
          case "Enter":
            newRow = Math.min(rowIndex + 1, rowCount - 1);
            break;
          case "Tab":
            newCol = e.shiftKey ? Math.max(colIndex - 1, 0) : Math.min(colIndex + 1, colCount - 1);
            break;
        }

        // Loop to find the next editable cell for arrow keys and Tab
        const tbody = this.$el.querySelector("tbody");
        let newCell = tbody.rows[newRow].cells[newCol + 1]; // +1 because of the first sticky column

        // If the new cell is not editable, skip it and check the next cell in the row or column
        while (newCell && !newCell.isContentEditable) {
          // Move to the next or previous editable cell (based on key pressed)
          if (e.key === "Tab" || e.key === "ArrowRight") {
            newCol = Math.min(newCol + 1, colCount - 1);
          } else if ((e.key === "Tab" && e.shiftKey) || e.key === "ArrowLeft") {
            newCol = Math.max(newCol - 1, 0);
          } else if (e.key === "ArrowDown") {
            newRow = Math.min(newRow + 1, rowCount - 1);
          } else if (e.key === "ArrowUp") {
            newRow = Math.max(newRow - 1, 0);
          }
          newCell = tbody.rows[newRow].cells[newCol + 1]; // Move to the next/previous editable cell
        }

        // Focus the new editable cell if found
        if (newCell) {
          newCell.focus();
          newCell.classList.add("tab-focus"); // Add tab-focus class to the new cell
          this.selectAllTextInCell(newCell); // Select all text in the cell
        }

        // Update the value tab with the new cell's value
        this.updateCurrentCellValue(newCell.innerText);
      }
    },

    // Helper function to select all text in the cell
    selectAllTextInCell(cell) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(cell); // Select everything in the cell
      selection.removeAllRanges(); // Remove any previous selections
      selection.addRange(range); // Apply the new selection
    },

    handleCellFocus(e, rowIndex, col) {
      // Keep the current value in the input box
      this.currentRowIndex = rowIndex;
      this.currentColumn = col;
      this.updateCurrentCellValue(this.data[rowIndex][col]);
      this.isEditing = false; // Mark as not editing yet
    },

    handleCellClick(e, rowIndex, col) {
      const cell = e.target;
      this.currentRowIndex = rowIndex;
      this.currentColumn = col;
      this.updateCurrentCellValue(this.data[rowIndex][col]);
      this.isEditing = false; // Do not clear content on click
    },

    handleCellDoubleClick(e, rowIndex, col) {
      const cell = e.target;
      this.moveToEndOfCell(cell); // Move focus to the end of the content
      this.isEditing = true; // Start editing when double-clicked
    },

    moveToEndOfCell(cell) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(cell);
      range.collapse(false); // Move to the end
      selection.removeAllRanges();
      selection.addRange(range);
    },

    updateCurrentCellValue(value) {
      if (this.isEditing) {
        this.currentCellValue = value; // Update only when the user is editing
      }
    },
  },
  mounted() {
    this.fetchNames();
    // Listen for global click to hide the value tab
    document.addEventListener("click", this.clickOutside);

    console.log(this.receivedData);
    if (this.receivedData) {
      this.fetchData();
    }
  },

  beforeDestroy() {
    // Clean up event listener
    document.removeEventListener("click", this.clickOutside);
  },
  watch: {
    receivedData() {
      // Whenever receivedData changes, trigger the fetchData method
      this.fetchData();
    },
  },
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
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.excel-table th,
.excel-table td {
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
