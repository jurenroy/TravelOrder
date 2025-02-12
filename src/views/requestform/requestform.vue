<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { API_BASE_URL } from '@/config';

const form = ref({
  name_id: '',
  division_id: '',
  date: '', // Format the date here
  documents: []
  
});

const otherDocumentText = ref('');
const selectedName = ref(null);
const division = ref('');
const names = ref([]);
const employees = ref([]);
const divisions = ref([]);
const pleaseWait = ref(false);
const loading = ref(false);
const formDisable = ref(false);
const documents = ref([
  { name: 'Service Record', checked: false },
  { name: 'Certificate of Employment', checked: false },
  { name: 'Certificate of Employment with Compensation', checked: false },
  { name: 'Office Clearance', checked: false },
  { name: 'LBP BC List ', checked: false },
  { name: 'Certificate of Leave Credits', checked: false },
  { name: 'Photocopy of Travel Order', checked: false },
  { name: 'Others', checked: false }
]);

const fetchData = async () => {
  try {
    const [namesRes, employeesRes, divisionsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/get_names_json/`).then(res => res.json()),
      fetch(`${API_BASE_URL}/get_employees_json/`).then(res => res.json()),
      fetch(`${API_BASE_URL}/get_divisions_json/`).then(res => res.json())
    ]);
    names.value = namesRes;
    employees.value = employeesRes;
    divisions.value = divisionsRes;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const fetchSelectedEmployee = () => {
  const selectedEmployee = employees.value.find(emp => emp.name_id === selectedName.value);
  if (selectedEmployee) {
    form.value.name_id = selectedName.value;
    form.value.division_id = selectedEmployee.division_id;
    division.value = findDivisionName(selectedEmployee.division_id);
  } else {
    form.value.name_id = '';
    form.value.division_id = '';
    division.value = '';
  }
};

const findDivisionName = (divisionId) => {
  const divisionItem = divisions.value.find(div => div.division_id === divisionId);
  return divisionItem ? divisionItem.division_name : '';
};

const handleSubmit = async () => {
  console.log(documents.value)
    // Clear the documents array first
    form.value.documents = [];
  console.log(form.value.documents)
    // Include the "Others" document if specified
    if (otherDocumentText.value) {
        form.value.documents.push(otherDocumentText.value);
    }

    // Filter checked documents
    form.value.documents = documents.value
    .filter(doc => doc.checked)
    .map(doc => (`document: ${doc.name}, name_id: null, datetime: null`));
    // .map(doc => ({'document_name': doc.name, name_id: null, datetime: null}));
  
  if (!form.value.name_id || !form.value.division_id || form.value.documents.length === 0) {
    alert('Please fill all required fields and select at least one document.');
    return;
  }
console.log(form.value);
  pleaseWait.value = true;
  loading.value = true;
  formDisable.value = true;

  try {
    const response = await axios.post(`${API_BASE_URL}/submit_request`, form.value);

    // Check if the response status is not OK (2xx)
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to submit request');
    }

    alert('Request submitted successfully!');
    form.value.documents = [];
    documents.value.forEach(doc => (doc.checked = false));
    
  } catch (error) {
    console.error('Submission error:', error);
    alert('Error submitting request. Please try again.');
  } finally {
    pleaseWait.value = false;
    loading.value = false;
    formDisable.value = false;
  }
};

// Function to format the date
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  form.value.date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
};
onMounted(() => {
  fetchData();
  formatDate(new Date());
});
</script>

<template>
  <div class="outer">
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <h2 class="title">REQUEST SLIP FORM</h2>
        <h4 class="subtitle">(Administrative Section)</h4>

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
        <input type="text" v-model="division" required readonly>
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
            <input v-if="doc.name === 'Others' && doc.checked" v-model="othersText" type="text" placeholder="Specify other document" />
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




<style scoped>
/* Base styles */
body {
  font-family: 'Roboto', sans-serif;
  background-color: #f4f7fc;
  margin: 0;
  padding: 0;
}
.outer{
  display: flex;
  justify-content: center;
  
}

.form-container {
  width: 90%;
  max-width: 1000px;
  padding: 20px;
  background: linear-gradient(30deg, #f9f3e7, #dac08c);
  border-radius: 15px;
  border: 2px solid #000000;      
}

.title, .subtitle {
  text-align: center;
  width: 100%;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.form-group {
  flex: 1;
  min-width: 200px;
  margin-bottom: 20px;
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
}
.request-table th,
.request-table td {
  padding: 8px;
  text-align: LEFT;
}

.request-table input[type="time"],
.request-table input[type="date"] {
  width: 100%;
  padding: 5px;
  border-radius: 4px;
}



input, select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid;
  border-radius: 1px;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

input[type="checkbox"] {
  width: auto;
  
}



input {
  border: none; 
  border-bottom: 1px solid black; 
  outline: none; 
  background: transparent;
  width: 100%; 
  font-size: 16px; 
  padding: 5px; 
}


button {
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 700;
  background-color: #000000;
  color: rgb(255, 255, 255);
  border: solid black 2px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 10px 30px rgba(243, 156, 18, 0.3);
  font-family: 'Playfair Display', serif;
}

button:hover {
  background-color: #6d6c6c;
  transform: translateY(-3px);
}

label{
  margin-top: 20px;

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

.request-table th {
    text-align: center; 
    padding: 15px;
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
;
}


@media screen and (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .form-group {
    width: 100%;
  }
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
  ;
}
</style>
