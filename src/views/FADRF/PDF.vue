<template>
  <div class="pdf-container">
    <div class="request-slip">
      <h1>Request Slip</h1>
      <table>
        <tr>
          <th>Requestor:</th>
          <td>{{ data.requestor }}</td>
          <th>Signature:</th>
          <td>{{ data.signature }}</td>
        </tr>
        <tr>
          <th>Division:</th>
          <td>{{ data.division }}</td>
          <th>Date:</th>
          <td>{{ data.date }}</td>
        </tr>
      </table>

      <table>
        <thead>
          <tr>
            <th>Document(s) Requested</th>
            <th>Date & Time Requested</th>
            <th>Date & Time Released</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(document, index) in data.documents" :key="index">
            <td>{{ document.name }}</td>
            <td>{{ document.dateTimeRequested }}</td>
            <td>{{ document.dateTimeReleased }}</td>
          </tr>
        </tbody>
      </table>

      <div class="rating">
        <span v-for="n in data.rating" :key="n">⭐</span>
      </div>
    </div>

    <button @click="printPDF">Print</button>
  </div>
</template>

<script>
export default {
  name: 'PDF',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    requestor() {
      return this.data.requestor;
    },
    signature() {
      return this.data.signature;
    },
    division() {
      return this.data.division;
    },
    date() {
      return this.data.date;
    },
    documents() {
      return this.data.documents;
    },
    rating() {
      return this.data.rating;
    }
  }
}
</script>

<style scoped>
.pdf-container {
  padding: 20px;
}

.request-slip {
  border: 1px solid #ccc;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.rating {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.rating span {
  margin: 0 5px;
}
</style>