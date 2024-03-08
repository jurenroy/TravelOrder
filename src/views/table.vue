<template>
  <div>
    <h2>History</h2>
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
              <th>Action</th>
              <!-- Add more table headers as needed -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item) in visibleItems" :key="item.id">
              <td>{{ item.travel_order_id }}</td>
              <td>{{ getName(item.name_id) }}</td>
              <td>{{ item.departure }}</td>
              <td>{{ item.destination }}</td>
              <td>{{ item.purpose }}</td>
              <td>{{ item.arrival }}</td>
              <td>{{ item.date }}</td>
              <td>Edit or View</td>
              <!-- Add more table data cells as needed -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      formData: [],
      names: {},
      visibleItems: [],
    };
  },
  mounted() {
    this.fetchData();
    this.fetchNames();
  },
  watch: {
    formData() {
      this.updateVisibleItems();
    },
  },
  methods: {
    fetchData() {
      axios.get('http://127.0.0.1:8000/get_forms_json')
        .then(response => {
          this.formData = response.data;
          this.updateVisibleItems();
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
    getName(nameId) {
      const name = this.names[nameId];
      if (name) {
        const { first_name, middle_init, last_name } = name;
        return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
      }
      return 'Unknown';
    },
    updateVisibleItems() {
      // this.visibleItems = this.formData.slice(0, 20);
      this.visibleItems = this.formData.slice(-20).reverse();
    },
  },
};
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
