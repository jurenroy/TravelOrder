<template>
  <div class="audit-trails-container">
    <h2>Audit Trails</h2>
    <div class="filters">
      <select v-model="selectedModel" @change="fetchAuditLogs">
        <option value="">All Models</option>
        <option value="travel_clearances">Travel Clearances</option>
        <option value="form">Travel Orders</option>
        <option value="leaveform">Leave Forms</option>
        <option value="fad_rf_forms">FAD RF Forms</option>
        <option value="requests">ICT Requests</option>
        <option value="accounts">Accounts</option>
        <option value="employees">Employees</option>
        <option value="services">Services</option>
        <option value="feedback">Feedback</option>
        <option value="messages">Messages</option>
        <option value="job_order_requests">Job Orders</option>
      </select>
    </div>
    <div v-if="loading" class="loading">Loading audit logs...</div>
    <div v-else-if="auditLogs.length === 0" class="no-logs">No audit logs found.</div>
    <div v-else class="logs-list">
      <div v-for="log in auditLogs" :key="log.id" class="log-item">
        <div class="log-header">
          <span class="model">{{ log.model }}</span>
          <span class="action">{{ log.action }}</span>
          <span class="timestamp">{{ formatTimestamp(log.created_at) }}</span>
        </div>
        <div class="log-details">
          <div v-if="log.old_values" class="old-values">
            <strong>Old Values:</strong>
            <pre>{{ JSON.stringify(log.old_values, null, 2) }}</pre>
          </div>
          <div v-if="log.new_values" class="new-values">
            <strong>New Values:</strong>
            <pre>{{ JSON.stringify(log.new_values, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '../../config';

export default {
  name: 'AuditTrails',
  data() {
    return {
      auditLogs: [],
      loading: true,
      selectedModel: '',
    };
  },
  mounted() {
    this.fetchAuditLogs();
  },
  methods: {
    async fetchAuditLogs() {
      try {
        this.loading = true;
        let url = `${API_BASE_URL}/audit_logs`;
        if (this.selectedModel) {
          url += `/${this.selectedModel}`;
        }
        const response = await axios.get(url);
        this.auditLogs = response.data;
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        alert('Error fetching audit logs. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleString();
    },
  },
};
</script>

<style scoped>
.audit-trails-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.audit-trails-container h2 {
  color: #333;
  margin-bottom: 20px;
}

.filters {
  margin-bottom: 20px;
}

.filters select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

.loading, .no-logs {
  text-align: center;
  color: #666;
  font-size: 16px;
  padding: 20px;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.log-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.model {
  font-weight: bold;
  color: #28a745;
  background-color: #e8f5e8;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  text-transform: capitalize;
}

.action {
  font-weight: bold;
  color: #007bff;
  text-transform: capitalize;
}

.timestamp {
  color: #666;
  font-size: 14px;
}

.log-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.old-values, .new-values {
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #eee;
}

.old-values strong {
  color: #dc3545;
}

.new-values strong {
  color: #28a745;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  margin-top: 5px;
}
</style>
