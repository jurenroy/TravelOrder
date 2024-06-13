<template>
  <div style=" height: 100%; width: 100%; margin-top: -15px">
    <h1 style="justify-content: center; display: flex;">ADD FORM</h1>
    <div style="">
      <label for="date-input">Select Date: </label>
      <input type="date" id="date-input" v-model="selectedDate" @change="handleDateChange" />
      <p v-if="!isSingleDate && startDate && !endDate && selectedDate">Inclusive for Single Dates: {{ formattedStartDate
        }}</p>
      <p v-if="isSingleDate && selectedDate">Selected Date: {{ formattedDate }}</p>
      <p v-if="!isSingleDate && startDate && endDate">
        Inclusive Dates:
        {{ formattedStartDate }}
        <template
          v-if="startDate.getMonth() !== endDate.getMonth() || startDate.getFullYear() !== endDate.getFullYear()">
          - {{ formattedEndDate }}
        </template>
      </p>
      <p v-if="!isSingleDate">Number of Working Days Applied For: {{ weekdaysCount }} {{ weekdaysCount === 1 ? 'Day' :
        'Days'
        }}</p>
    </div>
    <button @click="addleave">Back</button>
  </div>
</template>

<script>
import { isregisclick, leaveedit, isaddleave } from './leaveform.vue';
import { showEdit } from '@/components/heder.vue';

export default {
  data() {
    return {
      isSingleDate: true,
      selectedDate: '',
      startDate: null,
      endDate: null,
      weekdaysCount: 1,
    };
  },
  computed: {
    formattedDate() {
      if (!this.selectedDate) return '';
      const date = new Date(this.selectedDate);
      return `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
    },
    formattedStartDate() {
      if (!this.startDate) return '';
      const startDate = new Date(this.startDate);
      const endDate = this.endDate ? new Date(this.endDate) : null;

      if (endDate && startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
        return `${startDate.toLocaleString('en-US', { month: 'long' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
      } else {
        return `${startDate.toLocaleString('en-US', { month: 'long' })} ${startDate.getDate()}, ${startDate.getFullYear()}`;
      }
    },
    formattedEndDate() {
      if (!this.endDate) return '';
      const endDate = new Date(this.endDate);
      return `${endDate.toLocaleString('en-US', { month: 'long' })} ${endDate.getDate()}, ${endDate.getFullYear()}`;
    }
  },
  methods: {
    addleave() {
      isaddleave.value = false;
      showEdit.value = false;
      isregisclick.value = false;
      leaveedit.value = false;
    },
    handleDateChange() {
      const selectedDate = new Date(this.selectedDate);
      if (!this.startDate) {
        this.startDate = selectedDate;
        this.isSingleDate = false; // Switch to date range mode
      } else if (this.isSingleDate) {
        this.startDate = selectedDate;
        this.endDate = null;
      } else {
        if (selectedDate < this.startDate) {
          this.startDate = selectedDate;
          this.endDate = null;
        } else if (selectedDate > this.startDate) {
          this.endDate = selectedDate;
          this.weekdaysCount = this.calculateWeekdays(this.startDate, this.endDate);
        } else {
          this.startDate = selectedDate;
          this.endDate = null;
          this.weekdaysCount = 0;
        }
      }
      if (this.startDate && this.endDate) {
        this.weekdaysCount = this.calculateWeekdays(this.startDate, this.endDate);
      } else {
        this.weekdaysCount = 1; // Reset to 1 for a single date or incomplete range
      }
    },
    calculateWeekdays(startDate, endDate) {
      let count = 0;
      let currentDate = new Date(startDate);
      endDate = new Date(endDate);
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return count;
    },
    goBack() {
      // Implement logic to navigate back
    }
  }
};
</script>
