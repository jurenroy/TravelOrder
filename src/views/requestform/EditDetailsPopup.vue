<template>
  <div class="edit-action-popup">
    <div class="popup-content">
      <h2> Document Remarks</h2>
      <div v-for="(document, index) in documents" :key="index" class="document-status">
        <span>{{ document.name }}</span>
        <!-- Single button to toggle between Release and Unrelease -->
        <button @click="toggleRemarks(index)">
          {{ document.remarks === 'Released' ? 'Unrelease' : 'Release' }}
        </button>
        <span v-if="document.remarks === 'Released'" class="status-indicator">Released</span>
        <span v-if="document.remarks === 'Unreleased'" class="status-indicator">Unreleased</span>
      </div>
      <div class="status-summary">
        <p>Status: {{ getOverallRemarks() }}</p>
      </div>
      <div class="close-button" @click="closePopup">X</div> <!-- Close button -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    documents: {
      type: Array,
      required: true
    }
  },
  methods: {
    toggleRemarks(index) {
      // Check the current state of the remarks
      const currentRemark = this.documents[index].remarks;

      // Toggle the remarks of the document
      this.documents[index].remarks = currentRemark === 'Released' ? 'Unreleased' : 'Released';

      // Show an alert based on the new state
      if (this.documents[index].remarks === 'Released') {
        alert(`Document "${this.documents[index].name}" has been released.`);
      } else {
        alert(`Document "${this.documents[index].name}" has been unreleased.`);
      }

      // Emit the updated documents to the parent component
      this.emitUpdatedDocuments();
    },
    getOverallRemarks() {
      console.log(this.documents)
      const totalDocuments = this.documents.length;
      const releasedCount = this.documents.filter(doc => doc.remarks === 'Released').length;

      if (releasedCount === totalDocuments && totalDocuments > 0) {
        return 'All documents released';
      } else {
        return `${releasedCount}/${totalDocuments} documents`;
      }

      
    },
    emitUpdatedDocuments() {
      // Emit the updated documents to the parent component
      this.$emit('submit', this.documents);
    },
    closePopup() {
      // Emit an event to close the popup without submitting
      this.$emit('close');
    }
  }
};      
</script>

<style scoped>
.edit-action-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.document-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.status-summary {
  margin-top: 20px;
}

.buttons {
  margin-top: 20px;
}
.status-indicator {
  color: green; /* Change color as needed */
  margin-left: 10px;
}
.close-button {
  cursor: pointer;
  color: red; /* Change color as needed */
  font-weight: bold;
  margin-top: 10px;
  text-align: right; /* Align to the right */
}
</style>