<template>
  <div class="form-container">
    
    <form @submit.prevent="handleSubmit">
      <h2 class="title">REQUEST SLIP FORM</h2>
      <h4 class="subtitle">(Administrative Section - Procurement/Property)</h4>

      <div class="info-container">
        <div class="info-item">
          <label for="name">Name:</label>
          <select v-model="selectedName" id="name" required @change="fetchSelectedEmployee">
            <option disabled value="">Select a name</option>
            <option v-for="option in names" :key="option.name_id" :value="option.name_id">
              {{ option.last_name }}, {{ option.first_name }} {{ option.middle_init }}
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
          <tr v-for="(document, index) in documents" :key="index">
  <td>
    <label class="container">
      <input type="checkbox" :id="`document-${index}`" @change="updateTimeRequested(index, $event.target.checked)" />
      <svg viewBox="0 0 64 64" height="2em" width="2em">
        <path 
          d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" 
          pathLength="575.0541381835938" class="path">
        </path>
      </svg>
      <span>{{ document.name }}</span>
    </label>

    <!-- Show input box when "Others" is checked -->
    <input 
      v-if="document.name === 'Others' && document.checked" 
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
        <button type="submit" :disabled="!isValid">Submit</button>
      </div>
    </form>
  </div>
</template>


<script setup>


import { onMounted, ref } from 'vue';
import { API_BASE_URL } from '@/config';
import axios from 'axios';

// Form data
const dateTime = ref("");

const updateDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');

  // Capture the current time once when the form opens
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0'); // Seconds captured once

  dateTime.value = `${year}/${day}/${month} ${hours}:${minutes}:${seconds}`;
};

// Call updateDateTime only when the form is opened
onMounted(() => {
  updateDateTime();
});

// Reactive variables
const selectedName = ref();
const division_id = ref();
const division = ref();
const names = ref([]);
const employees = ref([]);
const divisions = ref([]);

// Reactive variables for documents
const documents = ref([
  { name: 'Purchase Request - Requisition and Issue Slip', timeRequested: '' },
  { name: 'Inspection and Acceptance Report for items purchased thru Petty Cash', timeRequested: '' },
  { name: 'Inventory Custodian Slip', timeRequested: '' },
  { name: 'Property Acknowledgement Receipt', timeRequested: '' },
  { name: 'Gate Pass', timeRequested: '' },
  { name: 'PO Fuel', timeRequested: '' },
  { name: 'Property Return Slip', timeRequested: '' },
  { name: 'R&M of Motor Vehicles', timeRequested: '' },
  { name: 'Job Order for Furniture & Fixtures, Lightings, Plumbing, & A/C', timeRequested: '' },
  { name: 'Others', timeRequested: '' },
]);

const isValid = ref(false);

// Handle form submission
const handleSubmit = async () => {
  if (!form.value.name_id || !form.value.division_id) {
    isValid.value = false;
    return;
  }
  isValid.value = true;

  try {
    const response = await axios.post('${API_BASE_URL}/submit_request', form.value)
    // Replace with your actual API call
    console.log('Form submitted with:', form.value);
    // Reset form or take other actions
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

const fetchSelectedEmployee = () => {
      if (selectedName.value) {
        const selectedEmployee = employees.value.find(employee => employee.name_id === selectedName.value);
        if (selectedEmployee) {
          division_id.value = selectedEmployee.division_id;
          division.value = findDivisionName(selectedEmployee.division_id);
        } else {
          // Handle case where employee is not found
          division_id.value = null;
          division.value = null;
        }
      } else {
        // Reset values if no name is selected
        division_id.value = null;
        division.value = null;
      }
    };

const findDivisionName = (divisionId) => {
      const divisionItem = divisions.value.find(div => div.division_id === divisionId); // Assuming you have a divisions array
      return divisionItem ? divisionItem.division_name : null;
    };

const fetchData = () => {
  fetch(`${API_BASE_URL}/get_names_json/`)
        .then(response => response.json())
        .then(data => {
          names.value = data;
        })
        .catch(error => {
          console.error('Error fetching employees:', error);
        });

  fetch(`${API_BASE_URL}/get_employees_json/`)
        .then(response => response.json())
        .then(data => {
          employees.value = data;
        })
        .catch(error => {
          console.error('Error fetching employees:', error);
        });

// Fetch divisions data
      fetch(`${API_BASE_URL}/get_divisions_json/`)
        .then(response => response.json())
        .then(data => {
          divisions.value = data;
        })
        .catch(error => {
          console.error('Error fetching divisions:', error);
        });
}

const otherDocumentText = ref("");


const updateTimeRequested = (index, isChecked) => {
  documents.value[index].timeRequested = isChecked ? new Date().toISOString() : '';
  documents.value[index].checked = isChecked; // Track if checkbox is checked

  // Clear "Others" input if unchecked
  if (documents.value[index].name === "Others" && !isChecked) {
    otherDocumentText.value = "";
  }
};


  onMounted(() => {
    fetchData()
  });

</script>


<style scoped>



.form-container {
  margin: 2em auto;
  font-family: 'Poppins', sans-serif;
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

select, input {
  font-size: 15px; /* Increase text size inside input and dropdown */
  padding: 15px; /* Add more padding for better readability */
}

.title, .subtitle {
  text-align: center;
  font-size: 4px; /* Increase font size */
  font-weight: bold;
  color: #8b5e34; /* Elegant brown tone */
  text-transform: uppercase; /* Make it stand out */
  margin-bottom: 10px;
}

/* Add a decorative line under the title */
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
  width: 60%;
  height: 4px;
  background: #000000; /* Darker accent */
  margin: 10px auto;
  border-radius: 2px;
}

/* Subtitle Styling */
.subtitle {
  font-size: 18px;
  font-weight: normal;
  color: #000000;
  margin-bottom: 20px;
}

/* Enhance textboxes */
input[type="text"], select {
  width: 100%; /* Make input fields take full width */
  padding: 12px; /* Increase padding for better usability */
  font-size: 18px; /* Increase font size for better readability */
  border: 2px solid #8b5e34; /* Add a stylish border */
  border-radius: 8px; /* Round the edges */
  background-color: #fffaf0; /* Light background for contrast */
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2); /* Soft shadow for a lifted effect */
  transition: all 0.3s ease-in-out; /* Smooth transition */
}

/* Enhance focus effect */
input[type="text"]:focus, select:focus {
  border-color: #d2691e; /* Darker border on focus */
  background-color: #fff; /* White background on focus */
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

/* Table Styling */
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
font-family: 'Playfair Display', serif;
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
  stroke: #007BFF; /* Color for the outline */
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
  stroke: gray; /* Change color when checked */
}

.container input:checked ~ span {
  color: rgba(121, 83, 14, 0.808); /* Change text color when checked */
  font-weight: bold;
  margin-left: 10px; /* Add space between the checkbox and the label */
}

span {
  margin-left: 10px;
  font-size: 1em;
  font-family: Arial, sans-serif;
  color: #333;
}


</style>
