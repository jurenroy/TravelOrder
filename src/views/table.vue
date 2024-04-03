<template>
  <div style="display: flex; flex-direction: column; ">
    
    <h2 style="display: flex; flex-direction: column; align-items: center;">History</h2>
    <div v-if="load" class="loadings">
      <img src='../assets/loading.gif' width="auto" height="100px" />
    </div>
    <div style="display: flex; flex-direction: column; align-items: center;" v-if="otp">
      <otpz/>
    </div>
    <div class="note" v-if="addNote">
    <!-- Title and Close Icon -->
    <div class="title-bar">
      <div class="title">Add note</div>
      <div class="close-icon" @click="closeNote">X</div>
    </div>

    <!-- Content -->
    <div class="content">
      <textarea v-model="noteText" rows="3" placeholder="Enter your note here"></textarea>
      <div class="butokz">
      <button @click="postNote">Save</button>
      <button @click="postNote">Cancel</button>
      </div>
    </div>
  </div>
  <div class="note" v-if="viewNote">
    <!-- Title and Close Icon -->
    <div class="title-bar">
      <div class="title">View note</div>
      <div class="close-icon" @click="closeNote">X</div>
    </div>

    <!-- Content -->
    <div class="content">
      <textarea v-model="noteText" rows="3" readonly></textarea>
      <div class="butokz">
      <button @click="closeNote">Close</button>
      </div>
    </div>
  </div>

    <div v-if="mawala" class="outer">
      <div class="scrollable-table">
        <table>
          <thead>
            <tr>
              <th>TO No.</th>
              <th>Name</th>
              <th>Departure Date</th>
              <th>Destination</th>
              <th>Purpose</th>
              <th>Arrival Date</th>
              <th>Date</th>
              <th>Action</th>
              <!-- Add more table headers as needed -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in reversedFormData" :key="item.id">
              <td>{{ padWithZeroes(item.travel_order_id) }} - {{ yearToday }}</td>
              <td>{{ getName(item.name_id) }}</td>
              <td>{{ item.departure }}</td>
              <td>{{ item.destination }}</td>
              <td>{{ item.purpose }}</td>
              <td>{{ item.arrival }}</td>
              <td>{{ item.date }}</td>
              <td style="display: flex; justify-content: center;">
                <button v-if="selectedTravelOrderId != item.travel_order_id"
                  @click="openPDF(item.travel_order_id)">PDF</button>
                <button v-if="selectedTravelOrderId == item.travel_order_id" @click="close">Close</button>
              </td>
              <td v-if="siga" style="display: flex; justify-content: center;"><button
                  @click="signature1(item.travel_order_id)">Recommend</button></td>
              <td v-if="siga && item.travel_order_id !== notenum && item.note == null && acc.name_id == 37 " style="display: flex; justify-content: center;"><button
                  @click="openNote(item.travel_order_id)">Add note</button></td>
                  <td v-if="siga && addNote == true && item.travel_order_id == notenum && acc.name_id == 37 " style="display: flex; justify-content: center;"><button
                  @click="closeNote()">Close Add note</button></td>
              <td v-if="item.note !== null && notenum !== item.travel_order_id" style="display: flex; justify-content: center;"><button
                  @click="viewNotez(item.note,item.travel_order_id)">View note</button></td>
              <td v-if="item.note !== null && notenum == item.travel_order_id" style="display: flex; justify-content: center;"><button
                  @click="closeNote()">Close View note</button></td>
              <td v-if="siga1" style="display: flex; justify-content: center;"><button
                  @click="signature2(item.travel_order_id)">Approve</button></td>
              <!-- Add more table data cells as needed -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-show="selectedTravelOrderId" style="height: 0px;">
      <pdf :travel_order_id="selectedTravelOrderId"></pdf>
    </div>
  </div>
  </template>
  
  <script>
  import axios from 'axios';
  import pdf from './pdf.vue'
  import otpz from '../components/otp.vue';
  
  import { useAuthStore } from '../store/auth';
  
  export default {
  provide() {
    return {
      close: this.close,
    };
  }, 
    components: {
      pdf,
      otpz
    },
    mounted() {
      this.fetchAccounts();
      this.fetchEmployees();
      this.fetchNames();
    },
    data() {
      return {
        yearToday: new Date().getFullYear(),
        formData: [],
        names: {},
        employees: {},
        selectedTravelOrderId: 0,
        accountId: localStorage.getItem('accountId'),
        acc: [],
        imageUrl: '',
        siga: '',
        siga1: '',
        otp: false,
        verifiedOTPs: localStorage.getItem('verifiedOTPs'),
        load: true,
        mawala: false,
        addNote: false,
        viewNote: false,
        notenum: 0,
        noteText: ''
      };
    },
    created() {
    // Watch for changes in localStorage and update verifiedOTPs accordingly
    window.addEventListener('storage', this.updateVerifiedOTPs);
  },
  destroyed() {
    // Cleanup the event listener when the component is destroyed
    window.removeEventListener('storage', this.updateVerifiedOTPs);
  },
  methods: {
    viewNotez(nutz,numx) {
      this.viewNote = true,
      console.log("Note opened");
      this.noteText = nutz
      this.notenum = numx
    },
    openNote(numz) {
      this.addNote = true,
      this.notenum = numz
      console.log("Note opened");
      this.noteText = ''
    },
    closeNote() {
      this.addNote = false,
      this.viewNote = false,
      this.notenum = 0
      console.log("Note closed");
    },
    postNote() {
      // Axios POST request logic here
      const formData = new FormData();
      formData.append('note', this.noteText);

      axios.post(`http://172.31.10.148:8000/update_form/${this.notenum}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.fetchData();
        this.selectedTravelOrderId = 0;
        useAuthStore().updateVerifiedOTPs('false');
        localStorage.setItem('verifiedOTPs', 'false');
        this.otp = false;
      }).catch(error => {
        console.error('Error:', error);
      });

      console.log("Note posted:", this.noteText);
      this.closeNote()
    },
    updateVerifiedOTPs(event) {
      if (event.key === 'verifiedOTPs') {
        this.verifiedOTPs = event.newValue;
      }
    },
    async signature1(form_id) {
      
      console.log(this.verifiedOTPs)
      this.otp = true;
      
      console.log(this.verifiedOTPs)
      await this.waitForVerifiedOTPs(); // Wait for verifiedOTPs to become true
      this.otp = false;

      const formData = new FormData();
      formData.append('signature1', this.acc.signature);

      axios.post(`http://172.31.10.148:8000/update_form/${form_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.fetchData();
        this.selectedTravelOrderId = 0;
        useAuthStore().updateVerifiedOTPs('false');
        localStorage.setItem('verifiedOTPs', 'false');
        this.otp = false;
      }).catch(error => {
        console.error('Error:', error);
      });
    },

    async signature2(form_id) {
      this.otp = true;
      await this.waitForVerifiedOTPs(); // Wait for verifiedOTPs to become true
      this.otp = false;

      const formData = new FormData();
      formData.append('signature2', this.acc.signature);

      axios.post(`http://172.31.10.148:8000/update_form/${form_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.fetchData();
        this.selectedTravelOrderId = 0;
        useAuthStore().updateVerifiedOTPs('false');
        localStorage.setItem('verifiedOTPs', 'false');
        this.otp = false;
      }).catch(error => {
        console.error('Error:', error);
      });
    },

    async waitForVerifiedOTPs() {
      while (this.verifiedOTPs == 'false') {
        await new Promise(resolve => setTimeout(resolve, 1000), this.verifiedOTPs = localStorage.getItem('verifiedOTPs')); // Wait for 10 seconds
      }
    },

    padWithZeroes(travel_order_id) {
      // Convert travel_order_id to string
      const idString = travel_order_id.toString();
      // Check if the length is less than 4
      if (idString.length < 4) {
        // Pad with zeroes to make it four digits
        return '0'.repeat(4 - idString.length) + idString;
      } else {
        // If already four digits, return as is
        return idString;
      }
    },
    fetchAccounts() {
      axios.get('http://172.31.10.148:8000/get_accounts_json')
        .then(response => {
          this.acc = response.data.find(result => result.account_id == this.accountId);
          this.fetchData()
          if (this.acc) {
            this.imageUrl = `http://172.31.10.148:8000/storage/${this.acc.signature}`;
        }
        useAuthStore().updateVerifiedOTPs('false');
        localStorage.setItem('verifiedOTPs', 'false');
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },

    fetchData() {
      this.load = true
      axios.get('http://172.31.10.148:8000/get_forms_json')
        .then(response => {
          this.mawala = true;
          this.load = false

          if (this.acc.type_id == 2) {
            this.formData = response.data.filter(form => form.name_id == this.acc.name_id);
            this.siga = false
          } else if (this.acc.name_id == 20) {
            this.formData = response.data.filter(form => form.signature2 === null && form.signature1 !== null || form.division_id === 5);
            this.siga1 = true
          } else if (this.acc.type_id == 3) {
            const division_id = this.employees.find(name => name.name_id == this.acc.name_id).division_id;
            this.formData = response.data.filter(form => form.division_id == division_id && form.signature1 === null);
            this.siga = true
          } else if (this.acc.type_id == 1) {
            this.formData = response.data;
            this.siga = false
          }

        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    fetchNames() {
      axios.get('http://172.31.10.148:8000/get_names_json')
        .then(response => {
          this.names = response.data;
        })
        .catch(error => {
          console.error('Error fetching names:', error);
        });
    },
    fetchEmployees() {
      axios.get('http://172.31.10.148:8000/get_employees_json')
        .then(response => {
          this.employees = response.data;
        })
        .catch(error => {
          console.error('Error fetching employeess:', error);
        });
    },
    getName(nameId) {
      const name = this.names[nameId - 1];
      if (name) {
        const { first_name, middle_init, last_name } = name;
        return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
      }
      return 'Unknown';
    },
    openPDF(travelOrderId) {
      // Set the selected travel order ID
      this.selectedTravelOrderId = travelOrderId;
      useAuthStore().updateVerifiedOTPs('false');
      localStorage.setItem('verifiedOTPs', 'false');
    },
    close() {
      this.selectedTravelOrderId = 0
    },

    updateVisibleItems() {
      this.visibleItems = this.formData.slice(0, 20);
      // this.visibleItems = this.formData.slice(-20).reverse();
    },


  },

  computed: {
    reversedFormData() {
      return this.formData.slice().reverse();
    }
  }


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
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  position: sticky;
  top: -2px;
}

.scrollable-table {
  max-height: 630px;
  overflow-y: auto;
  margin: 15px;
}

.outer {
  border: 1px solid black;
  /* box-shadow: 0px 0px 3px black; */
  box-shadow: 0px 0px 10px black, 0px 0px 10px black inset;
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
  background-color: #656867;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  width: fit-content;
}
button:hover {
  background-color: #141414;
  color: white;
}

</style>
