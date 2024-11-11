<template>
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <div class="form-row">
          <!-- Name Dropdown -->
          <div class="form-group">
            <label for="name">Name {{ form.name }}</label>
            <select v-model="form.name_id" id="name" required>
              <option v-for="option in names" :key="option" :value="option.name_id">{{ option.last_name }}, {{ option.first_name }} {{ option.middle_init }}</option>
            </select>
          </div>
  
          <!-- Date Today (Readonly) -->
          <div class="form-group">
            <label for="dateToday">Date</label>
            <input type="text" id="dateToday" v-model="form.dateToday" readonly />
          </div>
        </div>
  
        <div class="form-row">
          <!-- Position (Readonly) -->
          <div class="form-group">
            <label for="position">Position</label>
            <input type="text" id="position" v-model="position" readonly />
          </div>
  
          <!-- Salary Field -->
          <div class="form-group">
            <label for="salary">Salary</label>
            <input type="text" id="salary" v-model="formattedSalary"  required @input="updateRawSalary" />
          </div>
        </div>
  
        <div class="form-row">
          <!-- Type of Leave Dropdown -->
          <div class="form-group">
            <label for="leaveType">Type of Leave</label>
            <select v-model="form.type" id="leaveType" required @change="updateLeaveDescriptions">
              <option v-for="option in leaveTypes" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
          <div v-if="form.type === 'Others'" class="form-row">
          <div class="form-group">
            <label for="otherPurpose">Other purpose ({{ form.type }})</label>
            <input type="text" id="otherPurpose" v-model="form.otherType" placeholder="Specify other purpose" required/>
          </div>
        </div> 
  
          <!-- Leave Description Dropdown -->
          <div class="form-group" v-if="leaveDescriptions.length > 0">
            <label for="leaveDescription">Leave Description</label>
            <select v-model="form.detail" id="leaveDescription" required>
              <option v-for="option in leaveDescriptions" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
        </div>
  
        <!-- Vacation / Special Privilege Leave Details -->
        <div v-if="form.type === 'Vacation Leave' || form.type === 'Special Privilege Leave'" class="form-row">
          <div class="form-group" v-if="form.detail == 'Within the Philippines'">
            <label for="withinPH">Within the Philippines</label>
            <input type="text" id="withinPH" v-model="form.withinPH" placeholder="Specify location" required/>
          </div>
          <div class="form-group" v-if="form.detail == 'Abroad (Specify)'">
            <label for="abroad">Abroad (Specify)</label>
            <input type="text" id="abroad" v-model="form.abroad" placeholder="Specify country" required/>
          </div>
        </div>
  
        <!-- Sick Leave Details -->
        <div v-if="form.type === 'Sick Leave'" class="form-row">
          <div class="form-group" v-if="form.detail == 'In Hospital (Specify Illness)'">
            <label for="inHospital">In Hospital (Specify Illness)</label>
            <input type="text" id="inHospital" v-model="form.inHospital" placeholder="Specify illness" required/>
          </div>
          <div class="form-group" v-if="form.detail == 'Out Patient (Specify Illness)'">
            <label for="outPatient">Out Patient (Specify Illness)</label>
            <input type="text" id="outPatient" v-model="form.outPatient" placeholder="Specify illness" required/>
          </div>
        </div>
  
        <!-- Special Leave Benefits for Women Details -->
        <div v-if="form.type === 'Special Leave Benefits for Women'" class="form-row">
          <div class="form-group">
            <label for="illness">Specify Illness</label>
            <input type="text" id="illness" v-model="form.illness" placeholder="Specify illness" required/>
          </div>
        </div>  
        <!-- Other Leave Type Details (for "Others") -->
        <div v-if="form.detail === 'Others'" class="form-row">
          <div class="form-group">
            <label for="otherPurpose">Other purpose ({{ form.type }})</label>
            <input type="text" id="otherPurpose" v-model="form.otherPurpose" placeholder="Specify other purpose" required/>
          </div>
        </div>    
  
        <!-- Inclusive Dates -->
        <div class="form-row">
          <div class="form-group">
            <label for="Inclusive Date">Inclusive Date ({{ weekdaysCountWithSuffix }})</label>    
            <!-- Handle single date or date range -->
            <!-- Conditional display for single date range or selected date -->
            <div style="display: flex; flex-direction: row;">
              <div v-if="!isSingleDate && startDate && !endDate && selectedDate" style="display: flex; flex-direction: row; position: absolute;">
              <p style="margin-left: 10px; margin-top: 10px;user-select: none;pointer-events: none; position: relative;">{{formattedDateRange}}</p>
              </div>
            
            <div v-if="!isSingleDate && startDate && endDate" style="display: flex; flex-direction: row; position: absolute;">
              <p style="margin-left: 10px; margin-top: 10px;user-select: none;pointer-events: none; position: relative;">{{formattedDateRange}}</p>
            </div>
              <input type="date" id="date-input" v-model="selectedDate" @change="handleDateChange" style="outline: none; color: transparent; height: fit-content;" required/>
            </div>
          </div>
  
          <!-- Commutation Requested Checkbox -->
          <div class="form-group">
            <label for="commutationRequested">Commutation Requested?</label>
            <select id="commutationRequested" v-model="form.commutation" class="form-control" required>
              <option value="Requested">Requested</option>
              <option value="Not Requested">Not Requested</option>
            </select>
          </div>
        </div>
  
        <!-- Submit Button -->
        <button type="submit" :disabled="formDisable == true">Submit</button>
        <div v-if="pleaseWait" class="formcorrect">
          <a class="formcorrect1">
            Submited!!
          </a>
          <a class="formcorrect1">
            Please wait for a moment....
          </a>
        </div>

        <div v-else-if="loadis" class="loadid">
          <div class="loader"></div>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed, watch } from 'vue';
  import calendar from '../assets/calendar.png'
  import axios from 'axios';
  
  export default {
    name: 'LeaveForm',
    setup() {
      // Form Data
      const form = ref({
        name_id: '',
        position_id: '',
        dateToday: '',
        type: '',
        detail: '',
        dates: '',
        days: '',
        commutation: '',
        applicant: '',
        otherType: '',
        withinPH: '',
        abroad: '',
        inHospital: '',
        outPatient: '',
        illness: '',
        mastersDegree: '',
        boardExam: '',
        studyOther: '',
        otherPurpose: '',
        monetization: '',
        terminalLeave: '',
      });

      const detail = computed(() => {
  let detailString = '';

  

  // Add "Within the Philippines" if applicable
  if (form.value.withinPH) {
    detailString += `Within the Philippines, ${form.value.withinPH}`;
  }

  // Add "Abroad" if applicable
  if (form.value.abroad) {
    if (detailString) detailString += ', '; // Add a comma if there are already entries
    detailString += `Abroad (Specify), ${form.value.abroad}`;
  }

  // Add "In Hospital" if applicable
  if (form.value.inHospital) {
    if (detailString) detailString += ', ';
    detailString += `In Hospital (Specify Illness), ${form.value.inHospital}`;
  }

  // Add "Out Patient" if applicable
  if (form.value.outPatient) {
    if (detailString) detailString += ', ';
    detailString += `Out Patient (Specify Illness), ${form.value.outPatient}`;
  }

  // Add illness if applicable
  if (form.value.illness) {
    if (detailString) detailString += ', ';
    detailString += `Specify Illness, ${form.value.illness}`;
  }

  // Add master's degree completion if applicable
  if (form.value.mastersDegree) {
    if (detailString) detailString += ', ';
    detailString += `Completion of Master's Degree, ${form.value.mastersDegree}`;
  }

  // Add board exam details if applicable
  if (form.value.boardExam) {
    if (detailString) detailString += ', ';
    detailString += `BAR/Board Examination Review, ${form.value.boardExam}`;
  }

  // Add study-related info if applicable
  if (form.value.studyOther) {
    if (detailString) detailString += ', ';
    detailString += `Study Other, ${form.value.studyOther}`;
  }

  // Add other purposes if applicable
  if (form.value.otherPurpose) {
    if (detailString) detailString += ', ';
    detailString += `Other Purpose, ${form.value.otherPurpose}`;
  }

  // Add monetization info if applicable
  if (form.value.monetization) {
    if (detailString) detailString += ', ';
    detailString += `Monetization of Leave Credits, ${form.value.monetization}`;
  }

  // Add terminal leave info if applicable
  if (form.value.terminalLeave) {
    if (detailString) detailString += ', ';
    detailString += `Terminal Leave, ${form.value.terminalLeave}`;
  }

  return detailString;
});

      const position=ref('');
      const formDisable = ref(false);
      const pleaseWait = ref(false);
      const loadis = ref(false);

      // Computed property for formatted salary (with commas)
    const formattedSalary = computed({
      get() {
        return formatNumber(form.value.applicant);
      },
      set(value) {
        // Remove commas and update the raw salary value
        form.value.applicant = value.replace(/[^0-9]/g, '');
      }
    });

    // Method to format the number with commas
    const formatNumber = (number) => {
      if (!number) return '';
      // Add commas to the number (using regex for formatting)
      return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Update the raw salary value (strip commas on input)
    const updateRawSalary = () => {
      // When the user types, strip out any commas
      form.value.applicant = form.value.applicant.replace(/[^0-9]/g, '');
    };

       // Reactive references (equivalent to Vue 2's data)
    const isSingleDate = ref(true);
    const selectedDate = ref('');
    const startDate = ref(null);
    const endDate = ref(null);
    const weekdaysCount = ref(1);

    // Computed property for weekdays count with suffix
    const weekdaysCountWithSuffix = computed({
      get: () => {
        return `${weekdaysCount.value} ${weekdaysCount.value === 1 ? 'Day' : 'Days'}`;
      },
      set: (value) => {
        const count = parseInt(value, 10);
        if (!isNaN(count)) {
          weekdaysCount.value = count;
        }
      }
    });

    // Computed property for formatted date range
    const formattedDateRange = computed(() => {
      if (!startDate.value) return '';

      const start = new Date(startDate.value);
      const end = endDate.value ? new Date(endDate.value) : null;

      const formattedStart = `${start.toLocaleString('en-US', { month: 'long' })} ${start.getDate()}, ${start.getFullYear()}`;

      if (end) {
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
          return `${start.toLocaleString('en-US', { month: 'long' })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
        } else {
          const formattedEnd = `${end.toLocaleString('en-US', { month: 'long' })} ${end.getDate()}, ${end.getFullYear()}`;
          return `${formattedStart} - ${formattedEnd}`;
        }
      } else {
        return formattedStart;
      }
    });

    // Method to handle date changes
    const handleDateChange = () => {
      const selected = new Date(selectedDate.value);
      if (!startDate.value) {
        startDate.value = selected;
        isSingleDate.value = false; // Switch to date range mode
      } else if (isSingleDate.value) {
        startDate.value = selected;
        endDate.value = null;
      } else {
        if (selected < startDate.value) {
          startDate.value = selected;
          endDate.value = null;
        } else if (selected > startDate.value) {
          endDate.value = selected;
          weekdaysCount.value = calculateWeekdays(startDate.value, endDate.value);
        } else {
          startDate.value = selected;
          endDate.value = null;
          weekdaysCount.value = 0;
        }
      }
      if (startDate.value && endDate.value) {
        weekdaysCount.value = calculateWeekdays(startDate.value, endDate.value);
      } else {
        weekdaysCount.value = 1; // Reset to 1 for a single date or incomplete range
      }
      console.log('yawa')
      // Now assign the computed values to form
      form.value.dates = formattedDateRange.value;
      form.value.days = weekdaysCountWithSuffix.value;
    };

    // Function to calculate weekdays between two dates
    const calculateWeekdays = (start, end) => {
      let count = 0;
      let current = new Date(start);
      end = new Date(end);
      while (current <= end) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          count++;
        }
        current.setDate(current.getDate() + 1);
      }
      return count;
    };

    
  
      // Static data for dropdowns
      const leaveTypes = ref([
        'Vacation Leave',
        'Mandatory/Forced Leave',
        'Sick Leave',
        'Maternity Leave',
        'Paternity Leave',
        'Special Privilege Leave',
        'Solo Parent Leave',
        'Study Leave',
        '10-Day VAWC Leave',
        'Rehabilitation Privilege',
        'Special Leave Benefits for Women',
        'Special Emergency (Calamity) Leave',
        'Adoption Leave',
        'Others',
      ]);
  
      // Leave Description state
      const leaveDescriptions = ref([]);
  
      // Function to update leave descriptions based on leave type
      const updateLeaveDescriptions = () => {
        if (form.value.type === 'Vacation Leave' || form.value.type === 'Special Privilege Leave') {
          leaveDescriptions.value = ['Within the Philippines', 'Abroad (Specify)'];
        } else if (form.value.type === 'Sick Leave') {
          leaveDescriptions.value = ['In Hospital (Specify Illness)', 'Out Patient (Specify Illness)'];
        } else if (form.value.type === 'Study Leave') {
          leaveDescriptions.value = ['Completion of Master\'s Degree', 'BAR/Board Examination Review'];
        } else if (form.value.type === 'Others') {
          leaveDescriptions.value = ['Monetization of Leave Credits', 'Terminal Leave', 'Others'];
        } else {
          leaveDescriptions.value = [];
        }
      };

      // Reactive references to store data
    const names = ref([]);
    const positions = ref([]);
    const employees = ref([]);
    const nameid = ref(localStorage.getItem('nameId'))

    // Function to fetch names
    const fetchNames = async () => {
      try {
        const response = await axios.get('http://202.137.117.84:8011/get_names_json');
        if(parseInt(nameid.value) !== parseInt(76)){
          names.value = response.data.filter(nem => nem.name_id == nameid.value); // assuming the response is an array
        }else{
          names.value = response.data; // assuming the response is an array
        }
        
      } catch (error) {
        console.error('Error fetching names:', error);
      }
    };

    // Function to fetch positions
    const fetchPositions = async () => {
      try {
        const response = await axios.get('http://202.137.117.84:8011/get_positions_json');
        positions.value = response.data; // assuming the response is an array
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    // Function to fetch employees
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://202.137.117.84:8011/get_employees_json');
        employees.value = response.data; // assuming the response is an array
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    // Method to find the selected employee and update their position
    const findEmployeeAndPosition = () => {
      if (form.value.name_id) {
        // Find employee by name_id
        const selectedEmployee = employees.value.find(emp => emp.name_id === form.value.name_id);

        if (selectedEmployee) {
          // Find the position based on the employee's position_id
          const selectedPosition = positions.value.find(pos => pos.position_id === selectedEmployee.position_id);
          
          // Update the position field with the found position name
          position.value = selectedPosition ? selectedPosition.position_name : '';
          form.value.position_id = selectedPosition.position_id
        }
      }
    };

    // Watch the name field to trigger finding the employee and their position when the name is selected
    watch(() => form.value.name_id, findEmployeeAndPosition);
  
      // Set today's date
      onMounted(() => {
        const today = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD
        form.value.dateToday = today;
        fetchNames();
        fetchPositions();
        fetchEmployees();
      });
  
      // Handle form submission
      const submitForm = () => {
        formDisable.value = true
        pleaseWait.value = true
        loadis.value = true
        const payload = {
          name_id: form.value.name_id,
          position_id: form.value.position_id,
          type: form.value.otherType && form.value.type == 'Others' ? form.value.otherType : form.value.type ,
          detail: detail.value,  // Use the computed "detail" property
          description: form.value.otherPurpose,
          dates: form.value.dates,
          days: form.value.days,
          commutation: form.value.commutation,
          applicant: '₱' + form.value.applicant,
        };
        // Use Axios to send a POST request
        axios.post('http://202.137.117.84:8011/addleave_form', payload)
          .then(response => {
            console.log('Form Submitted:', response.data);  // Handle the server's response
            alert('Form Submitted Successfully!');
            pleaseWait.value = false
            loadis.value = false
            window.location.reload();
          })
          .catch(error => {
            console.error('Error submitting form:', error);
            alert('Error submitting form.');
            pleaseWait.value = false
            loadis.value = false
            formDisable.value = false
          });
      };
  
      return {
        form,
        names,
        leaveTypes,
        leaveDescriptions,
        updateLeaveDescriptions,
        submitForm,
        isSingleDate,
        selectedDate,
        startDate,
        endDate,
        weekdaysCount,
        weekdaysCountWithSuffix,
        formattedDateRange,
        handleDateChange,
        formattedSalary,
        updateRawSalary,
        findEmployeeAndPosition,
        position,
        formDisable,
        pleaseWait,
        loadis
      };
    },
  };
  </script>
  
  <style scoped>
  /* Base styles */
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #f4f7fc;
    margin: 0;
    padding: 0;
  }
  
  .form-container {
    width: max-content;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    background: linear-gradient(to bottom, #ffffff, #f2f2f2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: solid black 2px;
    margin-top: 50px;
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
  
  input, select {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }
  
  input[type="checkbox"] {
    width: auto;
  }
  
  input:focus, select:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.4);
  }
  
  button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    background-color: #000000;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #6d6c6c;
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


  @media screen and (max-width: 768px) {
    .form-row {
      flex-direction: column;
    }
  
    .form-group {
      width: 100%;
    }
  }
  </style>
  