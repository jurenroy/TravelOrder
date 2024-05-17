<template>
  <div style="display: flex; flex-direction: column;">

    <h2 style="display: flex; flex-direction: column; align-items: center;" class="hist">History</h2>
    <div v-if="load" class="loadings">
      <img src='../assets/loading.gif' width="auto" height="100px" />
    </div>
    <div style="display: flex; flex-direction: column; align-items: center;" v-if="otp">
      <otpz />
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
          <button @click="closeNote">Cancel</button>
        </div>
      </div>
    </div>
    <div class="note" v-if="viewNote">
      <!-- Title and Close Icon -->
      <div class="title-bar">
        <div class="title">View note</div>
        <!-- <div class="close-icon" @click="closeNote">X</div> -->
      </div>

      <!-- Content -->
      <div class="content">
        <textarea v-model="noteText" rows="3"></textarea>
        <div class="butokz">
          <button @click="postNote" v-if="siga || siga1">Save</button>
          <button @click="closeNote">Close</button>
        </div>
      </div>
    </div>




    <div style="display: flex; flex-direction: column; align-items: flex-end; margin-top: -60px;">
      <button v-if="mawala && [2, 15, 27, 76, 39].includes(acc.name_id)" class="Btn" @click="downloadCSV">

        <div class="sign">
          <img style=" height: 40px; width:40px;" src="../assets//download_excel.png">
        </div>

        <div class="text">Download Summary Reports</div>
      </button>



      <div v-if="mawala" class="outer">
        <div class="scrollable-table">
          <table>
            <thead>
              <tr >
                <th style="text-align: center;">TO No.</th>
                <th style="text-align: center;">Name</th>
                <th style="text-align: center;">Departure Date</th>
                <th style="text-align: center;">Destination</th>
                <th style="text-align: center;">Purpose</th>
                <th style="text-align: center;">Arrival Date</th>
                <th style="text-align: center;">Date</th>
                <th style="text-align: center;">Status</th>
                <th style="text-align: center;">Action</th>
                <!-- Add more table headers as needed -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in reversedFormData" :key="item.id">
                <td>{{ padWithZeroes(item.to_num) }} - {{ yearToday }}</td>
                <td>{{ getName(item.name_id) }}</td>
                <td>{{ item.departure }}</td>
                <td>{{ item.destination }}</td>
                <td>{{ item.purpose }}</td>
                <td>{{ item.arrival }}</td>
                <td>{{ item.date }}</td>
                <td v-if="item.initial === null" style="color: red;">
                  <img src="../assets/close.png" style="height: 10px; width: 10px;">
                  To be Initialize
                </td>
                <td v-else style="color: green; ">
                  
                  <p v-if="![39, 2, 3, 8, 42, 34, 29, 36, 48, 5, 47, 15, 45, 21, 52, 51, 13, 10, 37, 62, 53, 75, 4, 56, 58, 55, 60, 59, 20].includes(item.name_id)" style="color: green; margin-top: -8px;margin-bottom: -1px">
                    <img src="../assets/check.png" style="height: 10px; width: 10px;">
                  {{ item.initial.charAt(0).toUpperCase() + item.initial.slice(1) }}</p>
                  

                  <p v-if="item.note === null" style="color: red; margin-top: 1px; margin-bottom: -15px">
                    <img src="../assets/close.png" style="height: 10px; width: 10px;">
                    To be Noted
                  </p>
                  <p v-else style="color: green; margin-top: 2px; margin-bottom: -15px;">
                    <img src="../assets/check.png" style="height: 10px; width: 10px;">
                    Noted
                  </p>
                  <p v-if="item.signature1 === null && item.note !== null  && ![15, 20, 21, 45, 48,13, 10, 37, 62, 53, 75, 4, 56, 58, 55, 60, 59].includes(item.name_id)" style="color: red;">
                    <img src="../assets/close.png" style="height: 10px; width: 10px;">
                    To be Recommend
                  </p>
                  <p v-if="item.note !== null && item.signature1 !== null && ![15, 20, 21, 45, 48, 13, 10, 37, 62, 53, 75, 4, 56, 58, 55, 60, 59].includes(item.name_id)" style="color: green; margin-bottom: -15px;">
                    <img src="../assets/check.png" style="height: 10px; width: 10px;">
                    Recommended
                  </p>



                 

                  <p v-if="item.signature2 === null && item.signature1 !== null || ([15, 20, 21, 45, 48, 13, 10, 37, 62, 53, 75, 4, 56, 58, 55, 60, 59].includes(item.name_id) && item.signature2 === null && item.note !== null)" style="color: red;">
                    <img src="../assets/close.png" style="height: 10px; width: 10px;">
                    To be Approve
                  </p>
                  <p v-if="item.signature2 !== null && item.signature1 !== null && item.note !== null || ([15, 20, 21, 45, 48, 13, 10, 37, 62, 53, 75, 4, 56, 58, 55, 60, 59].includes(item.name_id) && item.signature2 !== null)"
                    style="color: green;">
                    <img src="../assets/check.png" style="height: 10px; width: 10px;">
                    Approved
                  </p>
                </td>

                <td style="display: flex; justify-content: center;">
                  <button v-if="selectedTravelOrderId != item.travel_order_id"
                    @click="openPDF(item.travel_order_id)">PDF</button>
                  <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.travel_order_id" @click="close"
                    style="width: 40px; height: 40px; cursor: pointer;" />
                </td>





                <td v-if="siga && item.note !== null && item.signature1 == null "
                  style="display: flex; justify-content: center;"><button
                    @click="signature1(item.travel_order_id)">Recommend</button></td>

                <td v-if="item.travel_order_id !== notenum && item.note == null && acc.name_id == 37"
                  style="display: flex; justify-content: center;"><button @click="openNote(item.travel_order_id)">Add
                    note</button></td>

                <td v-if="addNote == true && item.travel_order_id == notenum && acc.name_id == 37"
                  style="display: flex; justify-content: center;"><button @click="closeNote()">Close Add note</button>
                </td>

                <td v-if="item.note !== null && notenum !== item.travel_order_id"
                  style="display: flex; justify-content: center;"><button
                    @click="viewNotez(item.note, item.travel_order_id)">View note</button></td>

                <td v-if="item.note !== null && notenum == item.travel_order_id"
                  style="display: flex; justify-content: center;">
                  <img src="/src/assets/close_note.png" @click="closeNote()"
                    style="width: 40px; height: 40px; cursor: pointer;" />
                </td>

                <td
                  v-if="((siga1 && item.note !== null) && ((item.signature1 !== null && item.division_id !== 5 && item.note !== null) || (item.signature1 === null && item.division_id === 5 && item.note !== null))) "
                  style="display: flex; justify-content: center;"><button
                    @click="signature2(item.travel_order_id)">Approve</button></td>


                    <td  v-if="isSectionChief(acc.name_id) && selectedTravelOrderId != item.travel_order_id && item.initial === null" style="display: flex; justify-content: center;">
                  <button @click="initialize(item.travel_order_id)">
                    Initial
                  </button>
                  <img src="/src/assets/exit.png" v-if="selectedTravelOrderId == item.travel_order_id" @click="close"
                    style="width: 40px; height: 40px; cursor: pointer;" />
                </td>
                <!-- Add more table data cells as needed -->
              </tr>
            </tbody>
          </table>
        </div>
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
      sectionChiefIds: [39, 2, 3, 8, 42, 34, 29, 36, 48, 5, 47],
      members: [
        [23, 25, 35, 70, 64],
        [30, 7, 26, 18, 67, 49, 24],
        [43, 40],
        [32, 50, 71],
        [33, 6],
        [41, 46, 1, 28],
        [38, 9, 65],
        [44, 22, 61, 27],
        [31, 11],
        [16, 63, 19],
        [12, 14, 72, 73]
      ],
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
      initnum: 0,
      noteText: '',
      sub: 0,
      bus: 0,
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
   

    isSectionChief(name_id) {
      return this.sectionChiefIds.includes(name_id);
    },

    downloadCSV() {
      const eds = ['Summary Report of Travel Order ']; // Placeholder for whatever 'eds' is supposed to be

      const headers = [
        'TO No.',
        'Name',
        'Date',
        'Departure Date',
        'Destination',
        'Purpose',
        'Arrival Date',
        // Add more headers as needed
      ];

      const approvedTOs = this.formData.filter(item => item.signature2 !== null && item.signature2 !== '');

      approvedTOs.sort((a, b) => a.to_num - b.to_num);

      const groupedByMonth = {};
      approvedTOs.forEach(item => {
        const yearMonthKey = new Date(item.date).toISOString().slice(0, 7); // Get YYYY-MM part of the date
        const yearKey = new Date(item.date).getFullYear().toString(); // Get YYYY part of the date
        if (!groupedByMonth[yearMonthKey]) {
          groupedByMonth[yearMonthKey] = {};
        }
        if (!groupedByMonth[yearMonthKey][yearKey]) {
          groupedByMonth[yearMonthKey][yearKey] = [];
        }
        groupedByMonth[yearMonthKey][yearKey].push(item);
      });

      const csvData = Object.keys(groupedByMonth).flatMap(yearMonthKey => {
        const monthSections = [];
        const yearData = groupedByMonth[yearMonthKey];
        Object.keys(yearData).forEach(yearKey => {
          const yearMonthDate = new Date(yearMonthKey + '-01');
          const month = yearMonthDate.toLocaleString('default', { month: 'long' });

          const yearMonthSection = [
            [`\n ${month} ${yearKey}`], // Display year and month
            headers.join(','), // Join headers into a single comma-separated string
            ...yearData[yearKey].map(item => [
              item.to_num + ' - ' + this.yearToday,
              this.getName(item.name_id),
              `${new Date(item.date).toLocaleDateString('en-US')}`,
              `${new Date(item.departure).toLocaleDateString('en-US')}`,
              item.destination,
              item.purpose,
              `${new Date(item.arrival).toLocaleDateString('en-US')}`
            ].join(','))
          ];

          monthSections.push(yearMonthSection.join('\n')); // Join section rows into a single string
        });

        return monthSections;
      });

      csvData.unshift(eds);

      const csvContent = csvData.join('\n'); // Join sections into a single string

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'Summary report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },






    viewNotez(nutz, numx) {
      this.viewNote = true,
        this.noteText = nutz
      this.notenum = numx
    },
    openNote(numz) {
      this.addNote = true,
        this.notenum = numz
      this.noteText = ''
    },
    closeNote() {
      this.addNote = false,
        this.viewNote = false,
        this.notenum = 0
    },
    postNote() {
      // Axios POST request logic here
      const formData = new FormData();
      formData.append('note', this.noteText);

      axios.post(`http://172.31.10.164:8000/update_form/${this.notenum}`, formData, {
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

      this.closeNote()
    },
    initialize(numz) {
      this.initnum = numz
      // Axios POST request logic here
      const formData = new FormData();
      formData.append('initial', 'initialized');

      axios.post(`http://172.31.10.164:8000/update_form/${this.initnum}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.fetchData();
      }).catch(error => {
        console.error('Error:', error);
      });
    },
    updateVerifiedOTPs(event) {
      if (event.key === 'verifiedOTPs') {
        this.verifiedOTPs = event.newValue;
      }
    },
    async signature1(form_id) {

      this.otp = true;

      await this.waitForVerifiedOTPs(); // Wait for verifiedOTPs to become true
      this.otp = false;

      const formData = new FormData();
      formData.append('signature1', this.acc.signature);

      axios.post(`http://172.31.10.164:8000/update_form/${form_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.fetchData();
        this.selectedTravelOrderId = 0;
        useAuthStore().updateVerifiedOTPs('false');
        localStorage.setItem('verifiedOTPs', 'false');
        this.otp = false;
        window.location.reload();
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
      formData.append('sname', this.sub.name_id);
      formData.append('sdiv', this.sub.division_id);


      axios.post(`http://172.31.10.164:8000/update_form/${form_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.fetchData();
        this.selectedTravelOrderId = 0;
        useAuthStore().updateVerifiedOTPs('false');
        localStorage.setItem('verifiedOTPs', 'false');
        this.otp = false;
        window.location.reload()
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
      axios.get('http://172.31.10.164:8000/get_accounts_json')
        .then(response => {
          this.acc = response.data.find(result => result.account_id == this.accountId);
          this.fetchData()
          if (this.acc) {
            this.imageUrl = `http://172.31.10.164:8000/storage/${this.acc.signature}`;
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
      axios.get('http://172.31.10.164:8000/get_forms_json')
        .then(response => {
          this.mawala = true;
          this.load = false
          this.sub = this.employees.find(emp => emp.name_id == this.acc.name_id)
          this.bus = this.employees.find(emp => emp.rd !== null)

          if (this.sectionChiefIds.includes(this.acc.name_id)) {
            console.log(this.acc.name_id)
            const index = this.sectionChiefIds.indexOf(this.acc.name_id);
            console.log(index)
            const members = this.members[index];
            console.log(this.members[index])
            this.formData = response.data.filter(form => form.name_id == this.acc.name_id ||
              members.includes(form.name_id) && form.initial === null
            );

          }
          else if (this.acc.name_id == 37) {
            this.formData = response.data.filter(form => form.name_id == this.acc.name_id || form.note == null && form.initial !== null);
            this.siga = false
          } else if (this.acc.type_id == 1) {
            this.formData = response.data;
            this.siga = false
          }
          else if (this.acc.type_id == 2) {
            this.formData = response.data.filter(form => form.name_id == this.acc.name_id);
            this.siga = false
          } else if (this.bus.name_id == this.sub.name_id) {
            if (this.acc.name_id !== 20) {
              this.siga = true
            } else {
              this.siga = false
            }
            this.formData = response.data.filter(form => (form.signature2 === null && form.signature1 !== null && form.note !== null) || (form.division_id === 5 && form.signature2 == null && form.note !== null) || (form.division_id !== 5 && form.signature1 == null && form.note !== null && this.acc.name_id !== 20 && form.division_id == this.bus.division_id));
            this.siga1 = true

          } else if (this.acc.type_id == 3) {
            const division_id = this.employees.find(name => name.name_id == this.acc.name_id).division_id;
            this.formData = response.data.filter(form => (form.division_id == division_id && form.signature1 === null && this.sub.name_id !== 20 && form.note !== null) || form.name_id === this.acc.name_id);
            this.siga = true
            if (this.sub.name_id == 20) {
              this.formData = response.data.filter(form => form.name_id == this.acc.name_id && form.note !== null);
              this.siga = false
            }
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    fetchNames() {
      axios.get('http://172.31.10.164:8000/get_names_json')
        .then(response => {
          this.names = response.data;
        })
        .catch(error => {
          console.error('Error fetching names:', error);
        });
    },
    fetchEmployees() {
      axios.get('http://172.31.10.164:8000/get_employees_json')
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
.Btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition-duration: .3s;
  border: 2px solid black;
  margin-bottom: 10px;
  background-color: white;

}



.sign {
  width: 100%;
  transition-duration: .3s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  left: 1px;
  top: 1px;
}


.text {
  position: absolute;
  right: 0%;
  width: 0%;
  opacity: 0;
  color: black;
  font-size: 1.2em;
  font-weight: 500;
  transition-duration: .3s;
}

.Btn:hover {
  background-color: white;
  width: 230px;
  border: 2px solid black;
  border-radius: 5px;
  transition-duration: .3s;
  position: relative;

}

.Btn:hover .text {
  opacity: 1;
  width: 70%;
  transition-duration: .3s;
  padding-right: 10px;
}


.Btn:hover .sign {
  width: 30%;
  transition-duration: .3s;
  position: relative;
  left: -15px;
}


.Btn:active {
  transform: translate(2px, 2px);
}


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

@media print {
  .outer {
    display: none !important;
  }

  .hist {
    display: none !important;
  }

  .content,
  .note,
  .sign,
  .Btn {
    display: none !important;
  }
}
</style>
