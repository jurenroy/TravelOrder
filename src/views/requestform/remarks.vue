<template>
  
 <div class="edit-action-popup">
  <div class="popup-content">
      <button class="close-button" @click="closePopup">X</button>
        <div v-if="showNotification" class="notification">
          {{ notificationMessage }}
        </div>
        <div class="document-list">
        <h2>Document Remarks</h2>
       <div class="document-status-summary">
        <span class="document-column">Document</span>
        <span class="status-column">Status</span>
        </div>
        <hr class="summary-border" />
      </div>

      
        <div
          v-for="(document, index) in documents"
          :key="index"
          class="document-status"
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
     
      <div class="status-summary">
        <span class="overall-status-label">Overall Status</span>
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
  data() {
    return {
      showNotification: false,
      notificationMessage: "",
    };
  },
  computed: {
    allDocumentsReleased() {
      const totalDocuments = this.documents.length;
      const releasedCount = this.documents.filter(
        (doc) => doc.remarks === "Released"
      ).length;

      return releasedCount === totalDocuments && totalDocuments > 0;
    },
  },
  methods: {
    toggleRemarks(index) {
      const currentRemark = this.documents[index].remarks;

      this.documents[index].remarks =
        currentRemark === "Released" ? "Pending" : "Released";

      this.notificationMessage =
        this.documents[index].remarks === "Released"
          ? `Document "${this.documents[index].name}" has been released.`
          : `Document "${this.documents[index].name}" has been set as pending.`;

      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
      }

      this.showNotification = true;

      this.notificationTimeout = setTimeout(() => {
        this.showNotification = false;
        this.notificationTimeout = null;
      }, 3000);

      if (this.checkAllReleased()) {
        this.setAllDocumentsReleasedStatus();
      }
      this.emitUpdatedDocuments();
    },
    checkAllReleased() {
      return this.documents.every((doc) => doc.remarks === "Released");
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
      this.$emit("submit", this.documents);
    },
    closePopup() {
      this.$emit("close");
    },
  },
};
</script>

<style src="./CSS/remarks.css" scoped></style>
