<template>
  <div class="container">
    <div class="outer-div">
      <!-- Header row -->
      <div class="header-row">
        <div class="header-item-1">
          <p style="margin-bottom: -10px;">Reference No.: MGB-X-ORD-FO-003</p>
          <p>Effective date: 2024-August-08</p>
        </div>
        <div class="header-item-2">
          <img src="../../assets/mgbx.png" alt="Picture Description" class="header-picture" />
          <div class="header-text">
            <div>Department of Environment and Natural Resources</div>
            <div class="bold">MINES AND GEOSCIENCES BUREAU</div>
            <div>Regional Office No. X</div>
          </div>
        </div>
        <div class="header-item-3">Form Revision No.: 05</div>
      </div>
      
      <!-- Title -->
      <p class="form-title">ICT SERVICE REQUEST FORM</p>
      
      <!-- Service Request No. and Date -->
      <div class="service-info">
        <div class="service-request-no">SERVICE REQUEST NO.: {{ serviceDetails.serviceRequestNo }} - {{ formattedYear }}</div>
        <div class="date">DATE: {{ formattedDate }}</div>
      </div>
      
      <!-- Office/Division -->
      <div class="office-division">OFFICE / DIVISION: {{ divisions.find(d => d.division_id === serviceDetails.division_id)?.division_name || 'Unknown Division' }}</div>
      
      <!-- Type of Service, Notes, and Remarks Table -->
      <table class="service-table">
        <tbody>
          <tr>
            <th class="type-of-service-header">TYPE OF SERVICE</th>
            <th class="notes-header">NOTES</th>
            <th class="remarks-header">REMARKS</th>
          </tr>
        </tbody>
        <tbody>
          <tr v-for="(option, index) in serviceOptions" :key="index">
            <td style="font-size: 9.8px;">
              <input type="checkbox" :checked="serviceDetails.typeOfService === option" />
              {{ option }}
            </td>
            <td  style="font-size: 8px;">{{ serviceDetails.typeOfService === option ? serviceDetails.note || '' : '' }} 
              <!-- Display files with a single download all button -->
              <div v-if="serviceDetails.typeOfService === option">
                <ul>
                  <li v-for="file in serviceDetails.files" :key="file">
                    <a :href="`${API_BASE_URL}/storage/ictrequest/${file}`" target="_blank">
                      {{ file }}
                    </a>
                  </li>
                </ul>
              </div>
            </td>
            <td style="font-size: 9.8px;">{{ serviceDetails.typeOfService === option ? serviceDetails.remarks || 'Pending' : '' }}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Table for Signatories -->
      <table class="service-table">
        <tbody>
          <tr>
            <td  style="font-size: 7.8px; text-align: center;">REQUESTED BY:</td>
            <td  style="font-size: 7.8px; text-align: center;">SERVICED BY:</td>
            <td  style="font-size: 7.8px; text-align: center;"> {{ serviceDetails.remarks === 'Disapproved' ? 'DISAPPROVED BY:' : serviceDetails.remarks === null ? 'NOT YET APPROVED BY:' : 'APPROVED BY:' }}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td v-for="(signatory, index) in signatories" :key="'signature-' + index">
              <div class="signature-container">
                <img :src="`${API_BASE_URL}/storage/${getAccount(signatory.signatureImage)}`" :alt="getAltText(index)" class="signature-image" />
                <span class="signature-label">Signature</span>
              </div>
            </td>
          </tr>
          <!-- Row for Names -->
          <tr>
            <td v-for="(signatory, index) in signatories" :key="'name-' + index">
              <div  style="font-size: 7.8px; text-align: center;">
                {{ !servicedBy && index == 1 ?  'ICT' :getName(signatory.name)}}<br />
                Printed Name 
              </div>
            </td>
          </tr>
          <!-- Row for Designations -->
          <tr>
            <td v-for="(signatory, index) in signatories" :key="'designation-' + index"  style="font-size: 7.8px; text-align: center;">
              <div>
                {{ !servicedBy && index == 1 ?  'ICT' : getPositionName(signatory.name)}}<br />
                Designation
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

// Define props
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

// Service options
const serviceOptions = ref([
  'Installation / repair of new / existing system unit',
  'Installation / repair of new / existing network connection',
  'Installation / repair of new / existing ICT equipment',
  'Uploading of data in website',
  'Others, please specify'
]);

