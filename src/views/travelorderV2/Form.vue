<template>
    <div class="luxury-form-container" v-if="isVisible">
      <div class="luxury-form-wrapper">  
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
  
        <div class="luxury-checkbox-containerzz">
          <div style="display: flex; flex-direction: row; margin-top: 15px;">
            <div class="container">
                <input type="checkbox" id="cbx" style="display: none;">
                <label for="cbx" class="check">
                    <svg width="18px" height="18px" viewBox="0 0 18 18">
                        <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                        <polyline points="1 9 7 14 15 4"></polyline>
                    </svg>
                </label>
            </div>
            <label for="areaofres"
              style="margin-left: 10px; font-size: 20px; font-weight: bold; display: flex;">
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
          <button class="luxury-submit-button" :disabled="submitting" @click="form_submit">Submit</button>
        </div>
      </div>
    </div>
  </template>
  
  
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  import { API_BASE_URL } from '../../config'
import { useAuthStore } from '@/store/auth';
  
  export default {
    data() {
      const authStore = useAuthStore();
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
        accountIdz: authStore.account_id,
        loadis: false,
        aor: false,
        nameIdz: authStore.name_id,
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
  
          axios.post(`${API_BASE_URL}/add_form/`, formData)
  
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
                      console.log(this.accountz.type_id)
                    } else if (this.accountz.type_id !== 1) {
                      console.log(this.accountz.type_id)
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
    },
    watch: {
      selectedName: 'fetchSelectedEmployee',
    },
    mounted() {
      this.fetchData();
      this.fetchSelectedEmployee();
    },
  };
  </script>
  
  <style scoped>
/* General Form Layout */
.luxury-form-container {
  display: flex;
  justify-content: center;
}

.luxury-form-wrapper {
  width: 90%;
  max-width: 1000px;
  background: linear-gradient(180deg, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid #000000;
  margin-top: -20px;
  position: absolute;
  z-index: 9000;
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

.luxury-checkbox-containerzz {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.luxury-checkbox-label {
  font-size: 16px;
  color: #000000;
  font-family: 'Merriweather', serif;
}
/* From Uiverse.io by mrhyddenn */ 
.check {
  cursor: pointer;
  position: relative;
  margin: auto;
  width: 18px;
  height: 18px;
  -webkit-tap-highlight-color: transparent;
  transform: translate3d(0, 0, 0);
  margin-left: 20px;
}

.check:before {
  content: "";
  position: absolute;
  top: -15px;
  left: -15px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(34,50,84,0.03);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.check svg {
  position: relative;
  z-index: 1;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: #000000;
  stroke-width: 1.5;
  transform: translate3d(0, 0, 0);
  transition: all 0.2s ease;
}

.check svg path {
  stroke-dasharray: 60;
  stroke-dashoffset: 0;
}

.check svg polyline {
  stroke-dasharray: 22;
  stroke-dashoffset: 66;
}

.check:hover:before {
  opacity: 1;
}

.check:hover svg {
  stroke: #000000;
}

#cbx:checked + .check svg {
  stroke: #000000;
}

#cbx:checked + .check svg path {
  stroke-dashoffset: 60;
  transition: all 0.3s linear;
}

#cbx:checked + .check svg polyline {
  stroke-dashoffset: 42;
  transition: all 0.2s linear;
  transition-delay: 0.15s;
}


.luxury-submit-button-container {
  display: flex;
  justify-content: center;
  margin-top: 0px;
  margin-bottom: -0px;
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
  .luxury-form-container{
    margin-bottom: 80px;
  }
}
</style>
