<template>
  <div class="edit-action-popup">
    <div class="popup-content">
      <div class="close-button" @click="closePopup">X</div>
      <h2>Document Remarks</h2>
      <div class="document-status-summary">
        <span class="document-column">Document</span>
        <span class="status-column">Status</span>
      </div>
      <hr class="summary-border" />

      <div
        v-for="(document, index) in documents"
        :key="index"
        class="document-status"
      >
        <span>{{ document.name }}</span>
        <button
          @click="toggleRemarks(index)"
          :class="{ released: document.remarks === 'Released' }"
         v-if="!(documents.length > 1 && allDocumentsReleased)"
        >
          {{ document.remarks === "Released" ? "Unrelease" : "Release" }}
        </button>
        <span
          :class="{
            'status-indicator': true,
            'released-text': document.remarks === 'Released',
          }"
        >
          {{ document.remarks }}
        </span>
      </div>
      <div class="status-summary">
  <span class="overall-status-label">Overall Status:</span>
  <span class="overall-status-value">{{ getOverallRemarks() }}</span>
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
      const currentRemark = this.documents[index].remarks;

      this.documents[index].remarks =
        currentRemark === "Released" ? "Incomplete" : "Released";

      if (this.documents[index].remarks === "Released") {
        alert(`Document "${this.documents[index].name}" has been released.`);
      } else {
        alert(
          `Document "${this.documents[index].name}" has been set as pending.`
        );
      }

      if (this.checkAllReleased()) {
        this.setAllDocumentsReleasedStatus();
      }

     
      this.emitUpdatedDocuments();
    },
    checkAllReleased() {
      return this.documents.every(doc => doc.remarks === "Released");
    },
    setAllDocumentsReleasedStatus() {
      this.$emit("all-released", true);
    },
    getOverallRemarks() {
      const totalDocuments = this.documents.length;
      const releasedCount = this.documents.filter(
        (doc) => doc.remarks === "Released"
      ).length;

      if (releasedCount === totalDocuments && totalDocuments > 0) {
        return "All documents released";
      } else {
        return `${releasedCount}/${totalDocuments} documents released`;
      }
    },
    emitUpdatedDocuments() {
      this.$emit("submit", this.documents);
    },
    closePopup() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
:root {
  --status-released: #34C759;
  --status-unreleased: #FF9500;
  --status-error: #FF3B30;
  --primary-color: rgb(30, 64, 175);
  --background-color: #f8f9fa;
  --card-background: rgba(255, 255, 255, 0.8);
  --text-color: #1a202c;
  --border-color: #e2e8f0;
}

.edit-action-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(10px);
}

.popup-content {
    background: #fffbf2;

  backdrop-filter: blur(50px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 900px; /* Increased from 700px to 900px */
  position: relative;
  padding-top: 1.5rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  margin: 0;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  position: absolute;
  
  right: 1.25rem;
  font-size: 1.25rem;
  height: 2rem;
  width: 2rem;

  position: absolute;
  top: 1.5rem;
  
  margin: 0;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.document-status-summary {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  font-weight: 500;
  color: #718096;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid var(--border-color);
  margin-top: 1rem;
}

.document-column {
  text-align: left;
}

.status-column {
  text-align: right;
}

.summary-border {
  display: none;
}

.document-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
  background-color: transparent;
}

.document-status:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.document-status span:first-child {
  font-weight: 500;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.document-status:hover span:first-child {
  color: var(--primary-color);
}

.document-status button {
  padding: 0.6rem 1.2rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: none;
  color: var(--status-unreleased);
  border: 1px solid rgba(255, 149, 0, 0.2);
  background-color: rgba(255, 149, 0, 0.1);
}

.document-status button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.document-status button.released {
  background-color: rgba(52, 199, 89, 0.1);
  color: var(--status-released);
  border: 1px solid rgba(52, 199, 89, 0.2);
}

.status-indicator {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.025em;
  min-width: 120px;
  justify-content: center;
  color: var(--status-unreleased);
  background-color: rgba(255, 149, 0, 0.1);
  border: 1px solid rgba(255, 149, 0, 0.2);
}

.status-indicator.released-text {
  background-color: rgba(52, 199, 89, 0.1);
  color: var(--status-released);
  border: 1px solid rgba(52, 199, 89, 0.2);
  margin-left: 0;
  width: auto;
}

.status-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  font-weight: 500;
  margin-top: 0;
}

.overall-status-label {
  color: #4a5568;
}

.overall-status-value {
  display: flex;
  align-items: center;
  color: var(--status-unreleased);
}

/* Media Queries */
@media (max-width: 640px) {
  .popup-content {
    border-radius: 1rem;
  }
  
  .document-status span:first-child {
    font-size: 0.875rem;
  }
  
  .status-indicator {
    font-size: 0.75rem;
    min-width: 100px;
  }
}

/* Dark Mode - you can add a toggle to enable this */
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #1a202c;
    --card-background: rgba(26, 32, 44, 0.8);
    --text-color: #f7fafc;
    --border-color: #2d3748;
  }
  
  .document-status-summary {
    background-color: rgba(255, 255, 255, 0.03);
  }
  
  .document-status:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
  
  .close-button:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .overall-status-label {
    color: #a0aec0;
  }
}
</style>