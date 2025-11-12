<template>
  <div class="clearance-modal" v-if="isVisible">
    <div class="clearance-header">
      <span class="clearance-title">Create Travel Clearance {{ selectedTravelOrderIds }}</span>
      <div class="close-btn" @click="close">×</div>
    </div>

    <div class="clearance-body">
      <form @submit.prevent="submitForm">
        <!-- Names Preview -->
        <div class="form-group" v-if="selectedTravelOrders.length">
          <label>Names of Personnel:</label>
          <div class="names-preview">
            <div v-for="order in selectedTravelOrders" :key="order.travel_order_id">
              <div>{{ getName(order.name_id) }}</div>
            </div>
          </div>
        </div>

        <!-- Common Clearance Fields -->
        

        <div class="form-group">
          <label for="destination">Destination:</label>
          <input type="text" v-model="form.destination" required>
        </div>

        <div class="form-group">
          <label for="purpose">Purpose of Travel:</label>
          <textarea v-model="form.purpose" required></textarea>
        </div>

        <div class="form-group">
          <label for="departure">Departure Date:</label>
          <input type="date" v-model="form.departure" required>
        </div>

        <div class="form-group">
          <label for="arrival">Arrival Date:</label>
          <input type="date" v-model="form.arrival" required>
        </div>

        <div class="form-group">
          <label for="pap_code">PAP Code:</label>
          <input type="text" v-model="form.pap_code" required>
        </div>

        <!-- Basis of Approval with radio buttons for selection -->
        <div class="form-group">
          <label>Basis of Approval:</label>
          
          <!-- Radio buttons for Fieldwork within the Approved Travel Plan -->
          <div>
            <label>
              <input type="radio" v-model="form.selectedBasis" value="fieldworkWithinPlan" />
              Fieldwork within the Approved Travel Plan
            </label>
          </div>
          <div v-if="form.selectedBasis === 'fieldworkWithinPlan'" style="margin-left: 20px;">
            <!-- Subcategories under "Fieldwork within the Approved Travel Plan" -->
            <div>
              <label>
                <input type="radio" v-model="form.selectedSubBasis" value="withinScheduledPeriod" />
                Within the Scheduled Period
              </label>
            </div>
            <div>
              <label>
                <input type="radio" v-model="form.selectedSubBasis" value="outsideScheduledPeriod" />
                Outside the Scheduled Period
              </label>
            </div>
            <div>
              <label>
                <input type="radio" v-model="form.selectedSubBasis" value="previousReportToRD" />
                Previous Travel Report endorsed to RD
              </label>
            </div>
            <div>
              <label>
                <input type="radio" v-model="form.selectedSubBasis" value="copyOfInstruction" />
                Copy of Instruction from the RD/DC
              </label>
            </div>
            <div>
              <label>
                <input type="radio" v-model="form.selectedSubBasis" value="copyOfInvitation" />
                Copy of Invitation, Memo, and SO
              </label>
            </div>
          </div>

          <!-- Radio buttons for Fieldwork not within the Approved Travel Plan -->
          <div>
            <label>
              <input type="radio" v-model="form.selectedBasis" value="fieldworkNotWithinPlan" />
              Fieldwork not within the Approved Travel Plan
            </label>
          </div>

          <!-- Radio buttons for Intervening Activity -->
          <div>
            <label>
              <input type="radio" v-model="form.selectedBasis" value="interveningActivity" />
              Intervening Activity
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="remarks">Remarks:</label>
          <textarea v-model="form.remarks"></textarea>
        </div>

        <!-- Select Travel Orders -->
        <div class="form-group">
          <label>Select Travel Orders:</label>
          <div class="travel-orders-list">
            <div
              v-for="order in suggestedTravelOrders"
              :key="order.travel_order_id"
              class="travel-order-item"
              @click="toggleTravelOrder(order.travel_order_id)"
              style="cursor: pointer;"
            >
              <input
                type="checkbox"
                :value="order.travel_order_id"
                v-model="selectedTravelOrderIds"
                :disabled="order.travel_order_id === travelOrderId"
                @click.stop 
              />
              <span class="order-details">
                {{ getDate(order.departure) }} - {{ getDate(order.arrival) }}
                - {{ getName(order.name_id) }}
                ({{ order.destination }}, {{ order.purpose }})
              </span>
            </div>
          </div>
        </div>

        <div class="clearance-footer">
          <button type="submit" class="save-btn">Save Clearances</button>
          <button type="button" class="cancel-btn" @click="close">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { API_BASE_URL } from '../../config';

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    travelOrderId: {
      type: Number,
      required: true,
    },
    travelOrderData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        station: '',
        destination: '',
        purpose: '',
        departure: '',
        arrival: '',
        pap_code: '',
        remarks: '',
        selectedBasis: '',
        selectedSubBasis: '',
      },
      names: [],
      allTravelOrders: [],
      selectedTravelOrderIds: [this.travelOrderId],
    };
  },
  mounted() {
    this.initModal();
  },
  methods: {
    async initModal() {
    try {
      // Always fetch names and all travel orders first
      await Promise.all([this.fetchData(), this.fetchAllTravelOrders()]);

      // Check if travelOrderId contains a dash → Edit mode
      if (String(this.travelOrderId).includes('-')) {
        await this.fetchClearanceByNumber(this.travelOrderId);
      } else {
        this.populateFormFromProps(); // Create mode
      }
    } catch (error) {
      console.error('Initialization error:', error);
    }
  },
  toggleTravelOrder(orderId) {
    // Don't toggle the one that matches current travelOrderId
    if (orderId === this.travelOrderId) return;

    const index = this.selectedTravelOrderIds.indexOf(orderId);
    if (index > -1) {
      // Already selected → uncheck
      this.selectedTravelOrderIds.splice(index, 1);
    } else {
      // Not selected → check
      this.selectedTravelOrderIds.push(orderId);
    }
  },
    getDate(dateString) {
      const date = new Date(dateString);
      const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ];
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    },
    async fetchData() {
      try {
        const [namesRes] = await Promise.all([axios.get(`${API_BASE_URL}/get_names_json/`)]);
        this.names = namesRes.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async fetchAllTravelOrders() {
      try {
        const response = await axios.get(`${API_BASE_URL}/get_forms_json`);
        this.allTravelOrders = response.data;
      } catch (error) {
        console.error('Error fetching all travel orders:', error);
      }
    },
    async submitForm() {
      
      try {
        console.log(this.selectedTravelOrderIds)
        // Collect selected travel order IDs as a comma-separated string
        const travelOrderIdsStr = this.selectedTravelOrderIds.join(',');
      
        // Collect corresponding name_ids from selected travel orders as a comma-separated string
        const nameIdsStr = this.selectedTravelOrderIds
          .map(orderId => this.allTravelOrders.find(order => order.travel_order_id === orderId)?.name_id)
          .join(',');
      
        // Single clearance payload
        const clearanceData = {
          name_id: nameIdsStr,                // comma-separated name_ids
          travel_order_id: travelOrderIdsStr, // comma-separated travel_order_ids
          station: this.form.station,
          destination: this.form.destination,
          purpose: this.form.purpose,
          departure: this.form.departure,
          arrival: this.form.arrival,
          pap_code: this.form.pap_code,
          basis_of_approval: this.form.selectedBasis === 'fieldworkWithinPlan' ? this.form.selectedSubBasis : this.form.selectedBasis,
          remarks: this.form.remarks != null ? this.form.remarks : 'none',
          reviewed_by: 'KAYSHE JOY F. PELINGON', // or whatever user ID
        };
      
        // Check if we're updating (travelOrderId contains "-")
        if (String(this.travelOrderId).includes('-')) {
          // Extract numeric part or full ID, depending on backend
          const id = this.travelOrderId;
        
          await axios.post(
            `${API_BASE_URL}/travel_clearances/update/${id}`,
            clearanceData
          );
          console.log('Clearance updated successfully!');
        } else {
          // Create new clearance
          await axios.post(`${API_BASE_URL}/travel_clearances`, clearanceData);
          console.log('Clearance created successfully!');
        }
      
        alert('Travel clearance created successfully!');
        this.$emit('clearanceCreated');
        this.close();
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error creating travel clearance. Please try again.');
      }
    },
    close() {
      this.$emit('close');
    },
    populateFormFromProps() {
      if (this.travelOrderData) {
        console.log(this.travelOrderData)
        this.form.station = this.travelOrderData.station || '';
        this.form.destination = this.travelOrderData.destination || '';
        this.form.purpose = this.travelOrderData.purpose || '';
        this.form.departure = this.travelOrderData.departure || '';
        this.form.arrival = this.travelOrderData.arrival || '';
        this.form.pap_code = this.travelOrderData.papc || '';
      }
    },
    async fetchClearanceByNumber(clearanceNumber) {
      try {
        console.log(clearanceNumber)
        const response = await axios.get(`${API_BASE_URL}/travel_clearances/${clearanceNumber}`);
        const clearance = response.data;
        console.log(response.data)
        this.populateFields(clearance); 
      } catch (error) {
        console.error('Error fetching clearance:', error);
        alert('Could not fetch travel clearance.');
      }
    },
    populateFields(clearance) {
    this.form.station = clearance.station || '';
    this.form.destination = clearance.destination || '';
    this.form.purpose = clearance.purpose || '';
    this.form.departure = clearance.departure || '';
    this.form.arrival = clearance.arrival || '';
    this.form.pap_code = clearance.pap_code || '';
    this.form.remarks = clearance.remarks || '';
    const basis = clearance.basis_of_approval || '';

    const withinPlanOptions = [
      'withinScheduledPeriod',
      'outsideScheduledPeriod',
      'previousReportToRD',
      'copyOfInstruction',
      'copyOfInvitation',
    ];

    if (withinPlanOptions.includes(basis)) {
      this.form.selectedBasis = 'fieldworkWithinPlan';
      this.form.selectedSubBasis = basis;
    } else if (['fieldworkNotWithinPlan', 'interveningActivity'].includes(basis)) {
      this.form.selectedBasis = basis;
      this.form.selectedSubBasis = '';
    } else {
      this.form.selectedBasis = '';
      this.form.selectedSubBasis = '';
    }
      console.log(this.form)
    // Set selected travel orders
    this.selectedTravelOrderIds = clearance.travel_order_id
    .split(',')
    .map(id => parseInt(id.trim()))
    .filter(id => id); // filter removes any accidental empty strings
    console.log(this.selectedTravelOrderIds)
  },
    getName(nameId) {
      const name = this.names.find(n => n.name_id === nameId);
      if (name) {
        const { first_name, middle_init, last_name } = name;
        return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
      }
      return 'Unknown';
    },
    padWithZeroes(travel_order_id) {
      const idString = travel_order_id.toString();
      return idString.length < 4 ? '0'.repeat(4 - idString.length) + idString : idString;
    },
  },
  computed: {
  selectedTravelOrders() {
    return this.allTravelOrders.filter(order => 
      this.selectedTravelOrderIds.includes(order.travel_order_id)
    );
  },
  suggestedTravelOrders() {
    if (!this.allTravelOrders.length) return [1,2,3];

  const source = String(this.travelOrderId).includes('-')
    ? this.form
    : this.travelOrderData;

  const { departure, arrival, destination, purpose } = source;
    console.log(departure, arrival, destination, purpose)
    return this.allTravelOrders.filter(order => 
      (order.departure === departure && order.arrival === arrival) || 
      (order.destination === destination && order.purpose === purpose)
    ).filter(order => !order.hasclearance);
  },
},
  watch: {
    travelOrderData: {
      async handler(newVal) {
        // Check if it's an edit mode (has a dash)
        if (String(this.travelOrderId).includes('-')) {

        } else {
          this.populateFormFromProps();
          this.selectedTravelOrderIds = [this.travelOrderId];
        }
      },
      immediate: true,
    },
    travelOrderId: {
      async handler(newVal) {
        // Check if it's an edit mode (has a dash)
        if (String(this.travelOrderId).includes('-')) {
          await this.fetchClearanceByNumber(this.travelOrderId);
        } 
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.clearance-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  background: linear-gradient(150deg, #f0c36d, #b8860b);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 20px;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-out;
  border: solid black 2px;
}

.clearance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 20px;
  color: #000000;
}

.clearance-title {
  font-size: 24px;
  font-weight: bold;
  color: #000000;
}

.close-btn {
  font-size: 50px;
  cursor: pointer;
  color: #000000;
  border-radius: 20px;
  padding: 10px 20px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

.clearance-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input, select, textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.clearance-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.save-btn, .cancel-btn {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.save-btn {
  background-color: #000000;
  color: #ffffff;
  border: none;
}

.save-btn:hover {
  transform: scale(1.05);
  background-color: #2e2e2e;
  color: #ffffff;
}

.cancel-btn {
  background-color: transparent;
  color: #fff;
  border: 2px solid #000000;
}

.cancel-btn:hover {
  background-color: #000000;
  color: #ffffff;
  transform: scale(1.05);
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.travel-orders-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
}

.travel-order-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.travel-order-item input {
  margin-right: 10px;
}

.order-details {
  font-size: 14px;
  padding: 5px;
  border: solid black 1px;
}
</style>
