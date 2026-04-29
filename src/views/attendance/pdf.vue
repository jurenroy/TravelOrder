<template>
  <div class="a4-containerz hiding-class">
    <div class="dtrx-container">
      <div class="dtrx-form" v-for="copy in copies" :key="copy.type" v-if="allDays.length">
        <!-- TOP LINE -->
        <div class="dtrx-topline">
          <span style="font-size: 9px">Civil Service Form No. 48</span>
          <span style="font-size: 10px">>>> {{ copy.type }} COPY</span>
        </div>

        <!-- HEADER -->
        <div class="dtrx-header" style="margin-top: -20px; margin-bottom: -20px">
          <div class="dtrx-logo">
            <img :src="mgblogo" alt="MGB Logo" style="height: 80px" />
          </div>
          <div class="dtrx-header-text">
            <div class="dtrx-agency">MINES AND GEOSCIENCES BUREAU - 10</div>
            <div class="dtrx-title">DAILY TIME RECORD</div>
          </div>
        </div>

        <!-- NAME -->
        <div class="dtrx-name-line">
          <span class="dtrx-employee-name">{{ name }}</span>
        </div>

        <!-- MONTH -->
        <div class="dtrx-month-line" style="font-size: 10px">
          <span>For the month of</span>
          <span class="dtrx-month">{{ formattedMonthYear }}</span>
        </div>
        <div>
          <!-- HOURS -->
          <div class="dtrx-hours-block" style="font-size: 10px">
            <div>Official hours for arrival and departure</div>
            <div class="dtrx-hours-right">
              <div class="dtrx-hours-row">
                <span>Regular days</span>
                <span class="dtrx-hours-box">{{ regularDaysCount() }}</span>
              </div>
              <div class="dtrx-hours-row">
                <span>Saturdays</span>
                <span class="dtrx-hours-box">{{ saturdaysCount() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TABLE -->
        <div>
          <table class="dtrx-table">
            <tbody>
              <tr style="font-size: 10px">
                <th class="dtrx-col-day" style="font-size: 10px">Day</th>
                <th colspan="2" style="font-size: 10px">A M</th>
                <th colspan="2" style="font-size: 10px">P M</th>
                <th colspan="2" style="font-size: 10px">REMARKS IN MINUTES</th>
              </tr>
              <tr>
                <th style="font-size: 10px">Date</th>
                <th style="font-size: 10px; width: 60px">Arrival</th>
                <th style="font-size: 10px; width: 30px">Departure</th>
                <th style="font-size: 10px; width: 60px">Arrival</th>
                <th style="font-size: 10px; width: 30px">Departure</th>
                <th style="font-size: 10px">T</th>
                <th style="font-size: 10px">U</th>
              </tr>

              <!-- Iterating through the days and times -->

              <tr v-for="(day, index) in allDays" :key="index">
                <td class="day-cell">
                  <span class="numDays">{{ formatDate(day.date) }}</span>
                  <span class="numDays">{{ getDayOfWeek(day.date) }}</span>
                </td>
                <td class="time-cell">{{ getTimeForDay(day.date, "amin") }}</td>
                <td class="time-cell">{{ getTimeForDay(day.date, "amout") }}</td>
                <td class="time-cell">{{ getTimeForDay(day.date, "pmin") }}</td>
                <td class="time-cell">{{ getTimeForDay(day.date, "pmout") }}</td>
                <td>{{ getTardinessForDay(day.date) || "--" }}</td>
                <!-- Placeholder for remarks -->
                <td>{{ getUndertimeForDay(day.date) || "--" }}</td>
                <!-- Placeholder for remarks -->
              </tr>
            </tbody>
          </table>
        </div>

        <!-- CERTIFICATION -->
        <div class="dtrx-certification">
          <p style="text-align: center; font-weight: bold">
            I certify on my honor that the above is a true and correct report of the hours work performed, record of which was daily at the time of arrival and departure from office.
          </p>
          <br />

          <div class="dtrx-line"></div>
          <div class="dtrx-label">Signature</div>

          <div class="dtrx-verified-block">
            <div class="dtrx-verify-equals">==================================================</div>
            <div class="dtrx-verify-text">VERIFIED as to the prescribed office hours</div>
          </div>

          <div class="dtrx-line"></div>
          <div class="dtrx-label">In Charge</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mgblogz from "../../assets/mgbx.png";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export default {
  name: "DTRXForm",
  props: {
    dtrvalues: { type: [Array, Object], required: true },
    name: { type: String, required: true },
  },
  data() {
    return {
      mgblogo: mgblogz,
      copies: [{ type: "ORIGINAL" }, { type: "DUPLICATE" }],
      allDays: [],
      dtrData: [],
      remarks: [],
    };
  },
  computed: {
    formattedMonthYear() {
      if (!this.dtrvalues.start_date) return "";
      const date = new Date(this.dtrvalues.start_date);
      return date.toLocaleString("default", { month: "long", year: "numeric" });
    },
    // Count the number of regular weekdays (Mon-Fri)
    // regularDaysCount() {
    //   return this.allDays.length.toFixed(2);
    // },

    // // Count the number of Saturdays
    // saturdaysCount() {
    //   const count = this.allDays.filter((day) => {
    //     const dayOfWeek = new Date(day.date).getDay();
    //     return dayOfWeek === 6; // 6=Sat
    //   }).length;
    //   return count.toFixed(2);
    // },
  },
  methods: {
    regularDaysCount() {
      return this.allDays.length.toFixed(2);
    },
    saturdaysCount() {
      const count = this.allDays.filter((day) => {
        const dayOfWeek = new Date(day.date).getDay();
        return dayOfWeek === 6; // 6=Sat
      }).length;
      return count.toFixed(2);
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.getDate();
    },
    formatTime(time) {
      if (!time) return "--";
      const [hour, minute] = time.split(":");
      const period = hour >= 12 ? "pm" : "am";
      const formattedHour = hour % 12 || 12; // Convert 0 to 12 for AM times
      return `${formattedHour}:${minute} ${period}`;
    },
    getDayOfWeek(dateStr) {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const date = new Date(dateStr);
      return days[date.getDay()];
    },
    // Generate all days between the start and end dates
    generateAllDays() {
      const start = new Date(this.dtrvalues.start_date);
      const end = new Date(this.dtrvalues.end_date);

      const days = [];

      //console.log(start, end);

      while (start <= end) {
        days.push({
          date: start.toISOString().split("T")[0], // Get date as YYYY-MM-DD
        });
        start.setDate(start.getDate() + 1); // Increment by 1 day
      }

      this.allDays = days;
    },
    getTimeForDay(date, timeType) {
      // Find all records for the given date

      const records = this.dtrData.filter((item) => item.date === date);

      // Map the records to their respective time slots
      const times = {
        amin: null,
        amout: null,
        pmin: null,
        pmout: null,
      };

      // Assign time slots based on the order of the timestamps
      if (records.length > 0) times.amin = this.formatTime(records[0].timestamp.split(" ")[1]);
      if (records.length > 1) times.amout = this.formatTime(records[1].timestamp.split(" ")[1]);
      if (records.length > 2) times.pmin = this.formatTime(records[2].timestamp.split(" ")[1]);
      if (records.length > 3) times.pmout = this.formatTime(records[3].timestamp.split(" ")[1]);

      // Return the appropriate time based on the `timeType` requested
      return times[timeType] || "--"; // Return '--' if time is not available
    },
    // Get tardiness for a specific date, if available
    getTardinessForDay(date) {
      const remark = this.remarks.find((remark) => remark.date === date);
      return remark ? remark.tardiness : null; // Return null if no remark
    },

    // Get undertime for a specific date, if available
    getUndertimeForDay(date) {
      const remark = this.remarks.find((remark) => remark.date === date);
      return remark ? remark.undertime : null; // Return null if no remark
    },
    async fetchAttendance() {
      try {
        this.errorMessage = null;

        console.log(this.dtrvalues.name_id);
        const response = await axios.get(`${API_BASE_URL}/dtrdays/${this.dtrvalues.id}`);
        const remarksponse = await axios.get(`${API_BASE_URL}/dtrremarks/${this.dtrvalues.id}`);
        // const response = await axios.get(`${API_BASE_URL}/attendance`, {
        //   params: {
        //     name_id: this.dtrvalues.name_id,
        //     start_date: this.dtrvalues.start_date,
        //     end_date: this.dtrvalues.end_date,
        //   },
        // });

        console.log("Raw response: from pdf.vue", response.data);

        // ✅ Ensure dtrData is ALWAYS an array
        if (Array.isArray(response.data)) {
          this.dtrData = response.data;
        } else if (response.data) {
          this.dtrData = [response.data]; // wrap single object into array
        } else {
          this.dtrData = [];
        }
        this.remarks = remarksponse.data;

        // console.log(this.dtrData);
        console.log("Updated dtrData from pdf.vue:", this.dtrData);
        console.log("Updated remarks from pdf.vue:", this.remarks);

        // ✅ Safe length check
        if (this.dtrData.length === 0) {
          alert("No attendance data found for the selected date range.");
          return;
        }
      } catch (error) {
        console.error("Attendance fetch error:", error);
        this.errorMessage = "No attendance recorded for selected date range.";
      }
    },
  },
  mounted() {
    // this.fetchAttendance();
    if (this.dtrvalues && this.dtrvalues.start_date && this.dtrvalues.end_date) {
      this.fetchAttendance();
    }
    // console.log("BIM2 from pdf.vue");
    // console.log("This is dtrvalues from pdf.vue OBJECTS", this.dtrvalues);
    // console.log("IMONG NGALAN from pdf.vue", this.name);
    // console.log("TIME KARON from pdf.vue", this.times);
    this.generateAllDays();
    // console.log("Generated Days: from pdf.view", this.allDays);
    // console.log("PDF RECEIVED from attendance:", this.dtrData);

    if (this.dtrvalues) {
      console.log("watdapak", this.dtrvalues.start_date);
    }

    //  if (this.dtrvalues){
    //    console.log("bombaaaa in PDF", this.dtrvalues)
    // };
    // if (this.dtrvalues && this.dtrvalues.lenght){
    //   this.dtrvalues.foreach((item, index) =>{
    //     console.log("MAO NI ANG INDEX ", index)
    //     console.log("Item: ", item)
    //   })
    // }
  },
  watch: {
    name() {
      this.fetchAttendance();
    },
  },
};
</script>

<style scoped>
.dtrx-wrapper {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
  color: #000000;
}

.dtrx-wrapper * {
  box-sizing: border-box;
}

/* Container to hold the columns */
.dtrx-container {
  flex-wrap: wrap;
  gap: 20px; /* Space between columns */
  justify-content: space-between;
  z-index: 9999999;
  display: flex;
}

/* Each form will take up 48% of the container width, so two can fit in a row */
.dtrx-form {
  width: 48%; /* Adjusted for two columns */
  page-break-after: always; /* Keep each form in its own block for printing */
}

/* TOP LINE */
.dtrx-topline {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 10px;
}

/* HEADER */
.dtrx-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.dtrx-logo img {
  width: 60px;
  height: 60px;
}

.dtrx-header-text {
  margin-left: 10px;
}

.dtrx-agency {
  font-weight: bold;
  font-size: 15px;
  text-align: center;
}

.dtrx-title {
  font-size: 14px;
  text-transform: uppercase;
  text-align: center;
}

/* NAME */
.dtrx-name-line {
  margin-bottom: 10px;
  border-bottom: 1px solid black;
  padding-bottom: 3px;
}

.dtrx-employee-name {
  font-weight: bold;
  font-size: 15px;
  text-align: center;
  display: block;
  margin: 0 auto;
}

/* MONTH */
.dtrx-month-line {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
}

.dtrx-month {
  font-weight: bold;
  text-align: center;
  display: block;
  margin: 0 auto;
  flex: 1; /* makes line stretch */
  border-bottom: 1px solid black;
  text-align: center;
  font-weight: bold;
}

/* HOURS */
.dtrx-hours-block {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 10px;
}

.dtrx-hours-right {
  display: flex; /* <-- needed */
  flex-direction: column;
  text-align: right;
}
.dtrx-hours-row {
  flex: 0; /* prevent stretching */
  justify-content: space-between;
}

.dtrx-hours-box {
  min-width: 40px;
  text-align: center;
  flex: 0 0 40px; /* makes line stretch */
  border-bottom: 1px solid black;
}

/* TABLE */
.dtrx-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 10px;
}

.dtrx-table th,
.dtrx-table td {
  border: 1px solid #000;
  padding: 4px 6px;
  text-align: center;
}

.dtrx-table-head {
  background: linear-gradient(180deg, #ffffff, #ffffff);
}

.dtrx-col-day {
  width: 50px;
}

.dtrx-subhead {
  font-weight: normal;
  font-size: 11px;
}

/* CERTIFICATION */
.dtrx-certification {
  margin-top: 20px;
  font-size: 12px;
  line-height: 1.4;
}

.dtrx-line {
  border-bottom: 1px solid #000;
  margin: 5px 0;
}

.dtrx-label {
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.dtrx-verified-block {
  margin-top: 10px;
  text-align: center;
}

.dtrx-verify-equals {
  font-family: monospace;
  font-size: 10px;
  margin-bottom: 2px;
}

.dtrx-verify-text {
  font-size: 10px;
}

.time-cell {
  font-size: 10px;
}
.hiding-class {
  display: none;
}

@media print {
  .dtrx-container {
    display: flex;
  }
  .hiding-class {
    display: flex;
  }
}

.day-cell {
  display: flex;
  justify-content: space-between;
  align-items: center; /* ensures vertical alignment */
  border-collapse: collapse;
}
</style>