const getAltText = (index) => {
      if (index === 1) {
        return 'Not Serviced Yet';
      } else if (index === 2) {
        return 'Not Approved Yet';
      }
      return 'Signature'; // Default alt text
    };

// Service details for the form
const serviceDetails = ref({
  serviceRequestNo: '',
  date: '',
  division_id: '',
  typeOfService: '',
  note: '',
  remarks: '',
  requestedBy: '',
  approvedBy: '',
  servicedBy: '',
  email: ''
});
const requestedBy = ref('')
const servicedBy = ref('')
const approvedBy = ref('')
const approvedByD = ref('')

// Fetch service details by ID
const fetchServiceDetails = async (reference) => {

  try {
     // Get the ID from route params
    const response = await axios.get(`${API_BASE_URL}/services/${reference}`);
    serviceDetails.value = response.data;
    console.log(serviceDetails.value.requestedBy)
    requestedBy.value = serviceDetails.value.requestedBy
    servicedBy.value = serviceDetails.value.servicedBy
    approvedBy.value = serviceDetails.value.approvedBy
    console.log(serviceDetails.value.division_id)

    const serviceDate = new Date(serviceDetails.value.date); // Get the date from serviceDetails
    console.log(serviceDetails.value.date)
    const changeDate = new Date('2025-09-01'); // The threshold date for the change

    // Set value based on serviceDetails.date
    if (serviceDate < changeDate) {
      approvedByD.value = 36;
    } else {
      approvedByD.value = 66;
    }
  } catch (error) {
    console.error('Error fetching service details:', error);
  }
};

// Fetch names and divisions
const names = ref([]);
const divisions = ref([]);
const positions = ref([]);
const employees = ref([]);
const accounts = ref([]);

const fetchNamesAndDivisions = async () => {
  try {
    const namesResponse = await axios.get(`${API_BASE_URL}/get_names_json`);
    // names.value = namesResponse.data;
    // Process names: Sort by last name, format in uppercase
    names.value = namesResponse.data
      .map(person => ({
        ...person,
        last_name: person.last_name.toUpperCase(),
        first_name: person.first_name.toUpperCase(),
        middle_init: person.middle_init.toUpperCase() || ''
      }))
      .sort((a, b) => a.last_name.localeCompare(b.last_name));

    const divisionsResponse = await axios.get(`${API_BASE_URL}/get_divisions_json`);
    divisions.value = divisionsResponse.data;

    const positionsResponse = await axios.get(`${API_BASE_URL}/get_positions_json`);
    positions.value = positionsResponse.data;

    const employeesResponse = await axios.get(`${API_BASE_URL}/get_employees_json`);
    employees.value = employeesResponse.data;
    
    const accountsResponse = await axios.get(`${API_BASE_URL}/get_accounts_json`);
    accounts.value = accountsResponse.data;

  } catch (error) {
    console.error('Error fetching names and divisions:', error);
  }
};

// Get position name by employee ID
const getPositionName = (nameId) => {
  if (!nameId) return nameId;

  // Find the employee by ID
  const employee = employees.value.find(emp => emp.name_id === nameId.value);

  if (employee) {
    // Find the position by position_id from the employee
    const position = positions.value.find(pos => pos.position_id === employee.position_id);

    return position ? position.position_name : 'Unknown Position';
  }
  
  return 'Invalid Fosition';
};

// Get name by employee ID
const getName = (nameId) => {
  const name = names.value.find(name => name.name_id === nameId.value);
  if (name) {
    return `${name.first_name} ${name.middle_init} ${name.last_name}`;
  }
  return 'Invalid Ferson';
};

// Get name by employee ID
const getAccount = (nameId) => {
  console.log(nameId.value)
  const account = accounts.value.find(account => account.name_id === nameId.value);
  console.log(account)
  if (account) {
    return `${account.signature}`;
  }
  return 'invalid siga';
};

// Format the date to be more readable
const formattedDate = computed(() => {
  const date = new Date(serviceDetails.value.date);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Format the date to be more readable
const formattedYear = computed(() => {
  const date = new Date(serviceDetails.value.date);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
  });
});

