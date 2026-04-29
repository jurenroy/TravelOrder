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
        "rate",
        "aca_pera",
        "step",
        "subtotal",
        "gsis",
        "gsis_premium",
        "pagibig",
        "MP2",
        "PhilHealth",
        "overpayment",
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
        "gsis_mpl_lite",
        "gsis_gfal",
        "pagibig_housing_loan",
        "pagibig_mpl",
        "pagibig_heal",
        "lbp_salary_loan",
        "cola_disallowance",
        "praise_disallowance",
        "maternity_disallowance",
        "enrp_mowel",
        "ucpb_salary_loan",
        "mgbea10",
        "alimony",
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
        step: "Step Increment",
        subtotal: "Subtotal",
        gsis: "GSIS",
        gsis_premium: "GSIS Premium",
        pagibig: "Pagibig",
        MP2: "MP2",
        PhilHealth: "PhilHealth",
        overpayment: "Overpayment",
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
        gsis_mpl_lite: "GSIS MPL Lite",
        gsis_gfal: "GSIS GFAL",
        pagibig_housing_loan: "Pagibig Housing Loan",
        pagibig_mpl: "Pagibig MPL",
        pagibig_heal: "Pagibig HEAL",
        lbp_salary_loan: "LBP Salary Loan",
        cola_disallowance: "COLA Disallowance",
        praise_disallowance: "Praise Disallowance",
        maternity_disallowance: "Maternity Disallowance",
        enrp_mowel: "ENRP Mowel",
        dbp_salary_loan: "DBP Salary Loan",
        ucpb_salary_loan: "UCPB Salary Loan",
        mgbea10: "MGBEA10",
        alimony: "Alimony",
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
    handleCSVUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      Papa.parse(file, {
        header: false, // We'll handle headers manually
        skipEmptyLines: true,
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
      if (!rows || !rows.length) return;

      const period = this.receivedData || "March 1-31, 2026";
      console.log("Raw CSV rows:", rows);

      // Skip header rows: assuming first 3 rows are headers
      const dataRows = rows.slice(3);

      const toNum = (val) => {
        if (!val || val.trim() === "" || val === "-") return 0;
        return (
          Number(
            String(val)
              .replace(/,/g, "")
              .replace(/[^\d.-]/g, ""),
          ) || 0
        );
      };

      // Helper: robust name matcher
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

        // System name contains both first and last somewhere
        return sysParts.includes(lastNameCsv) && sysParts.includes(firstNameCsv);
      };

      dataRows.forEach((csvRow) => {
        const csvName = csvRow[2].trim();

        // Find existing row by robust name matching
        const existingRow = this.data.find((row) => {
          const systemFullName = row.name ? this.getName(row.name) : "";
          return matchNames(csvName, systemFullName);
        });

        if (existingRow) {
          // Merge CSV values into the existing row without touching dtrs_id
          existingRow.period = period;
          existingRow.rate = toNum(csvRow[3]);
          existingRow.aca_pera = toNum(csvRow[4]);
          existingRow.step = toNum(csvRow[5]);
          existingRow.gross_amount = toNum(csvRow[6]);
          existingRow.gsis_premium = toNum(csvRow[10]);
          existingRow.pagibig = toNum(csvRow[11]);
          existingRow.MP2 = toNum(csvRow[12]);
          existingRow.PhilHealth = toNum(csvRow[13]);
          existingRow.overpayment = toNum(csvRow[14]);
          existingRow.wtax = toNum(csvRow[15]);

          existingRow.gsis_conso_loan = toNum(csvRow[18]);
          existingRow.gsis_policy_loan = toNum(csvRow[19]);
          existingRow.gsis_emergency_loan = toNum(csvRow[20]);
          existingRow.gsis_uoli1 = toNum(csvRow[21]);
          existingRow.gsis_uoli2 = toNum(csvRow[22]);
          existingRow.gsis_uoli_loan1 = toNum(csvRow[23]);
          existingRow.gsis_uoli_loan2 = toNum(csvRow[24]);
          existingRow.gsis_housing_loan = toNum(csvRow[25]);
          existingRow.gsis_educational_loan = toNum(csvRow[26]);
          existingRow.gsis_gfal = toNum(csvRow[27]);
          existingRow.gsis_computer_loan = toNum(csvRow[28]);
          existingRow.gsis_mpl = toNum(csvRow[29]);
          existingRow.gsis_mpl_lite = toNum(csvRow[30]);

          existingRow.pagibig_housing_loan = toNum(csvRow[31]);
          existingRow.pagibig_mpl = toNum(csvRow[32]);
          existingRow.pagibig_heal = toNum(csvRow[33]);

          existingRow.lbp_salary_loan = toNum(csvRow[34]);
          existingRow.dbp_salary_loan = toNum(csvRow[35]);
          existingRow.ucpb_salary_loan = toNum(csvRow[36]);
          existingRow.mgbea10 = toNum(csvRow[37]);
          existingRow.alimony = toNum(csvRow[38]);

          existingRow.cola_disallowance = toNum(csvRow[39]);
          existingRow.praise_disallowance = toNum(csvRow[40]);
          existingRow.maternity_disallowance = toNum(csvRow[41]);
          existingRow.enrp_mowel = toNum(csvRow[42]);

          existingRow.subtotal = 0;
          existingRow.total_deductions = 0;
          existingRow.total = 0;
          existingRow.first_cutoff = 0;
          existingRow.second_cutoff = 0;

          existingRow.certify = "";
          existingRow.certiby = "";
          existingRow.certipos = "";
        } else {
          // Optionally: add new row if not found
          this.data.push({
            id: this.data.length + 1,
            name: csvName,
            period,
            rate: toNum(csvRow[3]),
            aca_pera: toNum(csvRow[4]),
            step: toNum(csvRow[5]),
            gross_amount: toNum(csvRow[6]),
            dtrs_id: "", // leave blank if not found
            // ...fill other columns as needed
          });
        }
      });

      console.log("Merged CSV data:", this.data);
    },

    mapNameToId(csvName) {
      if (!csvName) return null;

      // Normalize the CSV name: lowercase, remove punctuation, multiple spaces
      const cleanCsvName = csvName
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // Split into parts
      const csvParts = cleanCsvName.split(" ");

      // Try to find by last name first
      const index = this.names.findIndex((n) => {
        const fullName = `${n.first_name} ${n.middle_init || ""} ${n.last_name}`
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        const fullParts = fullName.split(" ");

        // Check if all last name parts exist in CSV parts
        const lastNameParts = n.last_name.toLowerCase().split(" ");
        const lastNameMatch = lastNameParts.every((part) => csvParts.includes(part));

        if (!lastNameMatch) return false;

        // If multiple matches possible, check first name initials
        const firstNameParts = n.first_name.toLowerCase().split(" ");
        return firstNameParts.every((part) => csvParts.includes(part) || csvParts.some((p) => p.startsWith(part[0])));
      });

      // Return the employee index (1-based) or null if not found
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
          rate: row.rate,
          aca_pera: row.aca_pera,
          step: row.step,
          subtotal: row.rate + row.aca_pera,
          gsis: row.gsis,
          gsis_premium: row.gsis_premium,
          pagibig: row.pagibig,
          MP2: row.MP2,
          PhilHealth: row.PhilHealth,
          overpayment: row.overpayment,
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
          gsis_mpl_lite: row.gsis_mpl_lite,
          gsis_gfal: row.gsis_gfal,
          pagibig_housing_loan: row.pagibig_housing_loan,
          pagibig_mpl: row.pagibig_mpl,
          pagibig_heal: row.pagibig_heal,
          lbp_salary_loan: row.lbp_salary_loan,
          cola_disallowance: row.cola_disallowance,
          praise_disallowance: row.praise_disallowance,
          maternity_disallowance: row.maternity_disallowance,
          enrp_mowel: row.enrp_mowel,
          ucpb_salary_loan: row.ucpb_salary_loan,
          mgbea10: row.mgbea10,
          alimony: row.alimony,
          total_deductions:
            (row.gsis || 0) +
            (row.gsis_premium || 0) +
            (row.pagibig || 0) +
            (row.MP2 || 0) +
            (row.PhilHealth || 0) +
            (row.overpayment || 0) +
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
            (row.gsis_mpl_lite || 0) +
            (row.gsis_gfal || 0) +
            (row.pagibig_housing_loan || 0) +
            (row.pagibig_mpl || 0) +
            (row.pagibig_heal || 0) +
            (row.lbp_salary_loan || 0) +
            (row.cola_disallowance || 0) +
            (row.praise_disallowance || 0) +
            (row.maternity_disallowance || 0) +
            (row.enrp_mowel || 0) +
            (row.ucpb_salary_loan || 0) +
            (row.mgbea10 || 0) +
            (row.alimony || 0),
          total:
            row.rate +
            row.aca_pera +
            (row.step || 0) -
            (row.gsis || 0) +
            (row.gsis_premium || 0) +
            (row.pagibig || 0) +
            (row.MP2 || 0) +
            (row.PhilHealth || 0) +
            (row.overpayment || 0) +
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
            (row.gsis_mpl_lite || 0) +
            (row.gsis_gfal || 0) +
            (row.pagibig_housing_loan || 0) +
            (row.pagibig_mpl || 0) +
            (row.pagibig_heal || 0) +
            (row.lbp_salary_loan || 0) +
            (row.cola_disallowance || 0) +
            (row.praise_disallowance || 0) +
            (row.maternity_disallowance || 0) +
            (row.enrp_mowel || 0) +
            (row.ucpb_salary_loan || 0) +
            (row.mgbea10 || 0) +
            (row.alimony || 0),
          certify: 23,
          certiby: 23,
          certipos: "Administrative Officer IV / OIC, Finance Section",
        }));

        console.log(updatedData);

        // Send the updated data to the server (adjust the URL to your API endpoint)
        const response = await axios.post(`${API_BASE_URL}/payslip-regular/update`, updatedData);

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
        const res = await axios.get(`${API_BASE_URL}/payslip-regular/period/${this.receivedData}`);
        this.data = res.data.map((row) => ({
          ...row,
          name: row.name_id,
          // Ensure numbers
          rate: Number(row.rate || 0),
          aca_pera: Number(row.aca_pera || 0),
          step: Number(row.step || 0),
          subtotal: Number(row.subtotal || 0),
          gsis: Number(row.gsis || 0),
          gsis_premium: Number(row.gsis_premium || 0),
          pagibig: Number(row.pagibig || 0),
          MP2: Number(row.MP2 || 0),
          PhilHealth: Number(row.PhilHealth || 0),
          overpayment: Number(row.overpayment || 0),
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
          gsis_mpl_lite: Number(row.gsis_mpl_lite || 0),
          gsis_gfal: Number(row.gsis_gfal || 0),
          pagibig_housing_loan: Number(row.pagibig_housing_loan || 0),
          pagibig_mpl: Number(row.pagibig_mpl || 0),
          pagibig_heal: Number(row.pagibig_heal || 0),
          lbp_salary_loan: Number(row.lbp_salary_loan || 0),
          cola_disallowance: Number(row.cola_disallowance || 0),
          praise_disallowance: Number(row.praise_disallowance || 0),
          maternity_disallowance: Number(row.maternity_disallowance || 0),
          enrp_mowel: Number(row.enrp_mowel || 0),
          ucpb_salary_loan: Number(row.ucpb_salary_loan || 0),
          mgbea10: Number(row.mgbea10 || 0),
          alimony: Number(row.alimony || 0),
          certify: row.certify,
          certiby: row.certiby,
          certipos: row.certipos,
          dtrs_id: row.dtrs_id,
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
      const subtotal = row.rate + row.aca_pera + row.step; // Subtotal calculation: rate + aca_pera
      const total_deductions = [
        "gsis",
        "gsis_premium",
        "pagibig",
        "MP2",
        "PhilHealth",
        "overpayment",
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
        "gsis_mpl_lite",
        "gsis_gfal",
        "pagibig_housing_loan",
        "pagibig_mpl",
        "pagibig_heal",
        "lbp_salary_loan",
        "cola_disallowance",
        "praise_disallowance",
        "maternity_disallowance",
        "enrp_mowel",
        "ucpb_salary_loan",
        "mgbea10",
        "alimony",
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
