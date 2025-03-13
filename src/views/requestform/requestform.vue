<template>
  <div class="outer">
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <h2 class="title">REQUEST SLIP FORM</h2>
        <h4 class="subtitle">(Administrative Section)</h4>

        <div class="info-container">
          <div class="info-item">
            <label for="name">Name:</label>
            <select
              v-model="selectedName"
              id="name"
              required
              @change="fetchSelectedEmployee"
            >
              <option disabled value="">Select a name</option>
              <option
                v-for="option in names"
                :key="option.name_id"
                :value="option.name_id"
              >
                {{ option.last_name }}, {{ option.first_name }}
                {{ option.middle_init }}
              </option>
            </select>
          </div>
          <div class="info-item">
            <label for="division">Division:</label>
            <input type="text" v-model="division" required readonly />
          </div>
          <div class="info-item">
            <label for="dateToday">Date and Time:</label>
            <input type="text" id="dateToday" v-model="form.date" readonly />
          </div>
        </div>

        <table class="request-table">
          <thead>
            <tr>
              <th>DOCUMENT(S) REQUESTED</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(doc, index) in documents" :key="doc.name">
              <td>
                <label>
                  <input type="checkbox" v-model="doc.checked" />
                  {{ doc.name }}
                </label>
                <input
                  v-if="doc.name === 'OTHERS' && doc.checked"
                  type="text"
                  v-model="otherDocumentText"
                  placeholder="Please specify..."
                  class="others-input"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div class="button-container">
          <button type="submit" :disabled="formDisable">Submit</button>
        </div>

        <div v-if="pleaseWait" class="formcorrect">
          <p>Submitted!! Please wait for a moment...</p>
        </div>
        <div v-else-if="loading" class="loading">
          <div class="loader"></div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { API_BASE_URL } from "@/config";

// Reactive references
const form = ref({
  name_id: "",
  division_id: "",
  date: "", // Format the date here
  documents: [],
});

const otherDocumentText = ref("");
const selectedName = ref("");
const division = ref("");
const names = ref([]);
const employees = ref([]);
const divisions = ref([]);
const pleaseWait = ref(false);
const loading = ref(false);
const formDisable = ref(false);
const documents = ref([
  { name: "SERVICE RECORD", checked: false },
  { name: "CERTIFICATE OF EMPLOYMENT", checked: false },
  { name: "CERTIFICATE OF EMPLOYMENT WITH COMPENSATION", checked: false },
  { name: "OFFICE CLEARANCE", checked: false },
  { name: "LBP BC LIST", checked: false },
  { name: "CERTIFICATE OF LEAVE CREDITS", checked: false },
  { name: "PHOTOCOPY OF TRAVEL ORDER", checked: false },
  { name: "OTHERS", checked: false },
]);

const nameid = ref(localStorage.getItem("nameId"));

watch(otherDocumentText, (newValue) => {
  otherDocumentText.value = newValue.toUpperCase(); // Automatically capitalize the input
});

