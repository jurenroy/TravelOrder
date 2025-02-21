<template>
  <div class="EditForm-popup" @click="closeModal">
    <div class="popup-content" @click.stop> <!-- Prevents click on content from closing the modal -->
      <h3>Update Status</h3>
      <div class="status-select">
        <select v-model="status">
          <option value="Select-Status">Select Status</option>
          <option value="released">Released</option>
          <option value="unreleased">Unreleased</option>
        </select>
      </div>
      <div class="popup-buttons">
        <button type="button" :disabled="formDisable" @click="cancelEdit">X</button>
        <button type="submit" :disabled="formDisable">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  name: 'LeaveForm',
  props: {
    leaveFormId: {
      type: Number,
      required: true,
    }
  },
  setup(props, { emit }) {
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

    const cancelEdit = () => {
    emit('cancel-edit'); // Emit an event to inform parent component
  }

    const detail = computed(() => {
    let detailString = '';



//   // Define props
// const props = defineProps({
//   leaveFormId: {
//     type: Number,
//     required: true,
//   },
// });

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

const dbdate = ref('');

// Computed property to check if the type is 'Sick Leave'
const isSickLeave = computed(() => {
    return form.value.type === 'Sick Leave';
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
  const isfromDB = ref(false)

  // Method to handle date changes
  const handleDateChange = () => {
    const selected = new Date(selectedDate.value);
    isfromDB.value = true
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
    if (!isfromDB.value){
      form.value.dates = formattedDateRange.value;
      form.value.days = weekdaysCountWithSuffix.value;
    }
    
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
      const response = await axios.get(`${API_BASE_URL}/get_names_json`);
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
      const response = await axios.get(`${API_BASE_URL}/get_positions_json`);
      positions.value = response.data; // assuming the response is an array
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  // Function to fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_employees_json`);
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
      fetchNames();
      fetchPositions();
      fetchEmployees();
      fetchLeaveFormData();
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
        ...(isfromDB === false && {
          dates: form.value.dates,
          days: form.value.days,
        }),
        commutation: form.value.commutation,
        applicant: '₱' + form.value.applicant,
      };
      // Use Axios to send a POST request
      axios.post(`${API_BASE_URL}/updateleave_form/${props.leaveFormId}`, payload)
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
    const fetchLeaveFormData = () => {
    axios.get(`${API_BASE_URL}/get_leave_json`)
      .then(response => {
        const travelOrders = response.data; // Assuming the response data is an array
        const order = travelOrders.find(order => order.leaveform_id === props.leaveFormId);
        console.log(order)
        if (order) {
          populateFormData(order);
        } else {
          console.error('Travel order not found');
        }
      })
      .catch(error => {
        console.error('Error fetching travel order data:', error);
      });
  };

  const populateFormData = (order) => {
    // Populate form fields with the fetched data
    form.value.name_id = order.name_id;
    form.value.position_id = order.position_id;
    form.value.dateToday = order.date.split(' ')[0];
    form.value.type = order.type;
    updateLeaveDescriptions()
    if (order.type.includes("Vacation Leave")){
      // Assign the relevant part of the detail to form.value.detail
    if (order.detail.includes("Within the Philippines")) {
        form.value.detail = "Within the Philippines"; // Set the detail
        const city = order.detail.split(",")[1].trim(); // Get the city name after the comma
        form.value.withinPH = city; // Fill the withinPH field
    } else if (order.detail.includes("Abroad (Specify)")) {
        form.value.detail = "Abroad (Specify)"; // Set the detail
        const country = order.detail.split(",")[1].trim(); // Get the country name after the comma
        form.value.abroad = country; // Fill the abroad field
    }
    }
    if (order.type.includes("Sick Leave")){
      // Assign the relevant part of the detail to form.value.detail
    if (order.detail.includes("In Hospital (Specify Illness)")) {
        form.value.detail = "In Hospital (Specify Illness)"; // Set the detail
        const city = order.detail.split(",")[1].trim(); // Get the city name after the comma
        form.value.inHospital = city; // Fill the withinPH field
    } else if (order.detail.includes("Out Patient (Specify Illness)")) {
        form.value.detail = "Out Patient (Specify Illness)"; // Set the detail
        const country = order.detail.split(",")[1].trim(); // Get the country name after the comma
        form.value.outPatient = country; // Fill the abroad field
    }
    }
    
    // form.value.dates = order.dates;
    // console.log(form.value.dates)
    // selectedDate.value = order.dates;
    // formattedDateRange.value = order.dates;
    dbdate.value = order.dates;
    console.log(dbdate.value)
    form.value.commutation = order.commutation;
    formattedSalary.value = order.applicant;
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
      loadis,
      fetchLeaveFormData,
      populateFormData,
      isSickLeave,
      dbdate,
      isfromDB,
      cancelEdit
    };
  },
};
</script>

<style scoped>
.EditForm-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: rgba(126, 71, 9, 0.856);
  padding: 60px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgb(218, 131, 0);
  text-align: center;
  color: #f0eaea;
}

.status-select {
  margin: 20px 0;
}

.status-select select {
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 4px;
  width: 200px;
  background-color: white;
  border: 2px solid black;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  gap: 10px;
  position: relative; /* Added to position the close button */
}

.popup-buttons button {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background-color: transparent;
  border: 2px solid black;
  padding: 10px 20px;
  font-size: 16px;
  color: #f0eaea;
  transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out;
}

.popup-buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.popup-buttons button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background-color: rgba(162, 123, 92, 0.856);
  transition: left 0.3s ease-in-out;
  z-index: -1;
}

.popup-buttons button:not(:disabled):hover::before {
  left: 0;
}

.popup-buttons button:not(:disabled):hover {
  color: white;
  border-color: rgba(162, 123, 92, 0.856);
}

/* New CSS for the Close button */
.popup-buttons button:first-child { /* Close button */
  position: absolute;
  top: -170px; /* Keep it higher */
  right: -50px; /* Move it more to the right */
  padding: 10px; /* Adjust padding if needed */
  font-size: 20px; /* Adjust the font size */
  background-color: transparent;
  border: none; /* Optional: Remove button border */
  color: #f0eaea;
  cursor: pointer;
}
.popup-buttons button:nth-child(2)::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background-color: white;  /* Set background to white */
  transition: left 0.3s ease-in-out;
  z-index: -1;
}

.popup-buttons button:nth-child(2):not(:disabled):hover::before {
  left: 0;
}

.popup-buttons button:nth-child(2):not(:disabled):hover {
  color: white;  /* Change text color to match the background */
  border-color: rgba(162, 123, 92, 0.856);
}
</style>
