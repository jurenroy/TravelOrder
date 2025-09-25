<template>
  <div class="global-feed-container">
    <div class="global-card-container" @scroll="handleScroll">
      <Addform class="sticky-addform" v-if="showAddForm" />
      <div v-for="item in feedItems" :key="item.id" class="global-card-item">
        <!-- If item is a travel order -->
        <div v-if="item.type === 'travelOrder'" class="global-travel-order-card">
          <div class="global-card-header">
            <div class="global-card-title">{{ item.destination }}</div>
            <div class="global-card-date">{{ item.date }}</div>
          </div>
          <div class="global-card-divider"></div>
          <div class="global-card-content">
            <p><strong>Purpose:</strong> {{ item.purpose }}</p>
            <p><strong>Departure:</strong> {{ item.departure }}</p>
            <p><strong>Arrival:</strong> {{ item.arrival }}</p>
            <p><strong>Remarks:</strong> {{ item.remarks || 'None' }}</p>
            <p><strong>Note:</strong> {{ item.note || 'No additional notes' }}</p>
          </div>
        </div>

        <!-- If item is a leave form -->
        <div v-else-if="item.type === 'leaveForm'" class="global-leave-form-card">
          <div class="global-card-header">
            <div class="global-card-title">{{ item.type }}</div>
            <div class="global-card-date">{{ item.date }}</div>
          </div>
          <div class="global-card-divider"></div>
          <div class="global-card-content">
            <p><strong>Details:</strong> {{ item.detail || 'No additional details' }}</p>
            <p><strong>Days:</strong> {{ item.days }}</p>
            <p><strong>Commutation Status:</strong> {{ item.commutation }}</p>
            <p><strong>Applicant:</strong> {{ item.applicant }}</p>
            <p><strong>Leave Dates:</strong> {{ item.dates }}</p>
          </div>
        </div>

        <!-- If item is an ICT service request -->
        <div v-else-if="item.type === 'ict'" class="global-ict-service-card">
          <div class="global-card-header">
            <div class="global-card-title">ICT Service Request #{{ item.id }}</div>
            <div class="global-card-date">{{ item.date }}</div>
          </div>
          <div class="global-card-divider"></div>
          <div class="global-card-content">
            <p><strong>Division:</strong> {{ item.division_id }}</p>
            <p><strong>Service Type:</strong> {{ item.typeOfService }}</p>
            <p><strong>Note:</strong> {{ item.note }}</p>
            <p><strong>Remarks:</strong> {{ item.remarks || 'None' }}</p>
            <p><strong>Requested By:</strong> {{ item.requestedBy }}</p>
            <p><strong>Approved By:</strong> {{ item.approvedBy }}</p>
          </div>
        </div>

        <!-- Action Buttons (same for both) -->
        <div class="global-button-line"></div>
        <div class="global-action-buttons">
          <button @click="initializeItem(item)" class="global-action-btn">
            <i class="fas fa-cogs"></i> Initialize
          </button>
          <button @click="viewDetails(item)" class="global-action-btn">
            <i class="fas fa-sticky-note"></i> View Details
          </button>
          <button @click="approveItem(item)" class="global-action-btn">
            <i class="fas fa-check-circle"></i> Approve
          </button>
          <button @click="viewPdf(item)" class="global-action-btn">
            <i class="fas fa-file-pdf"></i> View PDF 
          </button>
        </div>
      </div>
      <div v-if="loading" class="global-loading">Loading...</div>
    </div>
  </div>
  <!-- Modal Lightbox for PDF -->
  <div v-if="showPdfViewer" class="global-pdf-modal-overlay" @keydown.esc="closeModal" tabindex="0">
    <div class="global-pdf-modal-content">
      <!-- Close Button -->
      <button class="global-close-btn" @click="closeModal">✖</button>

      <!-- PDF Viewers -->
      <PDFICT v-if="selectedItem.type === 'ict'" :id="String(selectedItem.id)" />
      <PDFICTFF v-if="selectedItem.type === 'ict' && selectedItem.feedback_filled" :id="String(selectedItem.id)"/>
      <PDFTravelOrder v-if="selectedItem.type === 'travelOrder'" :travel_order_id="String(selectedItem.travel_order_id)" />
      <PDFLeaveForm v-if="selectedItem.type === 'leaveForm'" :leaveform_id="String(selectedItem.leaveform_id)" />
    </div>
  </div>
