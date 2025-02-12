<template>
  <editform v-if="selectedTravelOrderIdEdit > 0" :travelOrderId="selectedTravelOrderIdEdit" @cancel-edit="closeEdit"></editform>
  <div class="note" v-if="addNote">
    <div class="title-bar">
      <div class="title">Add note</div>
      <div class="close-icon" @click="closeNote">X</div>
    </div>
    <div class="content">
      <textarea v-model="noteText" rows="3" placeholder="Enter your note here"></textarea>
      <div style="display: flex; flex-direction: row; justify-content: space-evenly;">
        <button style="font-size: 12px;" @click="focusTextarea('Within WFP')" v-if="acc.name_id == 37"> Within WFP </button>
        <button style="font-size: 12px;" @click="focusTextarea('Not within WFP')" v-if="acc.name_id == 37"> Not within WFP </button>
      </div>
      <div class="butokz">
        <button @click="postNote">Save</button>
        <button @click="closeNote">Cancel</button>
      </div>
    </div>
  </div>
  <div class="note" v-if="viewNote">
    <div class="title-bar">
      <div class="title">View note</div>
    </div>
    <div class="content">
      <textarea v-model="noteText" rows="3"></textarea>
      <div class="butokz">
        <button @click="postNote" v-if="canSaveNote">Save</button>
        <button @click="closeNote">Close</button>
      </div>
    </div>
  </div>

  <div style="display: flex; flex-direction: column;">
    <h2 style="display: flex; flex-direction: row; align-self: center;" class="hist">History for:
      <select v-model="selectedStatus" id="status" class="styled-select">
        <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
      </select>
      <span v-if="pendingCount !== 0" class="notification-count">{{ pendingCount }}</span>
    </h2>
    <div v-if="load" class="loadings">
      <img src='../../assets/loading.gif' width="auto" height="100px" />
    </div>
    <div style="display: flex; flex-direction: column; align-items: center;" v-if="otp">
      <otpz />
    </div>
    <div class="search" style="display: flex; flex-direction: row; justify-content: space-between; align-items: end; margin-top: 15px; margin-bottom: 10px; height: 35px;">
      <div v-if="mawala" style="display: flex; border: 2px solid black; border-radius: 5px; align-items: center; height: 30px; position: relative;">
        <img class="imgsearch" style="height: 20px; width:20px; position: relative; padding-left: 5px;" src="../../assets/search.png">
        <input class="pholder" type="text" v-model="searchQuery" placeholder="Search TO number or Name">
      </div>
    </div>

    <div v-if="mawala" class="outer">
      <div class="scrollable-table">
        <table>
          <thead>
            <tr>
              <th style="text-align: center;">Requestor</th>
              <th style="text-align: center;">Document Requested</th>
              <th style="text-align: center;">Date & Time</th>
              <th style="text-align: center;">Status</th>
              <th style="text-align: center;">Rating</th>
              <th style="text-align: center;">Action</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in formData" :key="index">
            <td>{{ getName(item.name_id) }}</td>
            <td>
              <span v-if="Array.isArray(item.documents) && item.documents.length">
                {{ item.documents.join(', ') }} <!-- Join the document names with a comma -->
              </span>
              <span v-else>No documents requested</span>
            </td>
            <td>{{ item.date }}</td>
            <td>{{ item.status }}</td>
            <td>
              <button @click="rate(item)">Rating</button>
            </td>
            <td>    
              <button @click="edit(item)">Edit</button>
              <button @click="view(item)">View</button>
              <button @click="add(item)">Add Note</button>
            </td>
           
          </tr>
          <h1 style="text-align: center; margin-bottom: 0px;" v-if="formData.length == 0">NO MATCH FOUND</h1>
        </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-show="selectedTravelOrderId" class="prent full-screen">
    <div class="buttons">
      <button @click="printzz">Download as PDF</button>
      <button @click="close">Close PDF</button>
    </div>
    <pdf :travel_order_id="selectedTravelOrderId"></pdf>
  </div>
</template>

<script>
import axios from 'axios';
import pdf from './../pdf.vue';
import editform from './../editform.vue';
import otpz from '../../components/otp.vue';
import { API_BASE_URL } from '@/config';

