<template>
  <div class="container">
    <h1>Leave Dashboard</h1>

    <LeaveType v-model="selectedLeaveType" />

    <div class="layout-row">
      <!-- LEFT: Leave Forms -->
      <div class="right-panel">
        <SummaryCard :summary="summary" />
      </div>

      <!-- RIGHT: Summary -->
      <div class="left-panel">
        <SickLeave v-if="selectedLeaveType === 'sick'" />
        <VacationLeave v-else-if="selectedLeaveType === 'vacation'" />
        <WellnessLeave v-else-if="selectedLeaveType === 'wellness'" />
      </div>
    </div>

    <HistoryTable :history="summary.history" />
  </div>
</template>

<script>
import axios from "axios";

import SummaryCard from "@/components/leavebenefit/SummaryCard.vue";
import LeaveForm from "@/components/leavebenefit/LeaveForm.vue";
import HistoryTable from "@/components/leavebenefit/HistoryTable.vue";
import LeaveType from "@/components/leavebenefit/LeaveType.vue";

import SickLeave from "@/components/leavebenefit/SickLeave.vue";
import VacationLeave from "@/components/leavebenefit/VacationLeave.vue";
import WellnessLeave from "@/components/leavebenefit/WellnessLeave.vue";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  components: {
    SummaryCard,
    LeaveForm,
    HistoryTable,
    LeaveType,
    SickLeave,
    VacationLeave,
    WellnessLeave,
  },

  data() {
    return {
      selectedLeaveType: null,
      summary: {
        total_leave_hours: 0,
        history: [],
        monthly_growth: [],
      },
      userId: 1,
    };
  },

  methods: {
    async fetchData() {
      const res = await api.get(`/leave-benefits/${this.userId}`);
      this.summary = res.data.data;
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>

<style>
.container {
  max-width: 900px;
  margin: auto;
  font-family: Arial, sans-serif;
}

/* 🔥 MAIN LAYOUT */
.layout-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-top: 20px;
}

/* LEFT SIDE (Forms) */
.left-panel {
  flex: 2;
  min-width: 0;
}

/* RIGHT SIDE (Summary Card) */
.right-panel {
  flex: 1;
  min-width: 250px;
}

/* 📱 Responsive layout */
@media (max-width: 768px) {
  .layout-row {
    flex-direction: column;
  }

  .right-panel {
    width: 100%;
  }
}
</style>