</template>

  <script setup>
  import { ref, onMounted, watch, onBeforeUnmount} from 'vue';
  import axios from 'axios';
  import { API_BASE_URL } from '@/config';
  import { useAuthStore } from '@/store/auth';
  import PDFTravelOrder from '@/views/travelorderV2/PDF.vue';
  import PDFLeaveForm from '@/views/leaveform/PDF.vue';
  import PDFICT from '@/views/ictsrf/ICTSRFview.vue';
  import PDFICTFF from '@/views/ictsrf/ICTSFFview.vue';
  import Addform from '../Addform/Addform.vue';
  
  const authStore = useAuthStore();
  
  const feedItems = ref([]); // All travel orders and leave forms combined
  const loading = ref(false);
  const cardsPerLoad = 3;
  const nameId = authStore.name_id;

  const showAddForm = ref(true);
  const threshold = 50; // prevent flicker on micro scrolls
  let lastScrollTop = 0;

    
  
  // Fetch both travel orders and leave forms data
  async function fetchData() {
    if (loading.value) return;
    loading.value = true;
  
    try {
        const [travelOrdersResponse, leaveFormsResponse, ictServicesResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/get_forms_json/${nameId}/Pending/${cardsPerLoad}/${feedItems.value.length}`),
      axios.get(`${API_BASE_URL}/get_leave_json/${nameId}/Pending/${cardsPerLoad}/${feedItems.value.length}`),
      axios.get(`${API_BASE_URL}/services/${nameId}/kulang/all/${cardsPerLoad}/${feedItems.value.length}`)
    ]);
  
      // Tag and combine data
      const travelOrders = travelOrdersResponse.data.map(item => ({ ...item, type: 'travelOrder' }));
      const leaveForms = leaveFormsResponse.data.map(item => ({ ...item, type: 'leaveForm' }));
      const ictRequests = ictServicesResponse.data.map(item => ({ ...item, type: 'ict' }));
      const combinedData = [...travelOrders, ...leaveForms, ...ictRequests];

      // Shuffle new data
      const newItems = shuffleArray(combinedData);

      // Prevent duplicates using a Set
      const existingIds = new Set(feedItems.value.map(item => item.type + '-' + (item.travel_order_id ?? item.leaveform_id)));
      const uniqueNewItems = newItems.filter(item => {
        const id = item.type + '-' + (item.travel_order_id ?? item.leaveform_id);
        return !existingIds.has(id);
      });

      // Append unique items
      feedItems.value.push(...uniqueNewItems);
  
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      loading.value = false;
    }
  }
  
  // Shuffle function to randomize order
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  // Handle scroll event for infinite scrolling
  const handleScroll = (event) => {
  const container = event.target;
  window.scrollTo(0, window.scrollY);
  
  const scrollTop = container.scrollTop;

  // Show Addform if near the top (like Facebook)
  if (scrollTop <= threshold) {
    showAddForm.value = true;
  } else if (scrollTop > lastScrollTop + threshold) {
    // Scrolling down
    showAddForm.value = false;
  } else if (scrollTop < lastScrollTop - threshold) {
    // Scrolling up
    showAddForm.value = true;
  }

  lastScrollTop = scrollTop;

  // 🔄 Infinite scroll trigger
  if (scrollTop + container.clientHeight >= container.scrollHeight - 100) {
    fetchData();
  }
};

  const showPdfViewer = ref(false);
const selectedItem = ref(null);
  
  // Initialize data (example action)
  function initializeItem(item) {
    console.log("Initializing:", item);
  }
  
  // View details (example action)
  function viewDetails(item) {
    console.log("Viewing details for:", item);
  }
  
  // Approve item (example action)
  function approveItem(item) {
    console.log("Approving:", item);
  }
  
  function viewPdf(item) {
  selectedItem.value = item;
  showPdfViewer.value = true;
  console.log(item)
}

function closeModal() {
  showPdfViewer.value = false;
  selectedItem.value = null;
}

// Optional: Auto-focus modal to capture ESC
watch(showPdfViewer, (visible) => {
  if (visible) {
    setTimeout(() => {
      document.querySelector('.pdf-modal-overlay')?.focus();
    }, 0);
  }
});

// Cleanup (optional if needed)
onBeforeUnmount(() => {
  showPdfViewer.value = false;
  selectedItem.value = null;
});
  
  // Fetch data on component mount
  onMounted(() => {
    fetchData();
  });
  </script>

  <style>
  .global-feed-container {
  width: 100%;
  overflow: hidden;
}

.global-card-container {
  width: 100%;
  padding-bottom: 2rem;
  overflow-y: scroll; /* Makes the container scrollable */
  height: 93vh;  /* Full viewport height */
}

.global-card-item {
  background: white;
  padding: 16px;
  border-radius: 12px; /* Rounded corners */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Softer shadow */
  border: solid rgb(185, 185, 185) 2px;
  width: 100%; /* Make cards take full width of the container */
  margin-bottom: 16px; /* Add space between cards */
  transition: transform 0.2s;
}

.global-card-item:hover {
  transform: translateY(-2px);
}

.global-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.global-card-title {
  font-weight: 600;
  font-size: 18px; /* Slightly larger font size */
  color: #1877f2; /* Facebook blue */
}

.global-card-date {
  font-size: 14px;
  color: #000000; /* Darker gray for date */
}

.global-card-content {
  color: #333; /* Darker text for better readability */
  margin-top: 8px; /* Space between title and content */
}

.global-card-divider {
  height: 1px;
  background: #e9ecef; /* Light gray divider */
  margin: 12px 0;
}

.global-loading {
  text-align: center;
  padding: 10px;
  color: #888;
}

/* Action buttons styling */
.global-action-buttons {
  display: flex;
  justify-content: space-between; /* Spread buttons equally */
  width: 100%; /* Full width of the card */
  margin-top: 12px;
}

.global-action-btn {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center; /* Center icons and text */
  color: #606770;
  font-size: 14px;
  cursor: pointer;
  padding: 12px;
  width: 19%; /* Buttons take equal space */
  transition: color 0.2s;
  border-radius: 8px; /* Rounded corners for buttons */
  text-align: center;
}

.global-action-btn:hover {
  color: #1877f2; /* Hover color similar to Facebook blue */
  background-color: #f0f2f5; /* Subtle background change on hover */
}

.global-action-btn i {
  margin-right: 6px; /* Space between icon and text */
}

/* Add a line above the action buttons */
.global-button-line {
  height: 1px;
  background-color: #e9ecef; /* Light gray line */
  margin-bottom: 12px; /* Space between line and buttons */
}

.global-pdf-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  outline: none;
}

.global-pdf-modal-content {
  position: relative;
  background-color: white;
  padding: 1.5em;
  border-radius: 8px;
  max-height: 90vh;
  max-width: 90vw;
  overflow: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

/* ❌ Close button */
.global-close-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  z-index: 10000;
}

.global-close-btn:hover {
  color: red;
}
.sticky-addform{
  position: sticky;
  top: 0;
  padding: 10px;
  margin-bottom: -20px;
}


@media print{
  .global-feed-container{
    display: none;
  }
}
  </style>
  