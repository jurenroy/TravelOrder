<template>
    <div class="container">
      <div class="outer-div">
        <!-- Header row -->
        <div class="headerrow">
          <div class="headeritem2">
            <!-- Picture -->
            <img src="../../assets/mgbx.png" alt="Picture Description" class="header-picture" />

            <!-- Div Container for Text -->
            <div class="header-text">
              <div>Department of Environment and Natural Resources</div>
              <div class="bold">MINES AND GEOSCIENCES BUREAU {{ id }}</div>
              <div>Regional Office No. X</div>
            </div>
          </div>
        </div>

        <!-- Title -->
        <p class="form-title">ICT SERVICE FEEDBACK FORM</p>
        
        <div class="form-description">
          Thank you for giving us the opportunity to serve you better. Please help us improve our service by taking a few minutes to inform us about the technical assistance/service that you have just been provided.
        </div>

        <!-- Evaluation Table -->
        <table class="evaluation-table">
          <thead>
            <tr>
              <th rowspan="2">EVALUATION STATEMENT</th>
              <th colspan="1">Very Satisfied</th>
              <th colspan="1">Satisfied</th>
              <th colspan="1">Dissatisfied</th>
              <th colspan="1">Very Dissatisfied</th>
            </tr>
            <tr>
              <th>4</th>
              <th>3</th>
              <th>2</th>
              <th>1</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(statement, index) in evaluationStatements" :key="index">
              <td>{{ statement.text }}</td>
              <td>
                <span v-if="statement.rating === 4" class="checked">✔</span>
              </td>
              <td>
                <span v-if="statement.rating === 3" class="checked">✔</span>
              </td>
              <td>
                <span v-if="statement.rating === 2" class="checked">✔</span>
              </td>
              <td>
                <span v-if="statement.rating === 1" class="checked">✔</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="signature-box">
            <img :src="`http://202.137.117.84:8011/storage/${getAccount(name_id)}`" :alt="'Signature Image ' + (index + 1)" class="signature-image" />
            <div class="namecont">{{ getName(name_id) }}</div>
            <div class="signz">Signature overprinted name</div>
        </div>
        <div class="date-box">
            <div>{{ formattedDate }}</div>
            <div class="datez">Date signed</div>
        </div>
      </div>
    </div>
    
    
  </template>
  
  <script setup>
  // No specific JavaScript is required for this static layout
  import { ref, computed, onMounted, watch } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';

  // Define props
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

  const route = useRoute();

// Service options
const serviceOptions = ref([
  'Installation / repair of new / existing system unit',
  'Installation / repair of new / existing network connection',
  'Installation / repair of new / existing ICT equipment',
  'Uploading of data in website',
  'Others, please specify'
]);

// Feedback data
const feedback = ref({
  referenceid: '',
  evaluation1: null,
  evaluation2: null,
  evaluation3: null,
  evaluation4: null,
  date: new Date().toISOString().split('T')[0], // Default to today
});

   // Define the signatories array with type, name, designation, and signature
   const signatories = [
    {
      type: 'request',
      name: 'John Doe',
      designation: 'Manager',
      signature: 'Signature1',
      signatureImage: 'path/to/signature1.jpg'
    },
    {
      type: 'service',
      name: 'Jane Smith',
      designation: 'Team Lead',
      signature: 'Signature2',
      signatureImage: 'path/to/signature2.jpg'
    },
    {
      type: 'approve',
      name: 'Emily Davis',
      designation: 'Analyst',
      signature: 'Signature3',
      signatureImage: 'path/to/signature3.jpg'
    }
  ];

// Evaluation statements
const evaluationStatements = ref([]);

const referenceid = ref()
const fdate = ref()

// Function to fetch feedback data
const fetchFeedbackData = async (reference) => {
  try {
    const id = route.params.id; // Get the ID from route params
    const response = await axios.get(`http://202.137.117.84:8011/feedbacks/`);
    const data = response.data.find( det => det.referenceid == reference)
    referenceid.value=data.referenceid
    fdate.value=data.date
    
    fetchServiceData(referenceid);

    // Map the evaluations into the statements
    evaluationStatements.value = [
      { text: 'Quality of Service', rating: data.evaluation1 },
      { text: 'Timeliness', rating: data.evaluation2 },
      { text: 'Professionalism', rating: data.evaluation3 },
      { text: 'Overall Satisfaction', rating: data.evaluation4 }
    ];
  } catch (error) {
    console.error('Error fetching feedback data:', error);
  }
};


const name_id = ref()

// Function to fetch feedback data
const fetchServiceData = async () => {
  try {
    const response = await axios.get(`http://202.137.117.84:8011/services/${referenceid.value}`);
    const data = response.data
    name_id.value=data.requestedBy
  } catch (error) {
    console.error('Error fetching feedback data:', error);
  }
};

const names = ref([]);
const accounts = ref([]);

const fetchNamesAndAccounts = async () => {
  try {
    const namesResponse = await axios.get('http://202.137.117.84:8011/get_names_json');
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
    
    const accountsResponse = await axios.get('http://202.137.117.84:8011/get_accounts_json');
    accounts.value = accountsResponse.data;

  } catch (error) {
    console.error('Error fetching names and divisions:', error);
  }
};

// Get name by employee ID
const getName = (nameId) => {
  const name = names.value.find(name => name.name_id === nameId);
  if (name) {
    return `${name.first_name} ${name.middle_init} ${name.last_name}`;
  }
  return 'Invalid Ferson';
};

// Get name by employee ID
const getAccount = (nameId) => {
  const account = accounts.value.find(account => account.name_id === nameId);
  console.log(account)
  if (account) {
    return `${account.signature}`;
  }
  return 'invalid siga';
};

// Format the date to be more readable
const formattedDate = computed(() => {
  const date = new Date(fdate.value);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Watch for changes in the id prop
watch(() => props.id, (newId) => {
  fetchFeedbackData(newId); // Fetch new service details
});

// Call fetchFeedbackData when the component is mounted
onMounted(() => {
  fetchFeedbackData(props.id);
  fetchNamesAndAccounts();
});
  </script>
  
  <style scoped>
  /* Fixed dimensions to match the bond paper size */
  .container {
    padding: 1em;
    width: 8.5in; /* Full width of a bond paper */
    height: 5.5in; /* Half of the height of a bond paper */
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
  .headerrow {
    display: flex;
    justify-content: center;
  }
  
  .headeritem2 {
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
  
  /* Title */
  .form-title {
    text-align: center;
    font-weight: bold;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  /* Description */
  .form-description {
    text-align: left;
    font-size: 14px;
  }
  /* Evaluation Table */
.evaluation-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1em;
  font-size: 12px;
}

.evaluation-table th, .evaluation-table td {
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
}

.signature-box{
    border: 1px solid #000000;
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: center; /* Center items horizontally */
    justify-content: center; /* Center items vertically */
}

.signature-box img{
    width: auto;
    height: 50px;
    z-index: 1;
}
.signature-box .namecont{
    margin-bottom: -5px;
    margin-top: -20px;
}

.date-box{
    border: 1px solid #000000;
    border-top: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center; /* Center items horizontally */
    justify-content: center; /* Center items vertically */
}

.datez, .signz{
    font-size: 10px;
}



  </style>
  