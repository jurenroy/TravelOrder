<template>
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="requested-by">Requested By</label>
          <select id="requested-by" v-model="form.requestedBy" @change="updateDivisionId" required>
            <option value="" disabled>Select a name</option>
            <option v-for="person in sortedNames" :key="person.name_id" :value="person.name_id">
              {{ formatName(person) }}
            </option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="type-of-service">Type of Service</label>
          <select id="type-of-service" v-model="form.typeOfService" required>
            <option value="" disabled>Select a type of service</option>
            <option v-for="option in serviceOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="note">Note</label>
          <textarea id="note" v-model="form.note" required></textarea>
        </div>
        <div v-if="isValid" class="error">
          <a class="errormsg1">Warning Alert!!</a>
          <a class="errormsg">Please Fill out the Text Fields</a>
        </div>
  
        <div v-else-if="pleaseWait" class="formcorrect">
          <a class="formcorrect1">Submitted!!</a>
          <a class="formcorrect1">Please wait for a moment....</a>
        </div>
  
        <div v-else-if="loadis" class="loadid">
          <div class="loader"></div>
        </div>
        <div style="display: flex; align-items: center; justify-content: center;">
            <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/store/auth';

  const authStore = useAuthStore()

  const nameId = authStore.name_id
  
  // Form data
  const form = ref({
    division_id: '',
    typeOfService: '',
    note: '',
    requestedBy: '',
  });
  
  // Names and Employees data
  const names = ref([]);
  const employees = ref([]);

  // Status variables
const isValid = ref(false);
const pleaseWait = ref(false);
const loadis = ref(false);
  
  // Service options
  const serviceOptions = [
    'Installation / repair of new / existing system unit',
    'Installation / repair of new / existing network connection',
    'Installation / repair of new / existing ICT equipment',
    'Uploading of data in website',
    'Others, please specify'
  ];
  
  // Fetch names data from the JSON endpoint
  const fetchNames = async () => {
    try {
      const response = await axios.get('http://202.137.117.84:8011/get_names_json');
      const fetchedNames = response.data;
  
      // Process names: Sort by last name, format in uppercase
      names.value = fetchedNames.filter(name => name.name_id == nameId)
        .map(person => ({
          ...person,
          last_name: person.last_name.toUpperCase(),
          first_name: person.first_name.toUpperCase(),
          middle_init: person.middle_init.toUpperCase() || ''
        }))
        .sort((a, b) => a.last_name.localeCompare(b.last_name));
    } catch (error) {
      console.error('Error fetching names:', error);
    }
  };
  
  // Fetch employee data from the JSON endpoint
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://202.137.117.84:8011/get_employees_json');
      employees.value = response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
  
  // Format name as LAST MIDDLE FIRST
  const formatName = (person) => {
    return `${person.last_name} ${person.first_name} ${person.middle_init}`;
  };
  
  // Update division_id when requestedBy changes
  const updateDivisionId = () => {
    console.log('damn', form.value.division_id, form.value.requestedBy)
    const selectedEmployee = employees.value.find(emp => emp.name_id === form.value.requestedBy);
    if (selectedEmployee) {
      form.value.division_id = selectedEmployee.division_id;
    } else {
      form.value.division_id = ''; // Clear division_id if no employee is selected
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!form.value.requestedBy || !form.value.typeOfService || !form.value.note) {
    isValid.value = true;
    return;
  }

  isValid.value = false;
  pleaseWait.value = true;
  loadis.value = true;
  try {
    // Replace with actual API endpoint and method to submit form data
    const response = await axios.post('http://202.137.117.84:8011/services', form.value);
    console.log('Form submitted successfully:', response.data);
    form.value.requestedBy = ''
    form.value.typeOfService = ''
    form.value.note = ''
    // Reload after successful submission
    setTimeout(() => {
      window.location.reload(); // Or any other action you want to take
    }, 2000); // Adjust delay as needed
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    pleaseWait.value = false;
    loadis.value = false;
  }
};
  
  // Fetch names and employees when component is mounted
  onMounted(() => {
    fetchNames();
    fetchEmployees();
  });
  
  // Computed property for sorted names
  const sortedNames = computed(() => names.value);
  </script>
  
  <style scoped>
  /* Luxurious styles for the ICT Service Request Form view */
  .form-container {
    font-family: 'Roboto', sans-serif;
    flex-direction: column;
    width: 100%;
    max-width: 1000px;
    background: linear-gradient(150deg, #a1834a, #b8860b); /* Gradient from light gold to dark gold */
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    border: 2px solid #000000; 
    margin: auto;
  }
  
  h1 {
    font-family: 'Playfair Display', serif;
    color: #333;
    margin-bottom: 1.5em;
    font-size: 2.5em;
    font-weight: 700;
  }
  
  .form-group {
    margin-bottom: 1.5em;
    display: flex;
    flex-direction: column;
  }
  
  label {
    font-size: 1.1em;
    color: #555;
    margin-bottom: 0.5em;
    font-weight: 600;
  }
  
  .form-group input, textarea {
    padding: 0.75em;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 1em;
    width: 97%;
  }
  .form-group select {
    padding: 0.75em;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 1em;
    width: 100%;
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  button {
    padding: 18px 40px;
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
  ;
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
  @media (max-width: 600px) {
    .form-group input, textarea {
      width: 93%;
    }
    }
  </style>
  