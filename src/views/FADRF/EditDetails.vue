<template>
    <div class="luxury-form-container" v-if="isVisible">
      <div class="luxury-form-wrapper">  
        <h1 style="text-align: center;">EDIT FORM</h1>
        <div class="luxury-form-content">
          <!-- First Column -->
          <div class="luxury-form-column">
            <label class="luxury-form-label">Name:</label>
            <select v-model="selectedName" class="luxury-form-input" :class="{ 'input-error': isRed && selectedName === '' }" required>
              <option value="" disabled>Select a Name</option>
              <option v-for="name in names" :key="name.name_id" :value="name.name_id">{{ name.last_name }}, {{ name.first_name }} {{ name.middle_init }}</option>
            </select>
  
            <label class="luxury-form-label">Position:</label>
            <input @keydown.enter="form_submit" type="text" v-model="position" class="luxury-form-input" required readonly>
  
            <label class="luxury-form-label">Division/Section:</label>
            <input @keydown.enter="form_submit" type="text" v-model="division" class="luxury-form-input" required readonly>
  
            <label class="luxury-form-label">Official Station:</label>
            <input @keydown.enter="form_submit" type="text" v-model="station" class="luxury-form-input" required readonly>
          </div>
  
          <!-- Second Column -->
          <div class="luxury-form-column">
            <label class="luxury-form-label">Date:</label>
            <input @keydown.enter="form_submit" type="text" v-model="date" class="luxury-form-input" required readonly>
  
            <label class="luxury-form-label">Departure Date:</label>
            <input @keydown.enter="form_submit" type="date" v-model="departure" :class="{ 'input-error': isRed && departure === '' }" class="luxury-form-input" required>
  
            <label class="luxury-form-label">Arrival Date:</label>
            <input @keydown.enter="form_submit" type="date" v-model="arrival" :class="{ 'input-error': isRed && arrival === '' }" class="luxury-form-input" required>
  
            <label class="luxury-form-label">Destination:</label>
            <input @keydown.enter="form_submit" type="text" v-model="destination" :class="{ 'input-error': isRed && destination === '' }" class="luxury-form-input" required>
          </div>
        </div>
  
        <div class="luxury-checkbox-container">
          <div style="display: flex; flex-direction: row; margin-top: 15px;">
            <label class="container" style="margin-left: -70px;">
              <input type="checkbox" id="areaofres" v-model="aor">
              <svg viewBox="0 0 64 64" height="2em" width="2em">
                <path
                  d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                  pathLength="575.0541381835938" class="path"></path>
              </svg>
            </label>
            <label for="areaofres"
              style="margin-left: 100px; font-size: 20px; font-weight: bold; display: flex;">
              Outside Area of Responsibility (AOR)
              <span v-if="travelDurationz > 7">{{ travelDurationz }} Days</span>
            </label>
          </div>
        </div>
  
        <div class="luxury-form-fields">
          <label class="luxury-form-label">Purpose of Travel:</label>
          <input @keydown.enter="form_submit" type="text" v-model="purpose" :class="{ 'input-error': isRed && purpose === '' }" class="luxury-form-input" required>
  
          <label class="luxury-form-label">Per Diems/Expense Allowed:</label>
          <input @keydown.enter="form_submit" type="text" v-model="pdea" class="luxury-form-input" required>
  
          <label class="luxury-form-label">Assistants or Laborers Allowed:</label>
          <input @keydown.enter="form_submit" type="text" v-model="ala" class="luxury-form-input" required>
  
          <label class="luxury-form-label">Appropriations to be charged:</label>
          <input @keydown.enter="form_submit" type="text" v-model="appropriation" class="luxury-form-input" required>
  
          <label class="luxury-form-label">Remarks or Special Instructions:</label>
          <input @keydown.enter="form_submit" type="text" v-model="remarks" class="luxury-form-input" required>
        </div>
  
        <!-- Error and Success Messages -->
        <div v-if="isValid" class="luxury-error-message">
          <p class="luxury-error-text">Please fill in all the required fields!</p>
        </div>
  
        <div v-else-if="pleaseWait" class="luxury-success-message">
          <p class="luxury-success-text">Form submitted! Please wait...</p>
        </div>
  
        <div v-else-if="loadis" class="luxury-loading-message">
          <div class="luxury-loader"></div>
        </div>
  
        <!-- Submit Button -->
        <div class="luxury-submit-button-container">
          <button class="luxury-submit-button" :disabled="submitting" @click="cancelEdit()">Cancel</button>
          <button class="luxury-submit-button" :disabled="submitting" @click="form_submit">Submit</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  import { API_BASE_URL } from '../../config'
  
  export default {
    props:{
      travelOrderId: {
        type: Number, // Adjust based on your data type
        required: true,
      }
    },
    data() {
      return {
        isRed: false,
        selectedName: '',
        names: [],
        position: '',
        departure: '',
        destination: '',
        purpose: '',
        date: this.getCurrentDate(),
        division: '',
        station: 'MGB-X',
        arrival: '',
        pdea: '',
        ala: '',
        appropriation: '',
        remarks: '',
        isValid: false,
        isVisible: true,
        pleaseWait: false,
        employees: [],
        positions: [],
        divisions: [],
        positionID: '',
        submitting: false,
        divisionID: '',
        accounts: [],
        accountz: [],
        accountIdz: localStorage.getItem('accountId'),
        loadis: false,
        aor: false,
        errorDate: ''
      };
    },
    computed: {
  
  
      travelDuration() {
        if (this.departure && this.arrival) {
          const departureDate = new Date(this.departure);
          const arrivalDate = new Date(this.arrival);
          const timeDifference = arrivalDate - departureDate;
          const dayDifference = timeDifference / (1000 * 3600 * 24);
          return dayDifference >= 8 ? 1 : 0;
        }
        return 0;
      },
      travelDurationz() {
        if (this.departure && this.arrival) {
          const departureDate = new Date(this.departure);
          const arrivalDate = new Date(this.arrival);
          const currentDate = new Date();
          const timeDifference = arrivalDate - departureDate;
          const dayDifference = timeDifference / (1000 * 3600 * 24);
  
  
          if (dayDifference < 0) {
            this.departure = null;
            this.arrival = null;
            return 0;
          }
  
          this.errorDate = '';
          return Math.ceil(dayDifference);
        }
        return 0;
      },
  
      nem() {
        return this.selectedName;
      },
      departor() {
        return this.departure !== ''
      },
      destinashwon() {
        return this.destination !== ''
      },
      araybal() {
        return this.arrival !== ''
      },
      porpos() {
        return this.purpose !== ''
      },
  
    },
    methods: {
      cancelEdit() {
      this.$emit('cancel-edit'); // Emit an event to inform parent component
    },
      capitalize(field) {
        this[field] = this[field]
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      },
      capitalizeAndReset(field) {
        this.capitalize(field);
        this.resetRed(); // Call resetRed if you need to reset the red border on input change
      },
      
  
  
      
      resetRed() {
        this.isRed = false;
      },
      fetchSelectedEmployee() {
        if (this.selectedName) {
          const selectedEmployee = this.employees.find(employee => employee.name_id === this.selectedName);
          if (selectedEmployee) {
            this.positionID = selectedEmployee.position_id
            this.divisionID = selectedEmployee.division_id
            this.position = this.findPositionName(selectedEmployee.position_id);
            this.division = this.findDivisionName(selectedEmployee.division_id);
          }
        }
      },
      findPositionName(positionId) {
        const matchedPosition = this.positions.find(position => position.position_id === positionId);
        return matchedPosition ? matchedPosition.position_name : '';
      },
      findDivisionName(divisionId) {
        const matchedDivision = this.divisions.find(division => division.division_id === divisionId);
        return matchedDivision ? matchedDivision.division_name : '';
      },
      convertToUpperCase() {
        this.name = this.name.toUpperCase();
      },
      enableTyping(event) {
        event.target.removeAttribute('readonly');
      },
      getCurrentDate() {
        const today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        if (dd < 10) {
          dd = `0${dd}`;
        }
        if (mm < 10) {
          mm = `0${mm}`;
        }
        return `${yyyy}-${mm}-${dd}`;
      },
      form_submit() {
  
        if (
  
          this.selectedName === '' ||
          this.position === '' ||
          this.departure === '' ||
          this.destination === '' ||
          this.date === '' ||
          this.division === '' ||
          this.station === '' ||
          this.arrival === '' ||
          this.purpose === ''
  
        ) {
          this.isRed = true
          this.isValid = true;
  
          setTimeout(() => {
            this.isValid = false;
          }, 3000);
        } else {
          const formData = {
            name_id: '' + this.selectedName,
            position_id: '' + this.positionID,
            division_id: '' + this.divisionID,
            station: this.station,
            destination: this.destination,
            purpose: this.purpose,
            departure: this.departure,
            arrival: this.arrival,
            pdea: this.pdea,
            ala: this.ala,
            appropriations: this.appropriation,
            remarks: this.remarks,
            aor: this.aor ? '1' : '0',
            intervals: this.travelDuration ? '1' : '0',
          };
          this.submitting = true;
          this.loadis = true
  
          axios.post(`${API_BASE_URL}/update_form/${this.travelOrderId}`, formData)
  
            .then(response => {
              if (response.status === 200) {
                this.resetForm();
                setTimeout(() => {
                  window.location.reload();
                  this.submitting = false;
                }, 3000);
              } else {
                throw new Error('Failed to submit form');
              }
            })
            .catch(error => {
              console.error('Error submitting form:', error);
            });
          setTimeout(() => {
            this.loadis = false
          }, 3000);
        }
      },
      resetForm() {
        this.selectedName = '';
        this.position = '';
        this.departure = '';
        this.destination = '';
        this.division = '';
        this.purpose = '';
        this.arrival = '';
        this.pdea = '';
        this.ala = '';
        this.appropriation = '';
        this.remarks = '';
        this.pleaseWait = true;
        this.submitting = true;
        this.isRed = false
      },
      fetchData() {
        fetch(`${API_BASE_URL}/get_names_json/`)
          .then(response => response.json())
          .then(data => {
            this.names = data;
            if (this.names) {
              fetch(`${API_BASE_URL}/get_accounts_json/`)
                .then(response => response.json())
                .then(data => {
                  if (this.accountIdz) {
                    this.accounts = data;
                    this.accountz = this.accounts.find(acc => parseInt(acc.account_id) === parseInt(this.accountIdz));
                    if (this.accountz.type_id == 1) {
                    } else if (this.accountz.type_id !== 1) {
                      this.names = this.names.filter(nem => parseInt(nem.name_id) === parseInt(this.accountz.name_id))
                    }
                  } else {
                  }
                })
                .catch(error => {
                  console.error('Error fetching accounts:', error);
                });
            }
          })
          .catch(error => {
            console.error('Error fetching names:', error);
          });
  
        fetch(`${API_BASE_URL}/get_employees_json/`)
          .then(response => response.json())
          .then(data => {
            this.employees = data;
          })
          .catch(error => {
            console.error('Error fetching employees:', error);
          });
        // Fetch positions data
        fetch(`${API_BASE_URL}/get_positions_json/`)
          .then(response => response.json())
          .then(data => {
            this.positions = data;
          })
          .catch(error => {
            console.error('Error fetching positions:', error);
          });
  
        // Fetch divisions data
        fetch(`${API_BASE_URL}/get_divisions_json/`)
          .then(response => response.json())
          .then(data => {
            this.divisions = data;
          })
          .catch(error => {
            console.error('Error fetching divisions:', error);
          });
      },
      fetchTravelOrderData() {
      axios.get(`${API_BASE_URL}/get_forms_json`)
        .then(response => {
          const travelOrders = response.data; // Assuming the response data is an array
          const order = travelOrders.find(order => order.travel_order_id === this.travelOrderId);
          if (order) {
            this.populateFormData(order);
          } else {
            console.error('Travel order not found');
          }
        })
        .catch(error => {
          console.error('Error fetching travel order data:', error);
        });
    },

    populateFormData(order) {
      // Populate form fields with the fetched data
      this.selectedName = order.name_id;
      this.positionID = order.position_id;
      this.divisionID = order.division_id;
      this.position = this.findPositionName(order.position_id);
      this.division = this.findDivisionName(order.division_id);
      this.station = order.station;
      this.destination = order.destination;
      this.purpose = order.purpose;
      this.departure = order.departure;
      this.arrival = order.arrival;
      this.pdea = order.pdea;
      this.ala = order.ala;
      this.appropriation = order.appropriations;
      this.remarks = order.remarks;
      this.aor = Boolean(Number(order.aor)); // Converts '0' or 0 to false, and '1' or 1 to true
      this.date = order.date; // Or however you want to set the date
    },
    },
    watch: {
      selectedName: 'fetchSelectedEmployee',
    },
    mounted() {
      this.fetchData();
      this.fetchSelectedEmployee();
      this.fetchTravelOrderData(); // Fetch travel order data based on the ID
    },
  };
  </script>
  
  <style scoped>
