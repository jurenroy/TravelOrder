<template>
  <div style="display: flex; flex-direction: column;" >
    <h2>History</h2>
    <!-- <img :src="imageUrl" alt="Image" /> -->
    <div class="outer">
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
            <th>PDF View</th>
            <!-- Add more table headers as needed -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in reversedFormData" :key="item.id">
            <td>{{ padWithZeroes(item.travel_order_id) }}</td>
            <td>{{ getName(item.name_id) }}</td>
            <td>{{ item.departure }}</td>
            <td>{{ item.destination }}</td>
            <td>{{ item.purpose }}</td>
            <td>{{ item.arrival }}</td>
            <td>{{ item.date }}</td>
            <td style="display: flex; justify-content: center;">
              <button v-if="selectedTravelOrderId != item.travel_order_id" @click="openPDF(item.travel_order_id)">PDF</button>
              <button v-if="selectedTravelOrderId == item.travel_order_id" @click="close">Close</button>
            </td>
            <td v-if="siga" style="display: flex; justify-content: center;"><button @click="signature1(item.travel_order_id)">Recommend</button></td>
            <td v-if="siga1" style="display: flex; justify-content: center;"><button @click="signature2(item.travel_order_id)">Approve</button></td>
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
  
  export default {

    provide() {
    return {
      close: this.close,
    };
  },
  
    components: {
      pdf
    },
    mounted() {
      this.fetchAccounts();
      this.fetchEmployees();
      this.fetchNames();
    },
    data() {
      return {
        formData: [],
        names: {},
        employees: {},
        selectedTravelOrderId: 0,
        accountId: localStorage.getItem('accountId'),
        acc: [],
        imageUrl: '',
        siga: '',
        siga1: '',
      };
    },
  methods: {
    signature1(form_id) {
    const formData = new FormData();
    formData.append('signature1', this.acc.signature);
    axios.post(`http://127.0.0.1:8000/update_form/${form_id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(() => {
        this.fetchData();
        this.selectedTravelOrderId = 0
    })
    .catch(error => {
        console.error('Error:', error);
    });
},

signature2(form_id) {
    const formData = new FormData();
    formData.append('signature2', this.acc.signature);
    axios.post(`http://127.0.0.1:8000/update_form/${form_id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(() => {
        this.fetchData();
        this.selectedTravelOrderId = 0
    })
    .catch(error => {
        console.error('Error:', error);
    });
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
      axios.get('http://127.0.0.1:8000/get_accounts_json')
        .then(response => {
          this.acc = response.data.find(result => result.account_id == this.accountId);
          console.log('http://127.0.0.1:8000/storage/',this.acc)
          this.fetchData()   
          if (this.acc){
            console.log(this.acc.signature)
            this.imageUrl = `http://127.0.0.1:8000/storage/${this.acc.signature}`;
        }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },

    fetchData() {
      axios.get('http://127.0.0.1:8000/get_forms_json')
        .then(response => {
          console.log(response.data)
          console.log(this.acc.name_id)
        if (this.acc.type_id == 2) {
          console.log('user')
          console.log(this.acc.name_id)
          this.formData = response.data.filter(form => form.name_id == this.acc.name_id);
          this.siga = false
        } else if (this.acc.name_id == 20) {
          this.formData = response.data.filter(form => form.signature2 === null && form.signature1 !== null);
          this.siga1 = true
          console.log('chief1')
        } else if (this.acc.type_id == 3) {
          const division_id = this.employees.find(name => name.name_id == this.acc.name_id).division_id;
          this.formData = response.data.filter(form => form.division_id == division_id && form.signature1 === null);
          this.siga = true
          console.log('chief')
        } else if (this.acc.type_id == 1) {
          this.formData = response.data;
          console.log('superuser')
          this.siga = false
        }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    fetchNames() {
      axios.get('http://127.0.0.1:8000/get_names_json')
        .then(response => {
          this.names = response.data;
        })
        .catch(error => {
          console.error('Error fetching names:', error);
        });
    },
    fetchEmployees() {
      axios.get('http://127.0.0.1:8000/get_employees_json')
        .then(response => {
          this.employees = response.data;
        })
        .catch(error => {
          console.error('Error fetching employeess:', error);
        });
    },
    getName(nameId) {
        const name = this.names[nameId-1];
      if (name) {
        const { first_name, middle_init, last_name } = name;
        return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
      }
      return 'Unknown';
    },
    openPDF(travelOrderId) {
      // Set the selected travel order ID
      this.selectedTravelOrderId = travelOrderId;
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
  
  th, td {
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
  max-height: 630px; /* Set the maximum height here */
  overflow-y: auto; /* Add vertical scrollbar if needed */
  margin: 15px;
}
.outer{
  border: 1px solid black;
  box-shadow: 0px 0px 3px black;
  border-radius: 5px;
}
  </style>
  
