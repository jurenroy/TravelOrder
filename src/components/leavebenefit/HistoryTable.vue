<template>
  <div>
    <h3>History</h3>

    <table class="history-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Type</th>
          <th>Value</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in history" :key="item.id">
          <td class="description-cell">
            <div class="description">
              {{ item.description }}
            </div>
            <small class="date">
              {{ formatDate(item.created_at) }}
            </small>
          </td>

          <td>{{ item.type }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ["history"],
  methods: {
    formatDate(date) {
      if (!date) return "";

      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  border: 1px solid #ddd;
  padding: 10px;
  vertical-align: top;
}

.description-cell {
  text-align: left;
}

.description {
  font-weight: 500;
}

.date {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #888;
}
</style>
