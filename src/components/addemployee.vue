<template>
  <div style="width: fit-content; background: linear-gradient(180deg, #f0c36d, #b8860b); padding: 10px;">
    <p class="AddEmp">Add Employee</p>
    <form @submit.prevent="submitForm">
      <div class="label1">
        <label for="firstName" style="margin-left: -40px;">First Name:</label>
        <label for="middleInit" style="margin-left: 10px;">Middle Initial:</label>
        <label for="lastName" style="margin-left: 5px;">Last Name:</label>
      </div>

      <div class="input1">
        <input class="inputszxc" type="text" id="firstName" v-model="formData.firstName" @keydown.enter="submitForm" required><br>
        <input class="inputszxc" type="text" id="middleInit" v-model="formData.middleInit" maxlength="1" @keydown.enter="submitForm"><br>
        <input class="inputszxc" type="text" id="lastName" v-model="formData.lastName" @keydown.enter="submitForm" required><br>
      </div>

      <div class="label2">
        <label for="division">Division:</label>
        <label for="position" style="left: 50px; position: relative;">Position:</label>
        <label class="container">
          <input type="checkbox" id="customPosition" v-model="customPositionEnabled">
          <svg viewBox="0 0 64 64" height="2em" width="2em">
            <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" class="path"></path>
          </svg>
        </label>
        <label for="customPosition" style="left: 25px; position: relative;">Custom Position</label>
      </div>

      <div class="input2">
        <select id="division" class="inputszxc1" v-model="formData.division" @keydown.enter="submitForm" required>
          <option v-for="division in divisions" :key='division.division_id' :value="division.division_name">{{ division.division_name }}</option>
        </select>
        <select id="position" class="inputszxc2" v-model="formData.position" required :disabled="customPositionEnabled" @keydown.enter="submitForm">
          <option v-for="position in positions" :key='position.position_id' :value="position.position_name">{{ position.position_name }}</option>
        </select>
        <input type="text" class="inputszxc3" id="customPositionInput" v-model="formData.customPosition" v-if="customPositionEnabled" placeholder="Enter Custom Position" @keydown.enter="submitForm" required>
      </div>

      <div v-if="loadis" class="loadid">
        <div class="loader"></div>
      </div>

      <div style="display: flex; justify-content: space-evenly;">
        <button type="submit" class="addemployebutton">Submit</button>
        <button type="button" class="addemployebutton" @click="cancelemplo">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const props = defineProps({
  divisions: {
    type: Array,
    required: true
  },
  positions: {
    type: Array,
    required: true
  },
  onSubmit: {
    type: Function,
    required: true
  },
  onCancel: {
    type: Function,
    required: true
  }
});

const formData = ref({
  firstName: '',
  middleInit: '',
  lastName: '',
  division: '',
  position: '',
  customPosition: '',
});

const customPositionEnabled = ref(false);
const loadis = ref(false);

const submitForm = () => {
  loadis.value = true;
  const positionName = customPositionEnabled.value ? formData.value.customPosition : formData.value.position;

  const dataToSend = {
    first_name: formData.value.firstName,
    last_name: formData.value.lastName,
    position_name: positionName,
    division_name: formData.value.division,
  };

  if (formData.value.middleInit !== '') {
    dataToSend.middle_init = formData.value.middleInit.toUpperCase().endsWith('.') ? formData.value.middleInit.toUpperCase() : formData.value.middleInit.toUpperCase() + '.';
  }

  axios.post(`${API_BASE_URL}/add_employees`, dataToSend)
    .then(response => {
      console.log('Response:', response.data);
      formData.value = {
        firstName: '',
        middleInit: '',
        lastName: '',
        division: '',
        position: '',
        customPosition: '',
      };
      props.onSubmit();
    })
    .catch(error => {
      console.error('Error submitting form:', error);
    })
    .finally(() => {
      loadis.value = false;
    });
};

const cancelemplo = () => {
  props.onCancel();
};
</script>

<style scoped>
.addemployebutton {
  border-radius: 7px;
  width: 20%;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  background-color: black;
  color: white;
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

.container input:checked ~ svg .path {
  stroke-dasharray: 70.5096664428711 9999999;
  stroke-dashoffset: -262.2723388671875;
}

.label1 {
  font-size: 20px; 
  display: flex; 
  flex-direction: row; 
  justify-content: space-evenly;
}

.label2 {
  font-size: 20px; 
  display: flex; 
  flex-direction: row; 
  justify-content: space-evenly; 
  margin-left: -40px;
}

.input1 {
  display: flex; 
  flex-direction: row; 
  justify-content: space-evenly; 
  margin-left: -3px; 
  margin-bottom: 10px;
}

.input2 {
  display: flex; 
  flex-direction: row;  
  margin-left: 15px; 
  margin-bottom: 15px;
}

.AddEmp {
  display: flex; 
  justify-content: center; 
  font-weight: bold; 
  font-size: 28px; 
  margin-top: -5px; 
  margin-bottom: 10px;
}

.inputszxc {
  border: 1px solid black; 
  width: 160px;
  margin: 10px;
}

.inputszxc1 {
  border: 1px solid black; 
  width: 160px; 
  position: relative; 
  left: -7px;
}

.inputszxc2 {
  border: 1px solid black; 
  width: 160px; 
  position: relative; 
  left: 20px;
}

.inputszxc3 {
  border: 1px solid black; 
  width: 160px; 
  position: relative; 
  left: 45px;
}

@media (max-width: 768px) {
  .label1, .label2, .input1, .input2 {
    font-size: 10px;
  }
  
  .inputszxc, .inputszxc1, .inputszxc2, .inputszxc3 {
    border: 1px solid black; 
    width: 100px;
  }

  .container {
    left: 70px;
    top: 0px;
  }
}
</style>