<script setup>
import { onMounted, ref, watch } from "vue";
import { API_BASE_URL } from "@/config";
import axios from "axios";

const updateDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // Capture the current time once when the form opens
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0"); // Seconds captured once

  dateTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  form.value.date = dateTime.value;
};

const form = ref({
  name_id: "",
  division_id: "",
  date: "", // Format the date here
  documents: [],
});
const dateTime = ref("");
const otherDocumentText = ref(""); // New ref for the "Others" input text
const selectedName = ref(null);
const division = ref("");
const names = ref([]);
const employees = ref([]);
const divisions = ref([]);
const pleaseWait = ref(false);
const loading = ref(false);
const formDisable = ref(false);
const documents = ref([
  { name: "PURCHASE REQUEST - REQUISITION AND ISSUE SLIP", checked: false },
  { name: "CERTIFICATE OF EMPLOYMENT WITH COMPENSATION", checked: false },
  { name: "INVENTORY CUSTODIAN SLIP", checked: false },
  { name: "PROPERTY ACKNOWLEDGEMENT RECEIPT", checked: false },
  { name: "GATE PASS", checked: false },
  { name: "PO FUEL", checked: false },
  { name: "PROPERTY RETURN SLIP", checked: false },
  { name: "R&M OF MOTOR VEHICLES", checked: false },
  {
    name: "JOB ORDER FOR FURNITURE & FIXTURES, LIGHTINGS, PLUMBING, & A/C",
    checked: false,
  },
  { name: "OTHERS", checked: false },
]);

const nameid = ref(localStorage.getItem("nameId"));

// Watch for changes in otherDocumentText and capitalize it
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
      fetchSelectedEmployee(); // Fetch the employee details
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
  // Clear the documents array first
  form.value.documents = [];

  // Include the "Others" document if specified
  // Check if the "Others" document exists and update its name if specified
  if (otherDocumentText.value) {
    const othersDocument = documents.value.find((doc) => doc.name === "OTHERS");
    if (othersDocument) {
      othersDocument.name = otherDocumentText.value; // Update the name
    }
  }

  console.log(form.value.documents);

  console.log(otherDocumentText.value);
  // Filter checked documents
  form.value.documents = documents.value
    .filter((doc) => doc.checked)
    .map((doc) => ` ${doc.name}`);
  // .map(doc => ({'document_name': doc.name, name_id: null, datetime: null}));

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
      `${API_BASE_URL}/FADRFsubmit_request`,
      form.value
    );

    // Check if the response status is not OK (2xx)
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
  updateDateTime();
});
</script>

<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit">
      <h2 class="title">REQUEST SLIP FORM</h2>
      <h4 class="subtitle">(Administrative Section - Procurement/Property)</h4>

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
          <input type="text" id="division" v-model="division" readonly />
        </div>
        <div class="info-item">
          <label for="dateToday">Date & Time:</label>
          <input type="text" id="dateToday" v-model="dateTime" readonly />
        </div>
      </div>
      <table class="request-table">
        <thead>
          <tr>
            <th>DOCUMENT REQUESTED</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(doc, index) in documents" :key="doc.name">
            <td>
              <label class="container">
                <input
                  type="checkbox"
                  :id="`document-${index}`"
                  v-model="doc.checked"
                />
                <svg viewBox="0 0 64 64" height="2em" width="2em">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    class="path"
                  ></path>
                </svg>
                <span>{{ doc.name }}</span>
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
</template>