export default {
  components: {
    pdf,
    otpz,
    editform,
  },
  data() {
    return {
      selectedStatus: 'Me',
      options: ['Pending', 'Done', 'Me'],
      yearToday: new Date().getFullYear(),
      formData: [],
      names: {},
      employees: {},
      accountId: localStorage.getItem('accountId'),
      acc: [],
      load: true,
      mawala: false,
      addNote: false,
      viewNote: false,
      noteText: '',
      searchQuery: '',
      documents: [],
    };
  },
  mounted() {
    this.fetchAccounts();
    this.fetchEmployees();
    this.fetchNames();
    this.fetchData(); // Fetch the form data when the component is mounted
    this.fetchDocuments();
  },
  methods: {
    focusTextarea(text) {
      this.noteText = text;
      this.$refs.noteInput.focus();
    },
    closeEdit() {
      this.selectedTravelOrderIdEdit = 0;
    },
    printzz() {
      window.print();
    },
    closeNote() {
      this.addNote = false;
      this.viewNote = false;
    },
    postNote() {
      const formData = new FormData();
      formData.append('note', this.noteText);
      axios.post(`${API_BASE_URL}/update_form/${this.notenum}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.fetchData();
        this.closeNote();
      }).catch(error => {
        console.error('Error:', error);
      });
    },
    fetchAccounts() {
      axios.get(`${API_BASE_URL}/get_accounts_json`)
        .then(response => {
          this.acc = response.data.find(result => result.account_id == this.accountId);
          this.fetchData();
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },

    fetchData() {
  this.load = true;
  axios.get(`${API_BASE_URL}/get_request`)
    .then(response => {
      this.mawala = true;
      this.load = false;

      // Parse the documents field for each item
      this.formData = response.data.map(item => {
        return {
          ...item,
          documents: item.documents ? JSON.parse(item.documents) : [] // Parse the documents string into an array
        };
      });

      // Log the formData to check the structure
      console.log(this.formData);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      this.load = false;
    });
},
    fetchNames() {
      axios.get(`${API_BASE_URL}/get_names_json`)
        .then(response => {
          this.names = response.data;
        })
        .catch(error => {
          console.error('Error fetching names:', error);
        });
    },
    fetchEmployees() {
      axios.get(`${API_BASE_URL}/get_employees_json`)
        .then(response => {
          this.employees = response.data;
        })
        .catch(error => {
          console.error('Error fetching employees:', error);
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
    padWithZeroes(travel_order_id) {
      const idString = travel_order_id.toString();
      return idString.padStart(4, '0');
    },
    fetchDocuments() {
      axios.get(`${API_BASE_URL}/get_request`)
        .then(response => {
          this.documents = response.data;
        })
        .catch(error => {
          console.error('Error fetching documents:', error);
        });
    },
    
   
  },
  computed: {
    pendingCount() {
      return this.formData.filter(form => form.note === null && form.initial !== null).length;
    },
    reversedFormData() {
      return this.formData.slice().reverse().filter(item => {
        return String(this.padWithZeroes(item.to_num)).includes(this.searchQuery) || String(this.getName(item.name_id)).toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    canSaveNote() {
      return this.siga || this.siga1 || this.acc.name_id == 76 || this.acc.name_id == 37;
    },
  },
};
</script>
  
  
  
  <style scoped>
  
  .notification-count {
    margin-top: -10px;
    margin-left: -10px;
    background-color: red;
    color: white;
    border-radius: 50%;
    width: 20px; /* Adjust size */
    height: 20px; /* Adjust size */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px; /* Adjust font size */
  }
  
  .pholder {
    padding: 5px;
    border-radius: none;
    border: none;
    outline: none;
  }
  
  
  
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
    margin-bottom: 2px;
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
    width: 100%;
  }
  
  
  .loadings {
    top: 0;
    left: 0;
    width: fit-content;
    justify-self: center;
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin: 10px auto;
    border-radius: 10px;
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
    border-radius: 10px;
    background: linear-gradient(150deg, #DDC7AD, #92785b);
    border: solid black 2px;
    padding: 10px 20px;
    color: rgb(0, 0, 0);
    cursor: pointer;
    transition: background 0.3s;
    margin: 0 5px;
    height: fit-content;
    
  }
  
  button:hover {
    background-color: black;
    color: white;
  }
  
  .styled-select {
    appearance: none;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    font-size: 16px;
    transition: border-color 0.3s;
    width: 100px;
    font-weight: bold;
    margin-top: -5px;
    margin-left: 5px;
  }
  
  .styled-select:focus {
    border-color: #007bff;
    outline: none;
  }
  
  .styled-select option {
    padding: 10px;
    font-weight: bold;
  }
  
  @media screen and (max-width: 768px) {
    .Btn{
      margin-right: 20px;
    }
  
   .prent {
      position: fixed;
      top: 0;
      left: 0;
      width: fit-content;
      height: 100%; 
      max-height: 1000px; 
      z-index: 9999; 
      height: 100vh;
      background-color: white;
    }
    .prent .buttons{
      display: flex;
      justify-content: space-evenly;
      margin-top: 70px;
      margin-bottom: 10px;
    }
  
  }
  
  @media print {
    .outer {
      display: none !important;
    }
  
    .hist {
      display: none !important;
    }
  
    .content,
    .search,
    .note,
    .sign,
    .Btn,
    .dropdown {
      display: none !important;
    }
    .buttons{
      display: none !important;
    }
  }
  </style>