const fetchData = async () => {
  try {
    const [namesRes, employeesRes, divisionsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/get_names_json/`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/get_employees_json/`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/get_divisions_json/`).then((res) => res.json()),
    ]);

    if (parseInt(nameid.value) === nameid.value) {
      names.value = namesRes;
    } else {
      
      names.value = namesRes.filter(
        (name) => name.name_id === parseInt(nameid.value)
      );
    }

    employees.value = employeesRes;
    divisions.value = divisionsRes;

   
    if (names.value.length > 0) {
      selectedName.value = names.value[0].name_id;
      fetchSelectedEmployee(); 
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchSelectedEmployee = () => {
  const selectedEmployee = employees.value.find(
    (emp) => emp.name_id === selectedName.value
  );
  if (selectedEmployee) {
    form.value.name_id = selectedName.value;
    form.value.division_id = selectedEmployee.division_id;
    division.value = findDivisionName(selectedEmployee.division_id);
  } else {
    form.value.name_id = "";
    form.value.division_id = "";
    division.value = "";
  }
};

const findDivisionName = (divisionId) => {
  const divisionItem = divisions.value.find(
    (div) => div.division_id === divisionId
  );
  return divisionItem ? divisionItem.division_name : "";
};

const handleSubmit = async () => {
  console.log(documents.value);
  console.log(form.value.documents);

  if (otherDocumentText.value) {
    const othersDocument = documents.value.find((doc) => doc.name === "OTHERS");
    if (othersDocument) {
      othersDocument.name = otherDocumentText.value; // Update the name
    }
  }

  form.value.documents = documents.value
    .filter((doc) => doc.checked)
    .map((doc) => ` ${doc.name}`);

  if (
    !form.value.name_id ||
    !form.value.division_id ||
    form.value.documents.length === 0 
  ) {
    alert("Please fill all required fields and select at least one document.");
    return;
  }

  console.log(form.value);
  pleaseWait.value = true;
  loading.value = true;
  formDisable.value = true;

  try {
    const response = await axios.post(
      `${API_BASE_URL}/submit_request`,
      form.value
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to submit request");
    }

    alert("Request submitted successfully!");
    form.value.documents = [];
    documents.value.forEach((doc) => (doc.checked = false));
  } catch (error) {
    console.error("Submission error:", error);
    alert("Error submitting request. Please try again.");
  } finally {
    pleaseWait.value = false;
    loading.value = false;
    formDisable.value = false;
  }
};

// Function to format the date
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  form.value.date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  fetchData();
  formatDate(new Date());
});
</script>

<style scoped>
body {
  font-family: "Arial", sans-serif;
  background-color: #f3e8d3; /* Soft beige */
  margin: 0;
  padding: 0;
  color: #3b3a30; /* Dark brown for contrast */
}

.outer {
  display: flex;
  justify-content: center;
}

.form-container {
  width: 95%;
  max-width: 800px;
  padding: 25px;
  background: #fdf8ee; /* Light cream */
  border-radius: 15px;
  border: 1px solid #b5a78a; /* Subtle brown border */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

.title,
.subtitle {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.form-group {
  flex: 1;
  min-width: 220px;
  margin-bottom: 20px;
}

label {
  font-size: 18px;
  font-weight: bold;
  color: #3b3a30;
  margin-bottom: 6px;
  display: block;
}

/* Table Styling */
.request-table {
  width: 100%;
  border-collapse: collapse;
}
.request-table th,
.request-table td {
  padding: 10px;
  text-align: left;
  font-size: 18px;
}

.request-table input[type="time"],
.request-table input[type="date"] {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border-radius: 6px;
}

/* Input fields */
input,
select {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border: 1px solid #b5a78a;
  border-radius: 6px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  background: #fff;
}

input[type="checkbox"] {
  width: auto;
}

input {
  border: none;
  border-bottom: 2px solid #6d6c6c;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 18px;
  padding: 8px;
}

/* Buttons */
button {
  padding: 12px 24px;
  font-size: 20px;
  font-weight: bold;
  background-color: #5d6d7e; /* Soft blue-gray */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

button:hover {
  background-color: #3b4a5a;
  transform: translateY(-2px);
}

button.cancel {
  background: #c04c3d; /* Soft red for cancel */
}

button.cancel:hover {
  background: #a33b2d;
}

/* Confirmation Message */
.formcorrect {
  display: flex;
  flex-direction: column;
  border: 2px solid #39b259;
  padding: 12px;
  margin: 15px auto;
  border-radius: 10px;
  box-shadow: 0px 0px 5px #39b259, 0px 0px 3px #39b259 inset;
  font-size: 18px;
}

/* Error Message */
.errormsg,
.errormsg1 {
  height: 24px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  color: #a33b2d;
}

/* Loader */
.loader {
  display: flex;
  width: 300px;
  height: 6px;
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
  margin-top: 12px;
}

.loader::before {
  content: "";
  position: absolute;
  background: black;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  border-radius: 30px;
  animation: moving 1s ease-in-out infinite;
}

@media screen and (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .form-group {
    width: 100%;
  }
}
</style>
