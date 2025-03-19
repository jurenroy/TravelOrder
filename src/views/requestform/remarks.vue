<template>
  <div class="document-remarks-overlay">
    <div class="document-remarks-modal">
      <div class="document-remarks-header">
        <h2>Document Remarks</h2>
        <div class="doc-subtitles">
        <div class="subtitle">Document</div>
        <div class="subtitle2">Status</div>
      </div>
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

<style src="./CSS/remarks.css" scoped></style>