<style scoped>
.form-container {
  margin: 2em auto;
  font-family: "Poppins", sans-serif;
  flex-direction: column;
  width: 90%;
  max-width: 900px;
  background: linear-gradient(145deg, #fef6e4, #dac08c);
  padding: 60px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

.others-input {
  margin-top: 10px;
  width: 100%;
  padding: 8px;
  border: 1px solid #8b5e34;
  border-radius: 5px;
}

.info-item {
  margin: 18px;
}

select {
  padding: 5px;
  font-size: 16px;
}

select,
input {
  font-size: 15px;
  padding: 15px;
}

.title,
.subtitle {
  text-align: center;
  font-size: 4px;
  font-weight: bold;
  color: #8b5e34;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #000000;
  text-transform: uppercase;
  margin-bottom: 10px;
  letter-spacing: 1px;
  position: relative;
}

.title::after {
  content: "";
  display: block;
  width: 100%;
  height: 4px;
  background: #000000; /* Darker accent */
  margin: 10px auto;
  border-radius: 2px;
}

.subtitle {
  font-size: 18px;
  font-weight: normal;
  color: #000000;
  margin-bottom: 20px;
}

input[type="text"],
select {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border: 2px solid #8b5e34;
  border-radius: 8px;
  background-color: #fffaf0;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
}

input[type="text"]:focus,
select:focus {
  border-color: #d2691e;
  background-color: #fff;
  outline: none;
  box-shadow: 0 0 10px rgba(210, 105, 30, 0.5);
}

label {
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 8px;
  display: block;
}

.request-table {
  width: 100%;
  border-collapse: collapse;
  color: #020100;
}

.request-table th,
.request-table td {
  padding: 8px;
  text-align: left;
}

.request-table input[type="time"],
.request-table input[type="date"] {
  width: 100%;
  padding: 5px;
  border-radius: 4px;
}

.request-table th,
.request-table tb {
  width: 100%;
  padding: 50px;
  text-align: center;
  border-radius: 4px;
}

.request-table th,
.request-table tb {
  height: 100px;
}

label {
  font-size: 1.1em;
  color: #555;
  margin-bottom: 0.5em;
  font-weight: 600;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

button {
  padding: 18px 40px;
  font-size: 18px;
  font-weight: 700;
  background-color: #773c00;
  color: rgb(255, 255, 255);
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 10px 30px rgba(243, 156, 18, 0.3);
  font-family: "Playfair Display", serif;
  margin-left: 40%;
}

button:hover {
  background-color: #783c00;
  transform: translateY(-3px);
}

.error {
  width: fit-content;
  justify-self: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #f8a837;
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 0px 0px 4px #f8a837, 0px 0px 3px #f8a837 inset;
}

.formcorrect {
  top: 0;
  left: 0;
  width: fit-content;
  justify-self: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #39b259;
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 0px 0px 4px #39b259, 0px 0px 3px #39b259 inset;
}

.formcorrect1,
.formcorrect2 {
  color: black;
  font-weight: bold;
}

.errormsg1 {
  height: 20px;
  width: 100%;
  text-align: center;
  color: black;
  font-weight: bold;
}

.errormsg {
  height: 20px;
  width: 100%;
  text-align: center;
  font-weight: bold;
}

.loadid {
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 8px;
}

.loader {
  display: flex;
  --height-of-loader: 4px;
  --loader-color: black;
  width: 285px;
  height: 4px;
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
  margin-top: 10px;
}

.loader::before {
  content: "";
  position: absolute;
  background: var(--loader-color);
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  border-radius: 30px;
  animation: moving 1s ease-in-out infinite;
}

@keyframes moving {
  50% {
    width: 100%;
  }
  100% {
    width: 0;
    right: 0;
    left: unset;
  }
}

.container {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin-left: -70px;
}

.container input {
  display: none;
}

.container svg {
  width: 2em;
  height: 2em;
  fill: none;
  stroke: #007bff; /* Color for the outline */
  stroke-width: 6;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
}

.container .path {
  stroke-dasharray: 241 9999999;
  stroke-dashoffset: 0;
}

.container input:checked ~ svg .path {
  stroke-dasharray: 70.5096664428711 9999999;
  stroke-dashoffset: -262.2723388671875;
}

.container input:checked ~ svg {
  stroke: gray;
}

.container input:checked ~ span {
  color: rgba(121, 83, 14, 0.808);
  font-weight: bold;
  margin-left: 10px;
}

span {
  margin-left: 10px;
  font-size: 1em;
  font-family: Arial, sans-serif;
  color: #333;
}
</style>
