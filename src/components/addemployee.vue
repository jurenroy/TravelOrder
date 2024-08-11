<template>
  <div>
    <form @submit.prevent="submitForm">
      <div
        style="
          font-size: 20px;
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          margin-left: -80px;
        "
      >
        <label for="firstName">First Name:</label>
        <label for="middleInit" style="left: 7px; position: relative"
          >Middle Initial:</label
        >
        <label for="lastName" style="left: -7px; position: relative"
          >Last Name:</label
        >
      </div>

      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          margin-left: -3px;
          margin-bottom: 10px;
        "
      >
        <!-- Fist Name -->
        <input
          style="border: 1px solid black; width: 160px"
          type="text"
          id="firstName"
          v-model="formData.firstName"
          @keydown.enter="submitForm"
          required
        /><br />
        <!-- Middle Name -->
        <input
          style="border: 1px solid black; width: 160px"
          type="text"
          id="middleInit"
          v-model="formData.middleInit"
          maxlength="1"
          @keydown.enter="submitForm"
        /><br />
        <!-- Last Name -->
        <input
          style="border: 1px solid black; width: 160px"
          type="text"
          id="lastName"
          v-model="formData.lastName"
          @keydown.enter="submitForm"
          required
        /><br />
      </div>

      <div
        style="
          font-size: 20px;
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          margin-left: -60px;
        "
      >
        <label for="division">Division:</label>
        <label for="position" style="left: 50px; position: relative"
          >Position:</label
        >
        <!-- custom position -->
        <label class="container">
          <input
            type="checkbox"
            id="customPosition"
            v-model="customPositionEnabled"
          />
          <svg viewBox="0 0 64 64" height="2em" width="2em">
            <path
              d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
              pathLength="575.0541381835938"
              class="path"
            ></path>
          </svg>
        </label>

        <label for="customPosition" style="left: 25px; position: relative"
          >Custom Position</label
        >
      </div>

      <div
        style="
          display: flex;
          flex-direction: row;
          margin-left: 15px;
          margin-bottom: 15px;
        "
      >
        <!-- division -->
        <select
          style="
            border: 1px solid black;
            width: 160px;
            position: relative;
            left: -3px;
          "
          id="division"
          v-model="formData.division"
          @keydown.enter="submitForm"
          required
        >
          <option
            v-for="division in divisions"
            :key="division.division_id"
            :value="division.division_name"
          >
            {{ division.division_name }}
          </option></select
        ><br />
        <!-- Position -->
        <select
          style="
            border: 1px solid black;
            width: 160px;
            position: relative;
            left: 34px;
          "
          id="position"
          v-model="formData.position"
          z
          required
          :disabled="customPositionEnabled"
          @keydown.enter="submitForm"
        >
          <option
            v-for="position in positions"
            :key="position.position_id"
            :value="position.position_name"
          >
            {{ position.position_name }}
          </option>
        </select>
        <!-- Custom Position -->
        <input
          style="
            border: 1px solid black;
            width: 160px;
            position: relative;
            left: 70px;
          "
          type="text"
          id="customPositionInput"
          v-model="formData.customPosition"
          v-if="customPositionEnabled"
          placeholder="Enter Custom Position"
          @keydown.enter="submitForm"
          required
        /><br />
      </div>

      <div v-if="loadis" class="loadid">
        <div class="loader"></div>
      </div>

      <div style="display: flex; justify-content: space-evenly">
        <button type="submit" class="addemployebutton">Submit</button>
        <button type="button" class="addemployebutton" @click="cancelemplo">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {
  cancelemplo,
  addem,
  seemplo,
  blurTable,
} from "@/views/employeelist.vue";
</script>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  cancelemplo() {
    addem.value = false;
    blurTable.value = false;
  },
  data() {
    return {
      formData: {
        firstName: "",
        middleInit: "",
        lastName: "",
        division: "",
        position: "",
        customPosition: "",
      },
      positions: [],
      divisions: [],
      customPositionEnabled: false,
      loadis: false,
    };
  },
  methods: {
    submitForm() {
      this.loadis = true;
      // Set position_name based on customPositionEnabled
      const positionName = this.customPositionEnabled
        ? this.formData.customPosition
        : this.formData.position;

      // Prepare data to send
      const dataToSend = {
        first_name: this.formData.firstName,
        last_name: this.formData.lastName,
        position_name: positionName,
        division_name: this.formData.division,
      };
      // Check if middle_init is not empty before adding it to dataToSend
      if (this.formData.middleInit !== "") {
        // dataToSend.middle_init = this.formData.middleInit + '.';
        dataToSend.middle_init = this.formData.middleInit
          .toUpperCase()
          .endsWith(".")
          ? this.formData.middleInit.toUpperCase()
          : this.formData.middleInit.toUpperCase() + ".";
      }

      axios
        .post("http://172.31.10.164:8000/add_employees", dataToSend)
        .then((response) => {
          console.log("Response:", response.data);
          // Reset form data
          this.formData = {
            firstName: "",
            middleInit: "",
            lastName: "",
            division: "",
            position: "",
            customPosition: "",
          };

          addem.value = false;
          blurTable.value = false;
          seemplo();
          // Emit an event to indicate that an employee has been added
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        });
    },
    fetchPositions() {
      fetch("http://172.31.10.164:8000/get_positions_json/")
        .then((response) => response.json())
        .then((data) => {
          this.positions = data;
        })
        .catch((error) => {
          console.error("Error fetching positions:", error);
        });
    },
    fetchDivisions() {
      fetch("http://172.31.10.164:8000/get_divisions_json/")
        .then((response) => response.json())
        .then((data) => {
          this.divisions = data;
        })
        .catch((error) => {
          console.error("Error fetching divisions:", error);
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
  left: 95px;
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
</style>
