<script setup>
import { onMounted, ref, watch } from "vue";
import { API_BASE_URL } from "@/config";
import axios from "axios";

const showNotification = ref(false);
const notificationMessage = ref("");

const updateDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0"); 

  dateTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  form.value.date = dateTime.value;
};

const form = ref({
  name_id: "",
  division_id: "",
  date: "", 
  documents: [],
});
const dateTime = ref("");
const otherDocumentText = ref(""); 
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

watch(otherDocumentText, (newValue) => {
  otherDocumentText.value = newValue.toUpperCase();
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
  form.value.documents = [];

  if (otherDocumentText.value) {
    const othersDocument = documents.value.find((doc) => doc.name === "OTHERS");
    if (othersDocument) {
      othersDocument.name = otherDocumentText.value; 
    }
  }

  console.log(form.value.documents);

  console.log(otherDocumentText.value);
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
      `${API_BASE_URL}/FADRFsubmit_request`,
      form.value
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to submit request");
    }

    showNotification.value = true;
    notificationMessage.value = "Request submitted successfully.";
    setTimeout(() => {
      showNotification = false;
    }, 3000);
    form.value.documents = [];
    documents.value.forEach((doc) => (doc.checked = false));
  } catch (error) {
    console.error("Submission error:", error);
    showNotification.value = true;
    notificationMessage.value = "Failed to submit request.";
    setTimeout(() => {
      showNotification = false;
    }, 3000);
  } finally {
    pleaseWait.value = false;
    loading.value = false;
    formDisable.value = false;
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
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
      <div v-if="showNotification" class="notification">
        {{ notificationMessage }}
      </div>
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
      <div class="try">
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

<style src="./CSS/form.css" scoped></style>
