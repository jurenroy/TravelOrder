<template>
  <div class="document-remarks-overlay">
    <div class="document-remarks-modal">
      <div class="document-remarks-header">
        <h2>Document Remarks</h2>
        <button class="close-button" @click="closePopup">✕</button>
      </div>
      <div class="document-list">
        <div v-for="(document, index) in documents" :key="index" class="document-item">
          <span class="document-name">{{ document.name }}</span>
          <div class="document-controls">
            <button 
              class="toggle-button"
              :class="{ 'released': document.remarks === 'Released' }"
              @click="toggleRemarks(index)"
            >
              {{ document.remarks === 'Released' ? 'Unrelease' : 'Release' }}
            </button>
            <span 
              class="status-badge"
              :class="{ 'released': document.remarks === 'Released' }"
            >
              {{ document.remarks }}
            </span>
          </div>
        </div>
      </div>
      <div class="overall-status">
        <span class="status-label">Overall Status</span>
        <span class="status-badge">{{ getOverallRemarks() }}</span>
      </div>
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
.document-remarks-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.3s ease-out;
  z-index: 1000;
}
.document-remarks-modal {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 28rem;
  width: 100%;
  padding: 1.5rem;
  animation: slideUp 0.3s ease-out;
}
.document-remarks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.document-remarks-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}
.close-button {
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.25rem;
  transition: color 0.2s;
}
.close-button:hover {
  color: #374151;
}
.document-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgb(255, 255, 255);
  border: 1px solid #050a13;
  border-radius: 0.75rem;
  transition: border-color 0.2s;
}
.document-item:hover {
  border-color: #E5E7EB;
}
.document-name {
  font-weight: 500;
  color: #000000;
}
.document-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.toggle-button {
  font-size: 17px;
  background: transparent;
  border: none;
  padding: 0.3em 0.2em;
  color: black;
  text-transform: uppercase;
  position: relative;
  transition: 0.5s ease;
  cursor: pointer;
  border: rgb(202, 201, 201) 2px solid;
}
.toggle-button:before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0;
  background-color: gray;
  transition: 0.5s ease;
}
.toggle-button:hover{
  color: #1e1e2b;
  transition-delay: 0.5s;
}
.toggle-button:hover::before{
  width: 100%;
}
.toggle-button:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 0;
  width: 100%;
  background-color: #ffc506;
  transition: 0.4s ease;
  z-index: -1;
}

.toggle-button:hover::after {
  height: 100%;
  transition-delay: 0.4s;
  color: aliceblue;
}
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #f1a979ec;
  color: #000000;
}
.status-badge.released {
  background-color: #13d671;
  color: #000000;
}
.overall-status {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status-label {
  font-size: 0.875rem;
  color: #6B7280;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>