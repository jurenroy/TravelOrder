<template>
  <div style="display: flex; flex-direction: column; margin-top: 105px;">
    <div style="display: flex; flex-direction: row;">
    <img v-if="showhome" @click="relod" :class="{ 'blur': blurTable }"
      style="cursor: pointer; height: 30px; width: 30px; margin-top: -6px; margin-right: 5px;"
      src="../assets/dashboard.png" title="Back to Dashboard">
    <label v-if="showhome" :class="{ 'blur': blurTable }" @click="relod"
      style="cursor: pointer;">Back to Dashboard</label>
    </div>
    <div style="display: flex; flex-direction: row; justify-content: center;" :class="{ 'blur': blurTable }">
      <p style="font-size: 30px; font-weight: bold;">Employee List</p>
      <img src="../assets/add.png"
        style="width: 26px; height: 26px; margin-left: 10px; margin-top: 35px; cursor: pointer;" @click="showaddem">
    </div>

    <button @click="fetchData" id="refresh" style="height: 0; width: 0;" hidden></button>

    <div v-if="successfulyadd" class="successadd">
      <a class="successadd1">
        Employee Successfuly Added!!
      </a>

    </div>


    <div v-if="load" class="loadings">
      <img src='../assets/loading.gif' width="auto" height="100px" />
    </div>

    <div v-if="!load" class="outer" :class="{ 'blur': blurTable }">

      <div class="scrollable-table">
        <table>
          <thead>
            <tr>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Middle Initial</th>
              <th>Position</th>
              <th>Division</th>
              <th>Chief</th>
              <th>isActive</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in sortedEmployees" :key="employee.id" style="font-size:18px;">

              <!-- Last Name -->
              <td v-if="!employee.isEditing" style="width: 120px; ">{{ getLastNameById(employee.name_id,
      'names').toUpperCase() }}</td>
              <td v-else>
                <input style="width: 95%; " v-model="edited.lastName" type="text">
              </td>

              <!-- First Name  -->
              <td v-if="!employee.isEditing">{{ getNameById(employee.name_id, 'names').toUpperCase() }}</td>
              <td v-else>
                <input v-model="edited.firstName" style="width: 95%; " type="text">
              </td>

              <!-- Middle Initials -->
              <td v-if="!employee.isEditing" style=" text-align: center;">{{ getMiddleInitById(employee.name_id,
      'names') }}</td>
              <td v-else>
                <input style="width: 95%; " v-model="edited.middleName" type="text" maxlength="1">
              </td>

              <!-- Position -->
              <td v-if="!employee.isEditing">{{ getPositionById(employee.position_id, 'positions') }}</td>
              <td style="width: 550px;" v-else>

                <select v-model="edited.position" :disabled="input.pospos">
                  <option v-for="position in positions" :key="position.position_id" :value="position.position_name">
                    {{ position.position_name }}
                  </option>
                </select>

                <label class="containerlist">
                  <input type="checkbox" id="pospos" v-model="input.pospos">
                  <svg viewBox="0 0 64 64" height="2em" width="2em">
                    <path
                      d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                      pathLength="575.0541381835938" class="path"></path>
                  </svg>
                </label>
                <input v-model="edited.position" type="text" v-if="input.pospos">
              </td>


              <!-- Divisions -->
              <td v-if="!employee.isEditing" style=" text-align: center;">{{ getDivisionById(employee.division_id,
      'divisions') }}</td>
              <td v-else>
                <select v-model="edited.division">
                  <option v-for="division in divisions" :key="division.division_id" :value="division.division_name">
                    {{ division.division_name }}
                  </option>
                </select>
              </td>


              <!-- Chief -->
              <td v-if="!employee.isEditing" style=" text-align: center;">{{ isChief(employee.chief) }}</td>
              <td v-else>

                <label class="containeremployee">
                  <input type="checkbox" v-model="edited.isChief">
                  <svg viewBox="0 0 64 64" height="2em" width="2em">
                    <path
                      d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                      pathLength="575.0541381835938" class="path"></path>
                  </svg>
                </label>

              </td>


              <!-- isActive -->
              <td v-if="!employee.isEditing"
                :style="{ backgroundColor: employee.isActive === 'out' ? 'red' : 'green' }"></td>
              <td v-else>
                <label class="containeremployee">
                  <input type="checkbox" v-model="edited.isActive">
                  <svg viewBox="0 0 64 64" height="2em" width="2em">
                    <path
                      d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                      pathLength="575.0541381835938" class="path"></path>
                  </svg>
                </label>

              </td>


              <!-- Actions -->
              <td v-if="!employee.isEditing" style="display: flex; justify-content: center;">
                <img src="../assets/edit.png" style=" cursor: pointer; width: 30px; height: 30px;"
                  @click="editEmployeee(employee.employee_id)" />
              </td>

              <td v-if="employee.isEditing" style=" cursor: pointer; display: flex; justify-content: center;">
                <img src="../assets/save.png" style="width: 30px; height: 30px;" @click="doneeditEmployeee(employee)" />
              </td>

            </tr>
          </tbody>
        </table>
      </div>

    </div>
    <div
      style="width: fit-content; height: auto; background-color: white; border: 2px solid BLACK; border-radius: 5px; padding: 10px;  position: fixed;  top: 50%;  left: 50%;  transform: translate(-50%, -50%); "
      v-if="addem">
      
      <addemp @click="fetchData, seemplo, seemplo"></addemp>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { employeelis, isVisible, backButtonemp } from './dashboard.vue';
