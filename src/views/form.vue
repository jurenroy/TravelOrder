<template>
   <div class=zero style="display: flex; justify-content: center;" v-if="isVisible">
      <div class="first">
         <div class="second">
            <p class="form">Fill up Form</p>

         <div class="inside">
            <div style="display: flex; flex-direction: column;  width: 100%;">
               <label class="n">Name:</label>
                  <!-- Dropdown for names -->
               <select v-model="selectedName" class='inputsss' id='namein' style="height: 35px; border: 2px solid black; width: 90%;" required>
                  <option v-for="name in names" :key="name.name_id" :value="name.name_id">{{ name.last_name }}, {{ name.first_name }} {{ name.middle_init }}</option>
               </select>

                     <label class="p"> Position: </label>
                     <input type="text" v-model="position" class ='inputsss'  id = 'positionin' required readonly>

                     <label class="dd"> Depature Date: </label>
                     <input type="date" v-model="departure" class ='inputsss'  id = 'departurein' required>

                     <label class="d"> Destination: </label>
                     <input type="text" v-model="destination" class ='inputsss'  id = 'destinationin' required>


                  </div>
                  <div style="display: flex; flex-direction: column;  width: 100%;">
                     <label class="da"> Date: </label>
                     <input type="type" v-model="date" class ='inputsss'  id = 'datein' required readonly>

                     <label class="ds"> Division/Section: </label>
                     <input type="text" v-model="division" class ='inputsss'  id = 'divisionin' required readonly>

                     <label class="os"> Official Station:</label>
                     <input type="text" v-model="station" class ='inputsss'  id = 'stationin' required readonly>

                     <label class="ad"> Arrival Date: </label>
                     <input type="date" v-model="arrival" class ='inputsss'  id = 'arrivalin' required>
                  </div>
               </div>
            
               <div style="display: flex; flex-direction: column; justify-content: center; ">
                  <label class="pt"> Purpose of Travel: </label>
                  <input type="text" v-model="purpose" class ='inputss'  id = 'purposein' required>

                  <label class="per"> Per Deims/Expense Allowed</label>
                  <input type="text" v-model="pdea" class ='inputss'  id = 'pdeain' required>

                  <label class="al"> Assistants or Laborer Allowed: </label>
                  <input type="text" v-model="ala" class ='inputss'  id = 'alain' required>

                  <label class="at"> Appropriations to which travel ahould be charged: </label>
                  <input type="text" v-model="appropriation" class ='inputss'  id = 'appropriationin' required>

                  <label class="r"> Remarks or Special Instructios: </label>
                  <input type="text" v-model="remarks" class ='inputss'  id = 'remarksin' required> 
               </div>

               <div v-if="isValid" class="error">
                  <a class="errormsg1">
                     Warning Alert!!
                  </a>
                  <a class="errormsg">
                     Please Fill out the Text Fields
                  </a>
               </div>

         <div class="buttonss">
            <button class="button" @click="submit">Submit</button>
         </div>
         
   </div>   
 </div>
   </div>
</template>