/* General Form Layout */
.luxury-form-container {
  display: flex;
  justify-content: center;
  margin-top: -960px;
  z-index: 20;
}

.luxury-form-wrapper {
    position: absolute;
  width: 90%;
  max-width: 1000px;
  background: linear-gradient(30deg, #DDC7AD, #92785b);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid #000000;
  z-index: 20;
}

.luxury-form-title {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  color: #000000;
  font-family: 'Playfair Display', serif;
  letter-spacing: 2px;
  margin-top: 0px;
}

.luxury-form-content {
  display: flex;
  gap: 20px;
  margin-bottom: 0px;
}

.luxury-form-column {
  width: 48%;
  display: flex;
  flex-direction: column;
  margin-bottom: -30px;
}
.luxury-form-fields {
  width: 98%;
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
}

.luxury-form-label {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 5px;
  margin-left: 10px;
  font-family: 'Merriweather', serif;
}

.luxury-form-input {
  font-size: 15px;
  padding: 7px 10px;
  border-radius: 10px;
  border: 2px solid #ddd;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  color: #000000;
  font-family: 'Merriweather', serif;
}

.luxury-form-input:focus {
  outline: none;
  border-color: #f39c12;
  box-shadow: 0 0 8px rgba(243, 156, 18, 0.5);
}

.input-error {
  border: 2px solid #e74c3c;
  background-color: #f8d7da;
}

.luxury-checkbox-container {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.luxury-checkbox-label {
  font-size: 16px;
  color: #000000;
  font-family: 'Merriweather', serif;
}

.luxury-submit-button-container {
  display: flex;
  justify-content: space-evenly;
  margin-top: 40px;
}

.luxury-submit-button {
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

.luxury-submit-button:hover {
  background-color: #383837;
  transform: translateY(-3px);
}

.luxury-submit-button:disabled {
  background-color: #4b1b1b;
  cursor: not-allowed;
}

.luxury-error-message,
.luxury-success-message,
.luxury-loading-message {
  text-align: center;
  margin-top: 20px;
}

.luxury-error-text {
  color: #e74c3c;
  font-size: 18px;
  font-weight: 700;
}

.luxury-success-text {
  color: #2ecc71;
  font-size: 18px;
  font-weight: 700;
}

.luxury-loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f39c12;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design for Smaller Screens */
@media (max-width: 768px) {
  .luxury-form-column {
    width: 98%;
  }

  .luxury-form-content {
    flex-direction: column;
    gap: 30px;
  }

  .luxury-submit-button {
    width: 100%;
  }
}
</style>
