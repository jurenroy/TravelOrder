<template>
  <div class="outer">
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <h2 class="title">REQUEST SLIP FORM</h2>
        <h4 class="subtitle">(Administrative Section)</h4>
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
            
                <label class="container">
                  <input type="checkbox" v-model="doc.checked" />

                  <svg viewBox="0 0 64 64" height="2em" width="2em">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    class="path"
                  ></path>
                </svg>
                <span> {{ doc.name }}</span>
                </label>
                <input
                style="color: black !important;"
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

const showNotification = ref(false);
const notificationMessage = ref("");

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

  const othersDocument = documents.value.find(doc => doc.name === "OTHERS" && doc.checked);
  if (othersDocument && !otherDocumentText.value) {
    alert("Please specify the document type for 'OTHERS' option.");
    return;
  }

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

    showNotification.value = true;
    notificationMessage.value = "Request submitted successfully!";
    window.location.reload();
    setTimeout(() => {
      showNotification.value = false;
    }, 3000);

    form.value.documents = [];
    documents.value.forEach((doc) => (doc.checked = false));
  } catch (error) {
    console.error("Submission error:", error);

    showNotification.value = true;
    notificationMessage.value = "Error submitting request. Please try again.";
    setTimeout(() => {
      showNotification.value = false;
    }, 3000);

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

<style src="./CSS/form.css" scoped></style>