<template>
  <div class=zero style="display: flex; justify-content: center;" v-if="isVisible">
    <div class="first">
      <div class="second">
        <p class="form">Fill up Form</p>

        <div class="inside">
          <div style="display: flex; flex-direction: column;  width: 100%;">
            <label class="n">Name:</label>
            <!-- Dropdown for names -->
            <select v-model="selectedName" class='inputsss' id='namein'
              style="height: 35px; border: 2px solid black; width: 90%;"
              :class="{ 'red-border': isRed && selectedName === '' }" required>
              <option value="" disabled>Select a Name</option>
              <option v-for="name in names" :key="name.name_id" :value="name.name_id">{{ name.last_name }},
                {{ name.first_name }} {{ name.middle_init }}</option>
            </select>

            <label class="p"> Position: </label>
            <input @keydown.enter="form_submit" type="text" v-model="position"
              :class="{ 'red-border': isRed && position === '' }" class='inputsss' @input="resetRed" id='positionin'
              required readonly>

              <label class="ds"> Division/Section: </label>
            <input @keydown.enter="form_submit" type="text" v-model="division"
              :class="{ 'red-border': isRed && division === '' }" @input="resetRed" class='inputsss' id='divisionin'
              required readonly>

            <label class="os"> Official Station:</label>
            <input @keydown.enter="form_submit" type="text" v-model="station" class='inputsss' id='stationin' required
              readonly>

          </div>
          <div style="display: flex; flex-direction: column;  width: 100%;">
            <label class="da"> Date: </label>
            <input @keydown.enter="form_submit" type="type" v-model="date" class='inputsss' id='datein' required
              readonly>

              <label class="dd"> Depature Date: </label>
            <input @keydown.enter="form_submit" type="date" v-model="departure" class='inputsss'
              :class="{ 'red-border': isRed && departure === '' }" @input="resetRed" id='departurein' required>

            <label class="ad"> Arrival Date: </label>
            <input @keydown.enter="form_submit" type="date" v-model="arrival"
              :class="{ 'red-border': isRed && arrival === '' }" @input="resetRed" class='inputsss' id='arrivalin'
              required>
            
            <label class="d"> Destination: </label>
            <input @keydown.enter="form_submit" :class="{ 'red-border': isRed && destination === '' }"  @input="capitalizeAndReset('destination')"
              type="text" v-model="destination" class='inputsss' id='destinationin' required>
              
          </div>
        </div>

        <div style="display: flex; flex-direction: column; justify-content: center;">
          <div>
            <label class="container">
              <input type="checkbox" id="areaofres" v-model="aor">
              <svg viewBox="0 0 64 64" height="2em" width="2em">
                <path
                  d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                  pathLength="575.0541381835938" class="path"></path>
              </svg>

            </label>
            <label for="areaofres"
              style="left: 40px; top: 0px; font-size: 20px; font-weight: bold; position: relative;">
              Outside Area of Responsibility (AOR)
              <span v-if="travelDurationz > 7">{{ travelDurationz }} Days</span>
            </label>
          </div>


          <label class="pt" style="margin-top: 10px;"> Purpose of Travel: </label>
          <input @keydown.enter="form_submit" type="text" v-model="purpose"
            :class="{ 'red-border': isRed && purpose === '' }" @input="capitalizeAndReset('purpose')"  class='inputss' id='purposein'
            required>

          <label class="per"> Per Deims/Expense Allowed</label>
          <input @keydown.enter="form_submit" type="text" @input="capitalize('pdea')"  v-model="pdea" class='inputss' id='pdeain' required>

          <label class="al"> Assistants or Laborer Allowed: </label>
          <input @keydown.enter="form_submit" type="text" v-model="ala" @input="capitalize('ala')" class='inputss' id='alain' required>

          <label class="at"> Appropriations to which travel should be charged: </label>
          <input @keydown.enter="form_submit" type="text" v-model="appropriation"  @input="capitalize('appropriation')" class='inputss' id='appropriationin'
            required>

          <label class="r"> Remarks or Special Instructios: </label>
          <input @keydown.enter="form_submit" type="text" v-model="remarks"  @input="capitalize('remarks')" class='inputss' id='remarksin' required>
        </div>

        <div v-if="isValid" class="error">
          <a class="errormsg1">
            Warning Alert!!
          </a>
          <a class="errormsg">
            Please Fill out the Text Fields
          </a>
        </div>

        <div v-else-if="pleaseWait" class="formcorrect">
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

        <div class="buttonss">
          <button class="button" :disabled="submitting" @click="form_submit">Submit</button>
        </div>

      </div>
    </div>
  </div>
</template>



<script>
import { ref } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '../config'

export default {
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
      nameIdz: localStorage.getItem('nameId'),
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
.container {
  cursor: pointer;
  top: 7px;
  left: 7px;
  position: relative;

}

.container input {

  display: none;
}

.container svg {
  overflow: visible;
  height: 20px;
  width: 20px;
  margin-top: 20px;
  margin-bottom: -20px;
}

.path {

  fill: none;
  stroke: black;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
  stroke-dasharray: 241 9999999;
  stroke-dashoffset: 0;
}

.container input:checked~svg .path {
  stroke-dasharray: 70.5096664428711 9999999;
  stroke-dashoffset: -262.2723388671875;
}



.red-border {
  border: 2px solid red;
}

.first {
  width: 20%;
  min-height: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.second {
  display: flex;
  flex-direction: column;
  border-radius: 25px;
  background-color: white;
  width: 80vw;
  max-width: 950px;

  height: auto;

  padding: 20px;
  color: #212121;
  border: 2px solid black;
  box-shadow: 0px 0px 4px black, 0px 0px 3px black inset;
}

.second.zoomed {
  transform: scale(2);
}

.form {
  font-weight: bold;
  font-size: 25px;
  margin-top: -5px;
  text-align: center;

}

.inputsss {
  font-size: 18px;
  border-radius: 5px;
  width: 90%;
  height: 30px;
}

.inputss {
  border-radius: 5px;
  font-size: 18px;
  width: 95%;
  height: 30px;
}

.n,
.p,
.dd,
.d,
.pt,
.da,
.ds,
.os,
.ad,
.per,
.al,
.at,
.r {
  text-align: left;
  font-weight: bold;
  font-size: 22px;
}

.inside {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.buttonss {
  display: flex;
  position: relative;
  flex-direction: row;
  height: 40px;
  justify-content: space-around;
  margin-top: 8px;

}

.button {
  border-radius: 10px;
  width: 30%;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
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

@media (max-width: 768px) {
  .first {
    margin-top: -120px;
    height: 130vh;
  }

  .inside {
    flex-direction: column;
  }

  .inputss {
    border-radius: 5px;
    width: 90%;
    height: 30px;
  }

  .zero {
    margin-top: 40px;
  }

  .loader {
    width: 125px;
    height: 4px;
  }
}
</style>