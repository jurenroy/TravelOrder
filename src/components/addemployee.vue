<template>
  <div>
    <form @submit.prevent="submitForm">
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="formData.firstName" required><br>

      <label for="middleInit">Middle Initial:</label>
      <input type="text" id="middleInit" v-model="formData.middleInit"><br>

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="formData.lastName" required><br>

      <label for="division">Division:</label>
      <select id="division" v-model="formData.division" required>
        <option v-for="division in divisions" :value="division.division_name">{{ division.division_name }}</option>
      </select><br>

      <label for="position">Position:</label>
      <select id="position" v-model="formData.position" :disabled="customPositionEnabled" required>
        <option v-for="position in positions" :value="position.position_name">{{ position.position_name }}</option>
      </select>
      <input type="checkbox" id="customPosition" v-model="customPositionEnabled">
      <label for="customPosition">Custom Position</label><br>

      <input type="text" id="customPositionInput" v-model="formData.customPosition" :disabled="!customPositionEnabled" placeholder="Enter Custom Position"><br>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
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
    };
  },
  methods: {
    submitForm() {
      // Set position_name based on customPositionEnabled
      const positionName = this.customPositionEnabled ? this.formData.customPosition : this.formData.position;

      // Prepare data to send
      const dataToSend = {
        first_name: this.formData.firstName,
        middle_init: this.formData.middleInit,
        last_name: this.formData.lastName,
        position_name: positionName,
        division_name: this.formData.division,
      };

      axios.post('http://172.31.10.164:8000/add_employees', dataToSend)
        .then(response => {
          console.log('Response:', response.data);
          // Reset form data
          this.formData = {
            firstName: '',
            middleInit: '',
            lastName: '',
            division: '',
            position: '',
            customPosition: '',
          };
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        });
    },
    fetchPositions() {
      fetch('http://172.31.10.164:8000/get_positions_json/')
        .then(response => response.json())
        .then(data => {
          this.positions = data;
        })
        .catch(error => {
          console.error('Error fetching positions:', error);
        });
    },
    fetchDivisions() {
      fetch('http://172.31.10.164:8000/get_divisions_json/')
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
