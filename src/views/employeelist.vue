<template>
  <div style="display: flex; flex-direction: column; margin-top: 105px; ">

    <div style="display: flex; flex-direction: row; justify-content: center; ">
      <p style="font-size: 30px; font-weight: bold;">Employee List</p>
      <img src="../assets/add.png"
        style="width: 26px; height: 26px; margin-left: 10px; margin-top: 35px; cursor: pointer;" @click="showaddem">
    </div>
    <div
      style="width: 300px; background-color: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 20px;  position: fixed;  top: 50%;  left: 50%;  transform: translate(-50%, -50%);  z-index: 100;"
      v-if="addem">
      <addemp></addemp>
    </div>

    <div v-if="load" class="loadings">
        <img src='../assets/loading.gif' width="auto" height="100px" />
      </div>

    <div v-if="mawala" class="outer">

    <!-- <div class="outer"> -->
      <div class="scrollable-table">
        <table>
          <thead>
            <tr>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Middle</th>
              <th>Position</th>
              <th>Division</th>
              <th>Chief</th>
              <th>isActive</th>
              <th>Action</th>
              <!-- Add more table headers as needed -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.id" style="font-size:18px;">
              <td v-if="!employee.isEditing" style="width: 120px; ">{{ getLastNameById(employee.name_id, 'names').toUpperCase() }}</td>
              <td v-else>
                <input style="width: 120px; " v-model="edited.lastName" type="text">
              </td>

              <td v-if="!employee.isEditing">{{ getNameById(employee.name_id, 'names').toUpperCase() }}</td>
              <td v-else>
                <input v-model="edited.firstName" type="text">
              </td>

              <td v-if="!employee.isEditing" style=" text-align: center;">{{ getMiddleInitById(employee.name_id, 'names') }}</td>
              <td v-else>
                <input style="width:30px;" v-model="edited.middleName" type="text">
              </td>

              <td v-if="!employee.isEditing">{{ getPositionById(employee.position_id, 'positions') }}</td>
              <td v-else>
                <select v-model="edited.position" :disabled="input.pospos">
        <option v-for="position in positions" :key="position.position_id" :value="position.position_name">
            {{ position.position_name }}
        </option>
    </select>
          <input type="checkbox" id="pospos" v-model="input.pospos">
          <input v-model="edited.position" type="text" v-if="input.pospos">
              </td>

              <td v-if="!employee.isEditing" style=" text-align: center;">{{ getDivisionById(employee.division_id, 'divisions') }}</td>
              <td v-else>
                <select v-model="edited.division">
        <option v-for="division in divisions" :key="division.division_id" :value="division.division_name">
            {{ division.division_name }}
        </option>
    </select>
              </td>

              <td v-if="!employee.isEditing" style=" text-align: center;">{{ isChief(employee.chief) }}</td>
              <td v-else>
                <input v-model="edited.isChief" type="checkbox">
              </td>

              <td v-if="!employee.isEditing" :style="{ backgroundColor: employee.isActive === 'out' ? 'red' : 'green' }"></td>
              <td v-else>
                <input v-model="edited.isActive" type="checkbox">
              </td>

              <td v-if="!employee.isEditing" style="display: flex; justify-content: center;">
                <img src="../assets/edit.png" style=" width: 30px; height: 30px;" @click="editEmployeee(employee.employee_id)"/>
              </td>

              <td v-if="employee.isEditing" style="display: flex; justify-content: center;">
                <img src="../assets/save.png" style="width: 30px; height: 30px;" @click="doneeditEmployeee(employee)"/>
              </td>
            
            </tr>
          </tbody>
        </table>
      </div>

    </div>

  </div>
</template>

<script setup>
import { employeelis, isVisible, backButtonemp } from './dashboard.vue';
import addemp from '../components/addemployee.vue';
import axios from 'axios';

</script>

<script>

export default {
  data() {
    return {
      names: [],
      employees: [],
      positions: [],
      divisions: [],
      load: true,
      mawala: false,
      addem: false, 
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
  
  methods: {
    isPosposDisabled() {
      return !this.edited.position; // Disable if edited.position is empty
    },
    backButtonemp() {
    employeelis.value = false;
    isVisible.value = false;
  },
  editEmployeee(employees_id) {
      this.selectedEmployee = employees_id;
      const map = this.employees.find(emp => emp.employee_id == employees_id)
      console.log(map)
      this.employees.forEach(employee => {
        if (employee.employee_id === employees_id && this.selectedEmployee === employees_id) {
          employee.isEditing = true;
          const nem = this.names.find(name => name.name_id == map.name_id)
          const pus = this.positions.find(name => name.position_id == map.position_id)
          const dev = this.divisions.find(name => name.division_id == map.division_id)
          console.log(nem)
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
    // Create a new FormData object
    const formData = new FormData();

    // Append key-value pairs to the FormData object
    formData.append('employee_id', this.selectedEmployee);
    formData.append('last_name', this.edited.lastName);
    formData.append('first_name', this.edited.firstName);
    formData.append('middle_init', this.edited.middleName);
    formData.append('position_name', this.edited.position);
    formData.append('division_name', this.edited.division);
    formData.append('chief', this.edited.isChief ? 1 : 0);
    formData.append('isActive', this.edited.isActive ? null : 'out');

    // Send the data using Axios
    axios.post('http://172.31.10.164:8000/edit_employee', formData)
        .then(response => {
            // Handle success
            console.log('Response:', response);
            this.selectedEmployee = 0;
            employee.isEditing = false;
            this.fetchData();
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
            this.selectedEmployee = 0;
            employee.isEditing = false;
        });
},
    showaddem (){
    this.addem = !this.addem ;
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
      fetch('http://172.31.10.164:8000/get_names_json/')
        .then(response => response.json())
        .then(data => {
          this.mawala = true;
          this.load = false
          this.names = data;
          console.log(this.names)
        })
        .catch(error => {
          console.error('Error fetching names:', error);
        });

      fetch('http://172.31.10.164:8000/get_employees_json/')
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
      fetch('http://172.31.10.164:8000/get_positions_json/')
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
      fetch('http://172.31.10.164:8000/get_divisions_json/')
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
/* Add CSS styles for table design */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 5px;
}

th {
  background-color: #f2f2f2;
  position: sticky;
  top: -2px;
  text-align: center;
}

.scrollable-table {
  max-height: 630px;
  overflow-y: auto;
  margin: 15px;
}

.outer {
  border: 1px solid black;
  /* box-shadow: 0px 0px 3px black; */
  box-shadow: 0px 0px 4px black, 0px 0px 3px black inset;
  border-radius: 5px;
}

.loadings {
  top: 0;
  left: 0;
  width: fit-content;
  justify-self: center;
  display: flex;
  flex-direction: column;
  /* border: 1px solid #39b259; */
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
  /* box-shadow: 0px 0px 10px #39b259, 0px 0px 10px #39b259 inset; */
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