<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  data() {
    return {
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
      employees: [],
      positions: [],
      divisions: [],
      positionID: '',
      divisionID: '',
    };
  },
  methods: {
   // Function to fetch the selected employee based on selectedName
   fetchSelectedEmployee() {
    if (this.selectedName) {
      const selectedEmployee = this.employees.find(employee => employee.name_id === this.selectedName);
      console.log(selectedEmployee); // Correct logging variable name
      if (selectedEmployee) {
         this.positionID = selectedEmployee.position_id
         this.divisionID = selectedEmployee.division_id
        this.position = this.findPositionName(selectedEmployee.position_id);
        this.division = this.findDivisionName(selectedEmployee.division_id);

      }
    }
    },
    // Function to find the employee's position name based on their position_id
    findPositionName(positionId) {
      const matchedPosition = this.positions.find(position => position.position_id === positionId);
      return matchedPosition ? matchedPosition.position_name : '';
    },
    // Function to find the employee's division name based on their division_id
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
      let mm = today.getMonth() + 1; // January is 0!
      const yyyy = today.getFullYear();
      if (dd < 10) {
        dd = `0${dd}`;
      }
      if (mm < 10) {
        mm = `0${mm}`;
      }
      return `${yyyy}-${mm}-${dd}`;
    },
    submit() {
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
        };

        axios.post('http://127.0.0.1:8000/add_form/', formData)
        .then(response => {
          if (response.status === 200) {
            this.resetForm();
            console.log('Form submitted successfully');
          } else {
            throw new Error('Failed to submit form');
          }
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        });
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
      window.location.reload();
    },
    fetchData() {
      fetch('http://127.0.0.1:8000/get_names_json/')
        .then(response => response.json())
        .then(data => {
          this.names = data;
        })
        .catch(error => {
          console.error('Error fetching names:', error);
        });

      fetch('http://127.0.0.1:8000/get_employees_json/')
      .then(response => response.json())
      .then(data => {
        this.employees = data;
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
      // Fetch positions data
      fetch('http://127.0.0.1:8000/get_positions_json/')
        .then(response => response.json())
        .then(data => {
          this.positions = data;
        })
        .catch(error => {
          console.error('Error fetching positions:', error);
        });

      // Fetch divisions data
      fetch('http://127.0.0.1:8000/get_divisions_json/')
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
    selectedName: 'fetchSelectedEmployee', // Watch for changes in selectedName
  },
  mounted() {
    this.fetchData();
  },
};
</script>



<style scoped>
.first{
   width: 20%;
   min-height: 10vh;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
}
.second{
   display: flex;
   flex-direction: column;
   border-radius: 25px;
   background-color: white;
   width: 80vw; /* Set width to a percentage of the viewport width */
   max-width: 950px; /* Set a maximum width */
   height: auto; /* Let the height adjust based on content */
   padding: 20px;
   color: #212121;
   border: 2px solid black;
   box-shadow: 0px 0px 35px -2px black;
}
.second.zoomed {  
  transform: scale(2); /* Zoom in by a factor of 2 */
}

.form{
   font-weight:bold;
   font-size: 25px;
   margin-top: -5px;
}
.inputsss
{
   font-size: 18px;
   border-radius: 5px;
   width: 90%;
   height: 30px;
}

.inputss{
   border-radius: 5px;
   font-size: 18px;
   width: 95%;
   height: 30px;
}

.n,.p,.dd,.d,.pt,
.da,.ds,.os,.ad,
.per,.al,.at,.r{
   text-align: left;
   font-weight: bold;
   font-size: 22px;
}

.inside {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.buttonss{
   display: flex; 
   position: relative;
   flex-direction: row;
   height: 40px;
   justify-content: space-around;
   margin-top: 8px;

}

.button{
   border-radius: 10px;
   width: 30%;
   font-weight: bold;
   font-size: 20px;
   cursor: pointer;
}

.error{
   width: fit-content; /* Adjust width based on content */
   justify-self: center;
   display: flex;
   flex-direction: column;
   border: 1px solid #212121;
   background-color: #fff3cd;
   padding: 10px;
   margin: 10px auto;
   border-radius: 10px;
   box-shadow: 0px 0px 35px -2px #fff3cd;
}

.errormsg1{
   height: 20px;
   width: 100%;
   text-align: center;
   color:red;
   
}

.errormsg{
   height: 20px;
   width: 100%;
   text-align: center;
}

@media (max-width: 768px) {
  .first{
   margin-top: -120px;
   height: 130vh;
  }
   .inside {
    flex-direction: column;
   }
  .inputss{
      border-radius: 5px;
      width: 90%;
      height: 30px;
   }

.zero{
   margin-top: 40px;
}
}

</style>