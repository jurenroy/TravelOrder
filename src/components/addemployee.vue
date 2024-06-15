<template>
  <div style="width: fit-content;">
    <p class="AddEmp">
        Add Employee</p>
    <form @submit.prevent="submitForm">

      <div class="label1">
        <label for="firstName" style="margin-left: -40px;">First Name:</label>
        <label for="middleInit" style="margin-left: 10px;">Middle Initial:</label>
        <label for="lastName" style="margin-left: 5px;">Last Name:</label>
      </div>

      <div class="input1">
        <!-- Fist Name -->
        <input class="inputszxc" type="text" id="firstName" v-model="formData.firstName"
          @keydown.enter="submitForm" required><br>
        <!-- Middle Name -->
        <input class="inputszxc" type="text" id="middleInit" v-model="formData.middleInit"
          maxlength="1" @keydown.enter="submitForm"><br>
        <!-- Last Name -->
        <input class="inputszxc" type="text" id="lastName" v-model="formData.lastName"
          @keydown.enter="submitForm" required><br>
      </div>

      <div class="label2">
        <label for="division">Division:</label>
        <label for="position" style="left: 50px; position: relative;">Position:</label>
        <!-- custom position -->
        <label class="container">
          <input type="checkbox" id="customPosition" v-model="customPositionEnabled">
          <svg viewBox="0 0 64 64" height="2em" width="2em">
            <path
              d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
              pathLength="575.0541381835938" class="path"></path>
          </svg>
        </label>

        <label for="customPosition" style="left: 25px; position: relative;">Custom Position</label>
      </div>

      <div class="input2">
        <!-- division -->
        <select  id="division" class="inputszxc1"
          v-model="formData.division" @keydown.enter="submitForm" required>
          <option v-for="division in divisions" :key='division.division_id' :value="division.division_name">{{
      division.division_name }}</option>
        </select>
        <!-- Position -->
        <select  id="position" class="inputszxc2"
          v-model="formData.position" z required :disabled="customPositionEnabled" @keydown.enter="submitForm">
          <option v-for="position in positions" :key='position.position_id' :value="position.position_name">{{
      position.position_name }}</option>
        </select>
        <!-- Custom Position -->
        <input type="text" class="inputszxc3"
          id="customPositionInput" v-model="formData.customPosition" v-if="customPositionEnabled"
          placeholder="Enter Custom Position" @keydown.enter="submitForm" required>
      </div>

      <div v-if="loadis" class="loadid">
        <div class="loader"></div>
      </div>

      <div style="display: flex; justify-content: space-evenly; ">
        <button type="submit" class="addemployebutton">Submit</button>
        <button type="button" class="addemployebutton" @click="cancelemplo">Cancel</button>
      </div>
    </form>
  </div>

</template>


<script setup>
import { cancelemplo, addem, seemplo, blurTable } from '@/views/employeelist.vue';

</script>

<script>
import { ref } from 'vue';
import axios from 'axios';




export default {
  cancelemplo() {
    addem.value = false
    blurTable.value = false
  },
  data() {
    return {
      formData: {
        firstName: '',
        middleInit: '',
        lastName: '',
        division: '',
        position: '',
        customPosition: '',
      },
      positions: [],
      divisions: [],
      customPositionEnabled: false,
      loadis: false
    };
  },
  methods: {

    submitForm() {
      this.loadis = true
      const positionName = this.customPositionEnabled ? this.formData.customPosition : this.formData.position;

      const dataToSend = {
        first_name: this.formData.firstName,
        last_name: this.formData.lastName,
        position_name: positionName,
        division_name: this.formData.division,
      };
      if (this.formData.middleInit !== '') {
        dataToSend.middle_init = this.formData.middleInit.toUpperCase().endsWith('.') ? this.formData.middleInit.toUpperCase() : this.formData.middleInit.toUpperCase() + '.';

      }
      
      axios.post('http://192.168.1.250:8000/add_employees', dataToSend)
        .then(response => {
          console.log('Response:', response.data);
          this.formData = {
            firstName: '',
            middleInit: '',
            lastName: '',
            division: '',
            position: '',
            customPosition: '',
          };

          addem.value = false;
          blurTable.value = false
          seemplo();

        })
        .catch(error => {
          console.error('Error submitting form:', error);
        });
    },
    fetchPositions() {
      fetch('http://192.168.1.250:8000/get_positions_json/')
        .then(response => response.json())
        .then(data => {
          this.positions = data;
        })
        .catch(error => {
          console.error('Error fetching positions:', error);
        });
    },
    fetchDivisions() {
      fetch('http://192.168.1.250:8000/get_divisions_json/')
        .then(response => response.json())
        .then(data => {
          this.divisions = data;
        })
        .catch(error => {
          console.error('Error fetching divisions:', error);
        });
    },
  },
  mounted() {
    this.fetchPositions();
    this.fetchDivisions();
  },
};
</script>

<style>
.addemployebutton {
  border-radius: 7px;
  width: 20%;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
}

.container {
  cursor: pointer;
  top: 2px;
  left: 83px;
  position: relative;

}

.container input {

  display: none;
}

.container svg {
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

.container input:checked~svg .path {
  stroke-dasharray: 70.5096664428711 9999999;
  stroke-dashoffset: -262.2723388671875;
}

.label1{
  font-size: 20px; 
  display: flex; 
  flex-direction: row; 
  justify-content: space-evenly;
}
.label2{
  font-size: 20px; 
  display: flex; 
  flex-direction: row; 
  justify-content: space-evenly; 
  margin-left: -40px;
}
.input1{
  display: flex; 
  flex-direction: row; 
  justify-content: space-evenly; 
  margin-left: -3px; 
  margin-bottom: 10px;
}
.input2{
  display: flex; 
  flex-direction: row;  
  margin-left: 15px; 
  margin-bottom: 15px;
}
.AddEmp{
  display: flex; 
  justify-content: center; 
  font-weight: bold; 
  font-size: 28px; 
  margin-top: -5px; 
  margin-bottom: 10px;
}
.inputszxc{
  border:1px solid black; 
  width: 160px;
  margin: 10px;
}
.inputszxc1{
  border:1px solid black; 
  width: 160px; 
  position: relative; 
  left: -7px
}
.inputszxc2{
  border:1px solid black; 
  width: 160px; 
  position: relative; 
  left: 20px
}
.inputszxc3{
  border:1px solid black; 
  width: 160px; 
  position: relative; 
  left: 45px
}
@media (max-width: 768px) {
  .label1, .label2, .input1, .input2{
    font-size: 10px;
  }
  .inputszxc{
  border:1px solid black; 
  width: 100px;
}
.inputszxc1{
  border:1px solid black; 
  width: 100px; 
  position: relative; 
}
.inputszxc2{
  border:1px solid black; 
  width: 100px; 
  position: relative; 
}
.inputszxc3{
  border:1px solid black; 
  width: 100px; 
  position: relative; 
}
.container{
  left: 70px;
  top: 0px;
}

}
</style>