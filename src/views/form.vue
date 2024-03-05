<template>
 <div class="first">
   <div class="second">
      <p class="form">Travel Order Form</p>

         <div class="inside">
            <div style="display: flex; flex-direction: column;  width: 100%;">
               <label class="n">Name:</label>
               <input type="type" v-model="name"  class = 'namein' required @input="convertToUpperCase" placeholder="name">

               <label class="p"> Position: </label>
               <input type="text" v-model="position" class = 'positionin' required readonly>

               <label class="dd"> Depature Date: </label>
               <input type="date" v-model="departure" class = 'departurein' required>

               <label class="d"> Destination: </label>
               <input type="text" v-model="destination" class = 'destinationin' required>


            </div>
            <div style="display: flex; flex-direction: column;  width: 100%;">
               <label class="da"> Date: </label>
               <input type="type" v-model="date" class = 'datein' required readonly>

               <label class="ds"> Division/Section: </label>
               <input type="text" v-model="division" class = 'divisionin' required readonly>

               <label class="os"> Official Station:</label>
               <input type="text" v-model="station" class = 'stationin' required readonly>

               <label class="ad"> Arrival Date: </label>
               <input type="date" v-model="arrival" class = 'arrivalin' required>
            </div>
         </div>
      
         <div style="display: flex; flex-direction: column; justify-content: center; ">
            <label class="pt"> Purpose of Travel: </label>
            <input type="text" v-model="purpose" class = 'purposein' required>

            <label class="per"> Per Deims/Expense Allowed</label>
            <input type="text" v-model="pdea" class = 'pdeain' required>

            <label class="al"> Assistants or Laborer Allowed: </label>
            <input type="text" v-model="ala" class = 'alain' required>

            <label class="at"> Appropriations to which travel ahould be charged: </label>
            <input type="text" v-model="appropriation" class = 'appropriationin' required>

            <label class="r"> Remarks or Special Instructios: </label>
            <input type="text" v-model="remarks" class = 'remarksin' required> 
         </div>
         <div v-if="!isValid" class="error">Please fill in the position field</div>
         <div class="buttonss">
            <button class="button" @click="submit">Submit</button>
            <button class="button" @click="submit">cancel</button>
         </div>
         
   </div>   
 </div>
 <footer style="background-color: lightgray; padding: 5px; text-align: center; height: 15px; ">
        <p style="margin-top: -5px">Team Kokkak</p>
      </footer>
</template>
 
 <script>
 export default {
   data() {
      return {
       name: '',
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
       isValid: true
      };
   },
   methods: {

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
      if (this.name ==='' ||
         this.position ===""||
         this.departure ===''|| 
         this.destination ===''|| 
         this.date ===""||
         this.division ==="" ||
         this.station ===""||
         this.arrival ===''||
         this.purpose ===''
        ){
         // alert('Please fill all the fields')
         this.isValid = false;
        setTimeout(() => {
          this.isValid = true; // Reset isValid after 3 seconds
        }, 30000);
         
       }else{
         this.isValid = true;
         console.log("name:",this.name);
         console.log("position:",this.position);
         console.log("departure:",this.departure);
         console.log("destination:",this.destination);
         console.log("purpose:",this.purpose);
         console.log("date:",this.date);
         console.log("division:",this.division);
         console.log("station:",this.station);
         console.log("arrival:",this.arrival);
         console.log("pdea:",this.pdea);
         console.log("ala:",this.ala);
         console.log("appropriation:",this.appropriation);
         console.log("remarks:",this.remarks);

         this.name=''
         this.position=""
         this.departure=''
         this.destination=''
         this.division=""
         this.purpose=''
         this.arrival=''
         this.pdea=''
         this.ala=''
         this.appropriation=''
         this.remarks=''
         
       }
     },
   },
 };
 </script>


<style scoped>
.first{
   background-color: black;
   width: 100%;
   min-height: 100vh;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
}
.second{
   display: flex;
   flex-direction: column;
   border-radius: 25px;
   background-color: #f56e06;
   width: 80vw; /* Set width to a percentage of the viewport width */
   max-width: 950px; /* Set a maximum width */
   height: auto; /* Let the height adjust based on content */
   padding: 20px;
   color: #212121;
}
.second.zoomed {
  transform: scale(2); /* Zoom in by a factor of 2 */
}

.form{
   font-weight:bold;
   font-size: 25px;
}
.namein,.positionin,.departurein,.destinationin,
.datein,.divisionin,.stationin,.arrivalin
{
   border-radius: 5px;
   width: 90%;
   height: 30px;
}

.pdeain,.alain,.purposein,.appropriationin,.remarksin{
   border-radius: 5px;
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
   flex-direction: row;
   height: 40px;
   justify-content: space-around;
   margin-top: 15px;
}

.button{
   border-radius: 10px;
   width: 30%;
}

@media (max-width: 768px) {
  .first{
   margin-top: -120px;
   height: 130vh;
  }
   .inside {
    flex-direction: column;
   }
  .pdeain,.alain,.purposein,.appropriationin,.remarksin{
      border-radius: 5px;
      width: 90%;
      height: 30px;
   }


}

</style>