// Define the signatories array with type, name, designation, and signature
const signatories = [
  {
    type: 'request',
    name: requestedBy,
    designation: requestedBy,
    signature: requestedBy,
    signatureImage: requestedBy
  },
  {
    type: 'service',
    name: servicedBy,
    designation: servicedBy,
    signature: servicedBy,
    signatureImage: servicedBy
  },
  {
    type: 'approve',
    name: approvedByD,
    designation: approvedByD,
    signature: approvedBy,
    signatureImage: approvedBy
  }
];
// Watch for changes in the id prop
watch(() => props.id, (newId) => {
  fetchServiceDetails(newId); // Fetch new service details
});

// Fetch service details when component is mounted
// Fetch service details and names/divisions when component is mounted
onMounted(() => {
  fetchServiceDetails(props.id); // Fetch new service details
  fetchNamesAndDivisions();
});

</script>
  
  <style scoped>
  /* Fixed dimensions to match the bond paper size */
  .container {
    padding: 1em;
    width: 8.5in; /* Full width of a bond paper */
    height: auto; /* Half of the height of a bond paper */
    margin: 0 auto;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
    margin-top: -10px;
  }
  
  .outer-div {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1em;
    height: 100%; /* Full height of the container */
    overflow: auto; /* Allow scrolling if content overflows */
    display: flex;
    flex-direction: column;
  }
  
  /* Header Row */
  .header-row {
    display: flex;
    justify-content: space-between;
  }
  
  .header-item-1 {
    flex: 1;
    text-align: left;
    padding: 0.5em;
    font-size: 8px;
  }
  .header-item-2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  margin-left: -70px;
}

.header-picture {
  max-width: 70px; /* Adjust as necessary */
  height: auto;
}

.header-text {
  font-size: 9px;
}

.header-text .bold{
  font-weight: bold;
  color: rgb(27, 135, 185);
  font-size: 11px;
}

  .header-item-3 {
    flex: 1;
    text-align: right;
    padding: 0.5em;
    font-size: 8px;
  }
  
  /* Title */
  .form-title {
    text-align: center;
    font-weight: bold;
  }
  
  /* Service Request No. and Date Section */
  .service-info {
    display: flex;
    font-size: 11px;
    font-weight: bold;
  }
  
  .service-request-no {
    flex: 7; /* 70% of the space */
    padding: 0.5em;
    border: 1px solid #000000;
    height: fit-content;
    text-align: left;
  }
  
  .date {
    flex: 3; /* 30% of the space */
    padding: 0.5em;
    border: 1px solid #000000;
    border-left: #ffffff;
    height: fit-content;
    text-align: left;
  }
  
  /* Office/Division Section */
  .office-division {
    padding: 0.5em;
    border: 1px solid #000000;
    border-top: #ffffff;
    text-align: left;
    margin-bottom: 0.3rem;
    height: fit-content;
    font-size: 11px;
    font-weight: bold;
  }
  
  
 /* Table Styling */
.service-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
  background-color: white;
}

.service-table th, .service-table td {
  border: 1px solid #000;
  padding: 0.5em;
  text-align: left;
}

.service-table th {
  font-weight: bold;
  font-size: 12px;
  text-align: center;
}
/* Column Widths */
.type-of-service-header {
  width: 36%;
}

.notes-header {
  width: 50%;
}

.remarks-header {
  width: 10%;
}

  /* Table for Grid Section */
.grid-table {
  width: 100%; /* Full width of the container */
  border-collapse: collapse; /* Collapse borders for a cleaner look */
  font-size: 7px; /* Font size for table text */
  margin-top: 5px;
}

.grid-table th, .grid-table td {
  border: 1px solid #000000; /* Border around table cells */
  text-align: center; /* Center align text */
  vertical-align: top; /* Align text to the top of the cell */
}
.grid-table th{
  font-weight: normal;
}

.signature-container {
  text-align: center; /* Center align both image and label */
  margin-top: -10px;
  margin-bottom: -10px;
}

.signature-image {
  display: block; /* Ensure image is on its own line */
  margin: 0 auto 0.5em; /* Center image and add space below it */
  height: 40px; /* Maintain aspect ratio */
  width: auto;
  z-index: 10;
  margin-bottom: -15px;
}

.signature-label {
  display: block; /* Ensure label is on its own line */
  margin: 0 auto; /* Center label */
  font-size: 8px; /* Adjust font size if needed */
}

/* Ensure equal column width */
.grid-table th, .grid-table td {
  width: 33.33%; /* Each column takes up an equal width of the table */
}


  </style>
  