import addemp from '../components/addemployee.vue';
import axios from 'axios';


</script>




<script>
import { API_BASE_URL } from '../config'
const addem = ref(false);
const blurTable = ref(false);
const successfulyadd = ref(false)
const showhome = ref(true)

const relod = () => {
  window.location.reload();
}

const showaddem = () => {
  addem.value = true;
  blurTable.value = true;
};

const cancelemplo = () => {
  addem.value = false
  blurTable.value = false;
}
const seemplo = () => {
  addem.value = false
  const button = document.getElementById('refresh');

  if (button) {
    const clickEvent = new Event('click', {
      bubbles: true,
      cancelable: true,
    });
    button.dispatchEvent(clickEvent);
  } else {
    console.error('Button element not found');
  }
  successfulyadd.value = true
  setTimeout(() => {
    successfulyadd.value = false
  }, 3000);
}

export { cancelemplo, addem, blurTable, seemplo }

export default {

  data() {
    return {
      names: [],
      employees: [],
      positions: [],
      divisions: [],
      load: true,
      mawala: false,
      selectedEmployee: 0,
      edited: {
        lastName: '',
        firstName: '',
        middleName: '',
        position: '',
        division: '',
        isChief: '',
        isActive: ''
      },
      input: {
        pospos: false
      },

    };
  },
  computed: {
    sortedEmployees() {
      return this.employees.slice().sort((a, b) => {
        const lastNameA = this.getLastNameById(a.name_id, 'names').toUpperCase();
        const lastNameB = this.getLastNameById(b.name_id, 'names').toUpperCase();
        if (lastNameA < lastNameB) {
          return -1;
        }
        if (lastNameA > lastNameB) {
          return 1;
        }
        return 0;
      });
    }
  },

  watch: {
    chingchang(newValue, oldValue) {
      if (newValue > oldValue) {
        this.fetchData();
        console.log('yawa');
      }
    }
  },
  methods: {
    isPosposDisabled() {
      return !this.edited.position;
    },
    seemplo() {
      this.fetchData();
    },

    backButtonemp() {
      employeelis.value = false;
      isVisible.value = false;
    },
    editEmployeee(employees_id) {
      this.selectedEmployee = employees_id;
      const map = this.employees.find(emp => emp.employee_id == employees_id)
      this.employees.forEach(employee => {
        if (employee.employee_id === employees_id && this.selectedEmployee === employees_id) {
          employee.isEditing = true;
          const nem = this.names.find(name => name.name_id == map.name_id)
          const pus = this.positions.find(name => name.position_id == map.position_id)
          const dev = this.divisions.find(name => name.division_id == map.division_id)
          this.edited.lastName = nem.last_name.toUpperCase();
          this.edited.firstName = nem.first_name.toUpperCase();
          this.edited.middleName = nem.middle_init.toUpperCase();
          this.edited.position = pus.position_name;
          this.edited.division = dev.division_name;
          this.edited.isChief = (employee.chief > 0);
          this.edited.isActive = (employee.isActive !== 'out');
        } else {
          employee.isEditing = false;
        }
      });
    },
    doneeditEmployeee(employee) {

      let middleName = '';
      if (this.edited.middleName !== null) {
        middleName = this.edited.middleName.toUpperCase().replace(/\.{2,}/g, '.');
        if (!middleName.endsWith('.') && middleName) {
          middleName += '.';
        } else if (middleName == '.') {
          middleName = ''
        }
      }
      this.edited.middleName = middleName;



      const formData = new FormData();

      formData.append('employee_id', this.selectedEmployee);
      formData.append('last_name', this.edited.lastName);
      formData.append('first_name', this.edited.firstName);
      formData.append('middle_init', this.edited.middleName);
      formData.append('position_name', this.edited.position);
      formData.append('division_name', this.edited.division);
      formData.append('chief', this.edited.isChief ? 1 : 0);
      formData.append('isActive', this.edited.isActive ? null : 'out');

      axios.post(`${API_BASE_URL}/edit_employee`, formData)
        .then(response => {
          // Handle success
          this.selectedEmployee = 0;
          employee.isEditing = false;
          this.edited.middleName = ''
          this.fetchData();
        })
        .catch(error => {
          // Handle error
          console.error('Error:', error);
          this.selectedEmployee = 0;
          employee.isEditing = false;
        });
    },


    isChief(value) {
      return value === 1 ? 'Yes' : 'No';
    },
    getNameById(id, arrayName) {
      const array = this[arrayName];
      const item = array.find(item => item.name_id === id);
      return item ? item.first_name : '';
    },
    getMiddleInitById(id, arrayName) {
      const array = this[arrayName];
      const item = array.find(item => item.name_id === id);
      return item ? item.middle_init : '';
    },
    getLastNameById(id, arrayName) {
      const array = this[arrayName];
      const item = array.find(item => item.name_id === id);
      return item ? item.last_name : '';
    },
    getPositionById(id, arrayName) {
      const array = this[arrayName];
      const item = array.find(item => item.position_id === id);
      return item ? item.position_name : '';
    },
    getDivisionById(id, arrayName) {
      const array = this[arrayName];
      const item = array.find(item => item.division_id === id);
      return item ? item.division_name : '';
    },
    fetchData() {
      fetch(`${API_BASE_URL}/get_names_json/`)
        .then(response => response.json())
        .then(data => {
          this.mawala = true;
          this.load = false
          this.names = data;
        })
        .catch(error => {
          console.error('Error fetching names:', error);
        });

      fetch(`${API_BASE_URL}/get_employees_json/`)
        .then(response => response.json())
        .then(data => {
          this.mawala = true;
          this.load = false
          this.employees = data;
        })
        .catch(error => {
          console.error('Error fetching employees:', error);
        });
      // Fetch positions data
      fetch(`${API_BASE_URL}/get_positions_json/`)
        .then(response => response.json())
        .then(data => {
          this.mawala = true;
          this.load = false
          this.positions = data;
        })
        .catch(error => {
          console.error('Error fetching positions:', error);
        });

      // Fetch divisions data
      fetch(`${API_BASE_URL}/get_divisions_json/`)
        .then(response => response.json())
        .then(data => {
          this.mawala = true;
          this.load = false
          this.divisions = data;
        })
        .catch(error => {
          console.error('Error fetching divisions:', error);
        });
    }
  },

  mounted() {
    this.fetchData();
  },


}


