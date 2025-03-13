<template>
  <div class="document-remarks-overlay">
    <div class="document-remarks-modal">
      <div class="document-remarks-header">
        <h2>Document Remarks</h2>
        <button class="close-button" @click="closePopup">✕</button>
      </div>
      <div class="document-list">
        <div
          v-for="(document, index) in documents"
          :key="index"
          class="document-item"
        >
          <span class="document-name">{{ document.name }}</span>
          <div class="document-controls">
            <button
              v-if="!allDocumentsReleased"
              class="toggle-button"
              :class="{ released: document.remarks === 'Released' }"
              @click="toggleRemarks(index)"
            >
              {{ document.remarks === "Released" ? "Pending" : "Release" }}
            </button>
            <span
              class="status-badge"
              :class="{ released: document.remarks === 'Released' }"
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
      required: true,
    },
  },
  computed: {
    allDocumentsReleased() {
      const totalDocuments = this.documents.length;
      const releasedCount = this.documents.filter(
        (doc) => doc.remarks === "Released"
      ).length;
      
      return releasedCount === totalDocuments && totalDocuments > 0;
    }
  },
  methods: {
    toggleRemarks(index) {
      // Check the current state of the remarks
      const currentRemark = this.documents[index].remarks;

      // Toggle the remarks of the document
      this.documents[index].remarks =
        currentRemark === "Released" ? "Pending" : "Released";

      // Show an alert based on the new state
      if (this.documents[index].remarks === "Released") {
        alert(`Document "${this.documents[index].name}" has been released.`);
      } else {
        alert(`Document "${this.documents[index].name}" has been set as pending.`);
      }

      if (this.checkAllReleased()) {
        this.setAllDocumentsReleasedStatus();
      }
      // Emit the updated documents to the parent component
      this.emitUpdatedDocuments();
    },
    checkAllReleased() {
      return this.documents.every(doc => doc.remarks === "Released");
    },
    setAllDocumentsReleasedStatus() {
      this.$emit("all-released", true);
    },
    getOverallRemarks() {
      console.log(this.documents);
      const totalDocuments = this.documents.length;
      const releasedCount = this.documents.filter(
        (doc) => doc.remarks === "Released"
      ).length;

      if (releasedCount === totalDocuments && totalDocuments > 0) {
        return "All documents released";
      } else {
        return `${releasedCount}/${totalDocuments} documents`;
      }
    },
    emitUpdatedDocuments() {
      // Emit the updated documents to the parent component
      this.$emit("submit", this.documents);
    },
    closePopup() {
      // Emit an event to close the popup without submitting
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.document-remarks-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.3s ease-out;
  z-index: 1000;
}

.document-remarks-modal {
  background: rgba(40, 40, 40, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  max-width: 30rem;
  width: 100%;
  padding: 1.8rem;
  animation: slideUp 0.3s ease-out;
}

.document-remarks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.document-remarks-header h2 {
  font-size: 1.6rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #c9c9c9;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.25rem;
  transition: color 0.2s;
}

.close-button:hover {
  color: #ffffff;
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
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: border-color 0.3s, transform 0.2s ease;
}

.document-item:hover {
  border-color: #ffb74d;
  transform: scale(1.02);
}

.document-name {
  font-weight: 500;
  color: #ffffff;
}

.document-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-button {
  font-size: 16px;
  background: transparent;
  border: 2px solid #ff9800;
  padding: 8px 14px;
  color: #ff9800;
  text-transform: uppercase;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
}

.toggle-button::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #ff9800, #ffb74d);
  transition: width 0.3s ease-in-out;
  z-index: -1;
}

.toggle-button:hover::before {
  width: 100%;
}

.toggle-button:hover {
  color: #ffffff;
  border-color: #ffb74d;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: #f1a979ec;
  color: #000000;
  border-radius: 6px;
}

.status-badge.released {
  background-color: #13d671;
  color: #ffffff;
}

.overall-status {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-size: 0.9rem;
  color: #c9c9c9;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
