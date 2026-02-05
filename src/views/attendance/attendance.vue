<template>
    <div class="dtr-form">
      <h2>Daily Time Record for {{ getName(nameId) }}</h2>
  
      <!-- DTR Table Row with Buttons or Time -->
      <div class="dtr-table">
        <div class="dtr-row">
          <div class="time-cell">
            <label>Morning In</label>
            <span v-if="times.amin">{{ formatTime(times.amin) }}</span>
            <button v-else @click="timeIn('amin')" :disabled="status !== 'amin'">
              Time In
            </button>
          </div>
        
          <div class="time-cell">
            <label>Morning Out</label>
            <span v-if="times.amout">{{ formatTime(times.amout) }}</span>
            <button v-else @click="timeOut('amout')" :disabled="status !== 'amout'">
              Time Out
            </button>
          </div>
        
          <div class="time-cell">
            <label>Afternoon In</label>
            <span v-if="times.pmin">{{ formatTime(times.pmin) }}</span>
            <button v-else @click="timeIn('pmin')" :disabled="status !== 'pmin'">
              Time In
            </button>
          </div>
        
          <div class="time-cell">
            <label>Afternoon Out</label>
            <span v-if="times.pmout">{{ formatTime(times.pmout) }}</span>
            <button v-else @click="timeOut('pmout')" :disabled="status !== 'pmout'">
              Time Out
            </button>
          </div>
        </div>
      </div>
  
      <!-- Captcha Section -->
      <div v-if="captchaVisible" class="captcha-container">
        <p>Captcha: What is {{ captcha.num1 }} + {{ captcha.num2 }}?</p>
        <input v-model="captchaAnswer" type="number" placeholder="Enter your answer" />
        <button @click="verifyCaptcha">Verify</button>
  
        <!-- Error message if captcha fails -->
        <p v-if="captchaError" class="error-message">Incorrect answer. Please try again.</p>
      </div>
  
      <!-- Submit Button -->
      <!-- <button v-if="status !== 'waiting'" @click="submitAttendance" :disabled="captchaVisible">Submit</button> -->
  
      <!-- Success Message -->
      <div v-if="successMessage" class="success-message">
        <p>{{ successMessage }}</p>
      </div>
  
      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { useAuthStore } from '@/store/auth';
  import { API_BASE_URL } from '../../config'
  
  export default {
    data() {
      const authStore = useAuthStore();
      return {
        names: {},
        status: 'amin', // Initial status is 'amin'
        captchaVisible: false,
        captchaAnswer: "",
        captchaError: false,
        captcha: {
          num1: this.getRandomNumber(),
          num2: this.getRandomNumber(),
          answer: 0
        },
        successMessage: "",
        errorMessage: "",
        nameId: authStore.name_id,
        times: {
          amin: null,
          amout: null,
          pmin: null,
          pmout: null
        }
      };
    },
    mounted() {
      this.fetchNames();
      this.fetchAttendance();
    },
    methods: {
      // Generate a random number between 1 and 100
      getRandomNumber() {
        return Math.floor(Math.random() * 100) + 1;
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
  getName(nameId) {
    const name = this.names[nameId - 1];
    if (name) {
      const { first_name, middle_init, last_name } = name;
      return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
    }
    return 'Unknown';
  },
  formatTime(time) {
    if (!time) return "";
    const [h, m] = time.split(":");
    let hour = parseInt(h);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${m} ${period}`;
  },  
      // Fetch today's attendance data and update status accordingly
async fetchAttendance() {
  try {
    const response = await axios.get(`${API_BASE_URL}/dtr/${this.nameId}/${this.getCurrentDate()}`);
    const records = response.data;

    // Initialize a variable to track the current status
    let currentStatus = this.status;

    records.forEach(record => {
      const status = record.status;
      const timestamp = record.timestamp.split(' ')[1]; // Extract time from timestamp

      // Assign the time for each status
      if (status === 'amin') this.times.amin = timestamp;
      if (status === 'amout') this.times.amout = timestamp;
      if (status === 'pmin') this.times.pmin = timestamp;
      if (status === 'pmout') this.times.pmout = timestamp;

      // Update the current status if the record status matches
      if (status === 'amin') {
        currentStatus = 'amout';  // After 'amin', the next status should be 'amout'
      } else if (status === 'amout') {
        currentStatus = 'pmin';  // After 'amout', the next status should be 'pmin'
      } else if (status === 'pmin') {
        currentStatus = 'pmout'; // After 'pmin', the next status should be 'pmout'
      } else if (status === 'pmout') {
        currentStatus = 'waiting'; // After 'pmout', set status to 'waiting'
      }
    });

    // Update the status to the correct next status based on the records
    this.status = currentStatus;
  } catch (error) {
    this.errorMessage = "No attendance recorded today.";
  }
},

  
      // Get today's date in YYYY-MM-DD format
      getCurrentDate() {
        return new Date().toISOString().split('T')[0];
      },
  
      // Time In logic (AM or PM)
      timeIn(status) {
        this.status = status;
        // if (!this.captchaVisible) {
        //   this.startCaptcha();
        // }
        this.submitAttendance();
      },
  
      // Time Out logic (AM or PM)
      timeOut(status) {
        this.status = status;
        // if (!this.captchaVisible) {
        //   this.startCaptcha();
        // }
        this.submitAttendance();
      },
  
      // Show the captcha challenge when user tries to time-in/out
      startCaptcha() {
        this.captchaVisible = true;
        this.captchaError = false;
      },
  
      // Verify the captcha entered by the user
      verifyCaptcha() {
        if (parseInt(this.captchaAnswer) === this.captcha.num1 + this.captcha.num2) {
          this.captchaVisible = false;
          this.submitAttendance();
        } else {
          this.captchaError = true;
        }
      },
  
      // Submit the attendance (send POST request)
      async submitAttendance() {
        const data = {
          name_id: parseInt(this.nameId), // Use name_id from authStore
          status: this.status,
        };
  
        try {
          // Send POST request to save the attendance record
          const response = await axios.post(`${API_BASE_URL}/dtr`, data);
  
          // Display success message and reset the form
          this.successMessage = response.data.message;
          this.resetForm();
        } catch (error) {
          // Handle error from server (display error message)
          this.errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
        }
      },
  
      // Reset form after submission
      resetForm() {
        this.status = 'amin'; // Reset status to 'amin' for next action
        this.captchaVisible = false; // Hide captcha
        this.captchaAnswer = ""; // Clear captcha input
        this.successMessage = ""; // Clear success message
        this.fetchAttendance(); // Refetch attendance after submission to get the updated status and time
      }
    }
  };
  </script>
  
  <style scoped>
  .dtr-form {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  background: #d4af37;
  color: #fff;
  border-radius: 12px;
}

.dtr-form h2 {
  text-align: center;
  color: #000;
  margin-top: -10px;
  font-weight: 600;
}

/* TABLE */
.dtr-table {
  width: 100%;
}

.dtr-row {
  display: flex;
  gap: 20px;
}

/* CARD */
.time-cell {
  flex: 1;
  background: #ffffff;
  border: 1px solid #d4af37;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: transform 0.2s ease;
}

.time-cell:hover {
  transform: translateY(-4px);
}

.time-cell label {
  display: block;
  color: #000000;
  margin-bottom: 12px;
  font-size: 14px;
  letter-spacing: 1px;
}

/* TIME DISPLAY */
.time-cell span {
  display: block;
  font-size: 28px;
  font-weight: 600;
  color: #000000;
}

/* BUTTON */
button {
  width: 100%;
  padding: 12px;
  background: #d4af37;
  color: #000;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #b8962e;
}

button:disabled {
  background: #555;
  color: #999;
  cursor: not-allowed;
}

/* MESSAGES */
.success-message,
.error-message {
  margin-top: 20px;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
}

.success-message {
  background: #111;
  color: #d4af37;
  border: 1px solid #d4af37;
}

.error-message {
  background: #111;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
}

/* MOBILE RESPONSIVE */
@media (max-width: 768px) {
.dtr-form h2{
  margin-top: -20px;
}

  .dtr-row {
    flex-direction: column;
  }

  .time-cell span {
    font-size: 20px;
  }

  .time-cell {
    height: 50%;
  }
}

  </style>
  