</script>

<style scoped>
.containerlist {
  cursor: pointer;
  position: relative;
  left: 3px;
  top: 2px;
  margin-right: 10px;

}

.containerlist input {
  display: none;
}

.containerlist svg {
  overflow: visible;
  height: 15px;
  width: 15px;
}



.containeremployee {
  cursor: pointer;
  display: flex;
  justify-content: center;

}

.containeremployee input {
  display: none;
}

.containeremployee svg {
  overflow: visible;
  height: 15px;
  width: 15px;
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

.containeremployee input:checked~svg .path,
.containerlist input:checked~svg .path {
  stroke-dasharray: 70.5096664428711 9999999;
  stroke-dashoffset: -262.2723388671875;
}

.successadd {
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

.successadd1 {
  height: 20px;
  width: 100%;
  text-align: center;
  color: black;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;

}


td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 5px;

}



th {
  background-color: #f2f2f2;
  position: sticky;
  z-index: 0;
  top: -2px;
  text-align: center;
  padding: 5px;
}

.scrollable-table {
  max-height: 630px;
  overflow-y: auto;
  margin: 15px;
}

.outer {
  border: 1px solid black;
  box-shadow: 0px 0px 4px black, 0px 0px 3px black inset;
  border-radius: 5px;
}

.blur {
  filter: blur(5px);
  pointer-events: none;
}

.loadings {
  top: 0;
  left: 0;
  width: fit-content;
  justify-self: center;
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
}

.loadings1 {
  height: 20px;
  width: 100%;
  text-align: center;
}

.loadings1,
.loadings2 {
  font-weight: bold;
  font-size: 20px;
}

.note {
  width: 300px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}


.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.butokz {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.close-icon {
  cursor: pointer;
  font-size: 20px;
  color: #333;
}

.content {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

textarea {
  width: 100%;
  resize: vertical;
  height: 75px;
}

button {
  background-color: white;
  border: 1px solid black;
  color: black;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  width: fit-content;
}

button:hover {
  background-color: black;
  color: white;
}
</style>