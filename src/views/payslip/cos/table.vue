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

            <!-- Table columns -->
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

    <input type="file" @change="handleCSVUpload" accept=".csv" />
    <button @click="saveData">Save All</button>
  </div>
</template>

<script>
import axios from "axios";
import Papa from "papaparse";
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
        "days",
        "rate",
        "premium_rate",
        "rate_total",
        "premium_total",
        "premium",
        "additional",
        "subtotal",
        "overpayment",
        "penalty",
        "pass_slip",
        "tax",
        "PhilHealth",
        "PhilHealthDiff",
        "Pagibig",
        "MP2",
        "MPL",
        "MGB_coop_loan",
        "total_deductions",
        "total",
        "certify",
        "certiby",
        "certipos",
      ],
      calculatedColumns: ["rate_total", "premium_total", "premium", "subtotal", "total_deductions", "total"],
      columnMapping: {
        period: "Period",
        days: "Days Worked",
        rate: "Rate",
        premium_rate: "Premium Rate",
        rate_total: "Rate Total",
        premium_total: "Premium Total",
        premium: "Premium",
        additional: "Additional",
        subtotal: "Subtotal",
        overpayment: "Over Payment",
        penalty: "Penalty",
        pass_slip: "Pass Slip",
        tax: "Tax",
        PhilHealth: "PhilHealth",
        PhilHealthDiff: "PhilHealth Diff",
        Pagibig: "Pagibig",
        MP2: "MP2",
        MPL: "MPL",
        MGB_coop_loan: "MGB Coop Loan",
        total_deductions: "Total Deductions",
        total: "Total",
        certify: "Certified By",
        certiby: "Certify By ID",
        certipos: "Certification Type",
      },
      currentCellValue: "", // Stores the value of the currently focused cell
      currentRowIndex: null, // To track the current focused row
      currentColumn: null, // To track the current focused column
      isEditing: false, // Track if the user is editing a cell
    };
  },
  methods: {
    handleCSVUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      Papa.parse(file, {
        skipEmptyLines: false,
        complete: (res) => {
          this.processCSV(res.data);
        },
        error: (err) => {
          console.error("CSV parse error:", err);
          alert("Failed to parse CSV. Check your file.");
        },
      });
    },

    processCSV(rows) {
      const currentPeriod = this.receivedData || "March 16-31, 2026";
      console.log("Raw CSV rows:", rows);

      // Filter valid rows first
      const dataRows = rows.filter((row) => this.isValidRow(row));

      const toNum = (val) => {
        if (!val || val === "-") return 0;
        return (
          Number(
            String(val)
              .replace(/,/g, "")
              .replace(/[^\d.-]/g, ""),
          ) || 0
        );
      };

      // Robust CSV-to-system name matcher
      const matchNames = (csvName, systemName) => {
        if (!csvName || !systemName) return false;

        const clean = (name) =>
          name
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const csvParts = clean(csvName).split(" ");
        const sysParts = clean(systemName).split(" ");

        // CSV format: Last, First Middle
        const lastNameCsv = csvParts[0]; // Last name
        const firstNameCsv = csvParts[1]; // First name

        return sysParts.includes(lastNameCsv) && sysParts.includes(firstNameCsv);
      };

      dataRows.forEach((csvRow) => {
        const csvName = csvRow[0].trim();

        // Find existing row by robust name matching
        const existingRow = this.data.find((row) => {
          const systemFullName = row.name ? this.getName(row.name) : "";
          return matchNames(csvName, systemFullName);
        });

        const days = toNum(csvRow[1]);
        const rate = toNum(csvRow[2]);
        const premiumRate = toNum(csvRow[3]) * 100 || 20;

        if (existingRow) {
          // Merge CSV values without overwriting system-generated IDs
          existingRow.period = currentPeriod;
          existingRow.days = days;
          existingRow.rate = rate;
          existingRow.premium_rate = premiumRate;

          existingRow.additional = toNum(csvRow[7]);
          existingRow.overpayment = toNum(csvRow[9]);
          existingRow.penalty = toNum(csvRow[10]);
          existingRow.pass_slip = toNum(csvRow[11]);

          existingRow.tax = this.findValue(csvRow, "tax");
          existingRow.PhilHealth = this.findValue(csvRow, "philhealth");
          existingRow.PhilHealthDiff = this.findValue(csvRow, "differential");
          existingRow.Pagibig = this.findValue(csvRow, "pag-ibig");
          existingRow.MP2 = this.findValue(csvRow, "mp2");
          existingRow.MPL = this.findValue(csvRow, "mpl");
          existingRow.MGB_coop_loan = this.findValue(csvRow, "coop");

          existingRow.certify = 23;
          existingRow.certiby = "";
          existingRow.certipos = "Administrative Officer IV / OIC, Finance Section";
        } else {
          // Add new row if no match found
          this.data.push({
            id: this.data.length + 1,
            name: csvName,
            period: currentPeriod,
            days,
            rate,
            premium_rate: premiumRate,
            additional: toNum(csvRow[7]),
            overpayment: toNum(csvRow[9]),
            penalty: toNum(csvRow[10]),
            pass_slip: toNum(csvRow[11]),

            tax: this.findValue(csvRow, "tax"),
            PhilHealth: this.findValue(csvRow, "philhealth"),
            PhilHealthDiff: this.findValue(csvRow, "differential"),
            Pagibig: this.findValue(csvRow, "pag-ibig"),
            MP2: this.findValue(csvRow, "mp2"),
            MPL: this.findValue(csvRow, "mpl"),
            MGB_coop_loan: this.findValue(csvRow, "coop"),

            certify: 23,
            certiby: "",
            certipos: "Administrative Officer IV / OIC, Finance Section",
            dtrs_id: "", // leave blank if new
          });
        }
      });

      console.log("Merged COS payslip data:", this.data);
    },

    isValidRow(row) {
      const name = row[0];
      return name && name.includes(",") && !name.includes("Subtotal") && !name.includes("TOTAL") && !name.includes("SERVICES");
    },

    num(val) {
      if (!val) return 0;
      return (
        Number(
          String(val)
            .replace(/,/g, "")
            .replace(/[^\d.-]/g, ""),
        ) || 0
      );
    },

    findValue(row, keyword) {
      const lower = keyword.toLowerCase();
      for (let cell of row) {
        if (typeof cell === "string" && cell.toLowerCase().includes(lower)) {
          return this.num(cell);
        }
      }
      return 0;
    },

    mapNameToId(csvName) {
      if (!csvName) return null;

      const clean = csvName.toLowerCase().replace(/[^a-z ]/g, "");

      const index = this.names.findIndex((n) => {
        const full = `${n.first_name} ${n.middle_init} ${n.last_name}`.toLowerCase().replace(/[^a-z ]/g, "");

        return clean.includes(n.last_name.toLowerCase());
      });

      return index !== -1 ? index + 1 : null;
    },
    async saveData() {
      try {
        // Prepare the data to send to the backend (make sure to format it correctly if needed)
        const updatedData = this.data.map((row) => ({
          ...row,
          // Ensure only relevant data is sent to the backend, exclude calculated fields
          // If you need to update specific fields, modify this as needed
          period: row.period,
          days: row.days,
          rate: row.rate,
          premium_rate: row.premium_rate,
          premium: (row.rate * row.days * row.premium_rate) / 100 / row.days,
          rate_total: row.rate * row.days,
          premium_total: (row.rate * row.days * row.premium_rate) / 100,
          additional: row.additional,
          subtotal: row.rate * row.days + (row.rate * row.days * row.premium_rate) / 100 + (row.additional || 0),
          overpayment: row.overpayment,
          penalty: row.penalty,
          pass_slip: row.pass_slip,
          tax: row.tax,
          PhilHealth: row.PhilHealth,
          PhilHealthDiff: row.PhilHealthDiff,
          Pagibig: row.Pagibig,
          MP2: row.MP2,
          MPL: row.MPL,
          MGB_coop_loan: row.MGB_coop_loan,
          total_deductions:
            (row.overpayment || 0) +
            (row.penalty || 0) +
            (row.pass_slip || 0) +
            (row.tax || 0) +
            (row.PhilHealth || 0) +
            (row.PhilHealthDiff || 0) +
            (row.Pagibig || 0) +
            (row.MP2 || 0) +
            (row.MPL || 0) +
            (row.MGB_coop_loan || 0),
          total:
            row.rate * row.days +
            (row.rate * row.days * row.premium_rate) / 100 +
            (row.additional || 0) -
            (row.overpayment || 0) -
            (row.penalty || 0) -
            (row.pass_slip || 0) -
            (row.tax || 0) -
            (row.PhilHealth || 0) -
            (row.PhilHealthDiff || 0) -
            (row.Pagibig || 0) -
            (row.MP2 || 0) -
            (row.MPL || 0) -
            (row.MGB_coop_loan || 0),
          certify: row.certify,
          certiby: row.certiby,
          certipos: row.certipos,
        }));

        console.log(updatedData);

        // Send the updated data to the server (adjust the URL to your API endpoint)
        const response = await axios.post(`${API_BASE_URL}/payslip-cos/update`, updatedData);

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
        const res = await axios.get(`${API_BASE_URL}/payslip-cos/period/${this.receivedData}`);
        this.data = res.data.map((row) => ({
          ...row,
          name: row.name_id,
          // Ensure numbers
          days: Number(row.days || 0),
          rate: Number(row.rate || 0),
          premium_rate: Number(row.premium_rate || 0),
          additional: Number(row.additional || 0),
          overpayment: Number(row.overpayment || 0),
          penalty: Number(row.penalty || 0),
          pass_slip: Number(row.pass_slip || 0),
          tax: Number(row.tax || 0),
          PhilHealth: Number(row.PhilHealth || 0),
          PhilHealthDiff: Number(row.PhilHealthDiff || 0),
          Pagibig: Number(row.Pagibig || 0),
          MP2: Number(row.MP2 || 0),
          MPL: Number(row.MPL || 0),
          MGB_coop_loan: Number(row.MGB_coop_loan || 0),
          certiby: row.dtrs_id,
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
      const rate_total = row.rate * row.days;
      const premium_rate_decimal = row.premium_rate / 100; // already in decimal
      const premium_total = rate_total * premium_rate_decimal;
      const premium = row.days ? premium_total / row.days : 0;
      const subtotal = rate_total + premium_total + (row.additional || 0);
      const total_deductions =
        (row.overpayment || 0) +
        (row.penalty || 0) +
        (row.pass_slip || 0) +
        (row.tax || 0) +
        (row.PhilHealth || 0) +
        (row.PhilHealthDiff || 0) +
        (row.Pagibig || 0) +
        (row.MP2 || 0) +
        (row.MPL || 0) +
        (row.MGB_coop_loan || 0);
      const total = subtotal - total_deductions;

      switch (col) {
        case "rate_total":
          return rate_total;
        case "premium_total":
          return premium_total;
        case "premium":
          return premium;
        case "subtotal":
          return subtotal;
        case "total_deductions":
          return total_deductions;
        case "total":
          return total;
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
