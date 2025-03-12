<template>
  <div class="edit-action-popup">
    <div class="popup-content">
      <div class="close-button" @click="closePopup">X</div>
      <h2>Document Remarks</h2>
      <div
        v-for="(document, index) in documents"
        :key="index"
        class="document-status"
      >
        <span>{{ document.name }}</span>
        <button
          @click="toggleRemarks(index)"
          :class="{ released: document.remarks === 'Released' }"
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
        <p>Status: {{ getOverallRemarks() }}</p>
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
  methods: {
    toggleRemarks(index) {
      // Check the current state of the remarks
      const currentRemark = this.documents[index].remarks;

      // Toggle the remarks of the document
      this.documents[index].remarks =
        currentRemark === "Released" ? "Incomplete" : "Released";

      // Show an alert based on the new state
      if (this.documents[index].remarks === "Released") {
        alert(`Document "${this.documents[index].name}" has been released.`);
      } else {
        alert(
          `Document "${this.documents[index].name}" has been set as pending.`
        );
      }

      // Emit the updated documents to the parent component
      this.emitUpdatedDocuments();
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
.edit-action-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(10px);
}
.popup-content {
  background: linear-gradient(145deg, #fff8f0, #e6d5c3);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.1),
    -8px -8px 20px rgba(255, 255, 255, 0.7);
  text-align: center;
  width: 1000px;
  color: #333;
  font-family: "Arial", sans-serif;
  position: relative;
}
h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}
.document-status {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  gap: 15px 80px;
  text-align: left;
  border-collapse: collapse;
}

.document-status div {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #99500c;
}

.document-status button {
  padding: 10px 20px;
  min-width: 100px;
  margin-bottom: 10px;
  border-radius: 25px;
  font-size: 16px;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 2px solid black;
  text-align: center;
}

.document-status button:hover {
  transform: scale(1.1);
  background-color: rgba(109, 107, 107, 0.712);
}

.released-btn {
  background-color: #2e8b57 !important; /* Green */
  color: white;
}

.released-btn:hover {
  background-color: #1e6b42 !important;
}

.unreleased-btn {
  background-color: #99500c !important; /* Brown */
  color: white;
}

.unreleased-btn:hover {
  background-color: #7a4b23 !important;
}

.status-indicator {
  color: #99500c;
  font-weight: bold;
}

.status-indicator.released-text {
  color: #2e8b57; /* Green text when Released */
}

.status-summary {
  margin-top: 20px;
  font-size: 18px;
  color: #555;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  color: #333;
  font-size: 24px;
  background: none;
  border: none;
  padding: 5px;
  transition: transform 0.2s ease;
}

.close-button:hover {
  transform: scale(1.1);
}
</style>
