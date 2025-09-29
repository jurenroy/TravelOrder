<template>
  <div class="global-feed-container">
    <div class="global-card-container" @scroll="handleScroll">
      <Addform class="sticky-addform" v-if="showAddForm" />
      <div v-for="item in feedItems" :key="item.id" class="global-card-item">
        <!-- If item is a travel order -->
        <div v-if="item.types === 'travelOrder'" class="global-travel-order-card">
          <div class="global-card-header">
            <div class="global-card-title">{{ getName(item.name_id) }} (Travel Order: {{ formattedItem(item.date,item.to_num) }})</div>
            <div class="global-card-date">{{ extractDate(item.date) }}</div>
          </div>
          <div class="global-card-divider"></div>
          <div class="global-card-content">
            <p><strong>Destination:</strong> {{ item.destination }}</p>
            <p><strong>Purpose:</strong> {{ item.purpose }}</p>
            <p><strong>Departure:</strong> {{ item.departure }}</p>
            <p><strong>Arrival:</strong> {{ item.arrival }}</p>
          </div>
        </div>


        <!-- If item is a leave form -->
        <div v-else-if="item.types === 'leaveForm'" class="global-leave-form-card">
          <div class="global-card-header">
            <div class="global-card-title">{{ getName(item.name_id) }} (Leave Form)</div>
            <div class="global-card-date">{{ extractDate(item.date) }}</div>
          </div>
          <div class="global-card-divider"></div>
          <div class="global-card-content">
            <p><strong>Type:</strong> {{ item.type || 'No additional details' }}</p>
            <p><strong>Details:</strong> {{ item.detail || 'No additional details' }}</p>
            <p><strong>Days:</strong> {{ item.days }}</p>
            <p><strong>Leave Dates:</strong> {{ item.dates }}</p>
          </div>
        </div>

        <!-- If item is an ICT service request -->
        <div v-else-if="item.types === 'ict'" class="global-ict-service-card">
          <div class="global-card-header">
            <div class="global-card-title">{{ getName(item.requestedBy) }} (ICT Request)</div>
            <div class="global-card-date">{{ extractDate(item.date) }}</div>
          </div>
          <div class="global-card-divider"></div>
          <div class="global-card-content">
            <p><strong>Service Type:</strong> {{ item.typeOfService }}</p>
            <p><strong>Note:</strong> {{ item.note }}</p>
            <ul v-if="item.files">
              <li v-for="file in item.files" :key="file">
                <a :href="`${API_BASE_URL}/storage/ictrequest/${file}`" target="_blank">
                  {{ file }}
                </a>
              </li>
            </ul>
            <p><strong>Remarks:</strong> {{ item.remarks || 'None' }}</p>
          </div>
        </div>
        
        <div class="global-button-line" ></div>
        <!-- Status Section: Show statuses in a single row -->
        <div class="feed-status-row" v-if="item.types === 'travelOrder'">
          <!-- If still pending for initial -->
          <div v-if="isInitialNull(item)" class="status-item status-pending">
            For Initial by: {{ initialStatus }}
          </div>

        <!-- If already initialized -->
        <div v-if="isInitialized(item)" class="status-item status-approved">
          Initialized
          <span v-if="initializedByRD(item)">by RD</span>
          <span v-else-if="initializedByDC(item)">by DC</span>
          <span v-else-if="item.intervals === 1">by DC</span>
          <span v-else>by SC</span>
        </div>

        <div v-if="isNoteNull(item)" class="status-item status-pending-note">
          To be Noted
        </div>

        <div v-if="isNoted(item)" class="status-item status-approved-note">
          Noted
        </div>

        <div v-if="isRecommendationPending" class="status-item status-pending-recommendation">
          For Recommendation
          <span v-if="forRecommendationbyRED(item)">by RED</span>
          <span v-else-if="forRecommendationToSCbyCAO(item)">by CAO</span>
          <span v-else-if="item.intervals === 1">by CAO</span>
          <span v-else>by DC</span>
        </div>

        <div v-if="isRecommendationApproved" class="status-item status-approved-recommendation">
          Recommended
          <span v-if="recommendedbyRED(item)">by RED</span>
          <span v-else-if="recommendedbyCAO(item)">by CAO</span>
          <span v-else-if="item.intervals === 1">by CAO</span>
          <span v-else>by DC</span>
        </div>

        <div v-if="isApprovalPending" class="status-item status-pending-approval">
          For Approval
          <span v-if="forApprovalbyRED(item)">by RED</span>
          <span v-if="forApprovalbyBD(item)">by BD</span>
        </div>

        <div v-if="isApproved" class="status-item status-approved-approval">
        
          Approved
          <span v-if="item.sname !== 20">by: {{ getName(item.sname) }}</span>
        </div>
      </div>


      <div  v-else-if="item.types === 'leaveForm'" class="feed-status-row">
        <div class="status-item status-pending" v-if="!item.certification">
          For Certification
        </div>
      
        <div v-if="item.certification" class="status-item status-approved">
          Certified
        </div>

        <div v-if="(item.certification && (![15,21,45,48].includes(item.name_id))) && !item.recommendation" class="status-item status-pending">
          For Recommendation
        </div>
      
        <div v-if="item.recommendation && parseInt(item.reco) == 1" class="status-item status-approved">
          Recommended
        </div>
      
        <div v-if="item.recommendation && item.recodesc" class="status-item status-pending">
          Not Recommended
        </div>

        <div v-if="item.recommendation || (item.certification) || ([15,21,45,48].includes(item.name_id) && item.certification)">

          <div v-if="!item.appsig" class="status-item status-pending">
            For Approval
          </div>
        
          <div v-if="item.appsig && !item.disapproved" class="status-item status-approved">
            Approved
          </div>

          <div v-if="item.appsig && item.disapproved" class="status-item status-pending">
            Not Approved
          </div>

        </div>
      </div>

      <div  v-else-if="item.types === 'ict'" class="feed-status-row">
        <div class="status-item status-pending">
          {{ item.serviceBy ? item.remarks : 'Pending'}}
        </div>

        <div class="status-item status-pending" v-if="!item.approvedBy && item.serviceBy">
          Not yet approved
        </div>

        <div v-if="item.approvedBy" class="status-item status-approved">
          Approved
        </div>
      
        <div class="status-item status-pending" v-if="!item.feedback_filled && item.serviceBy">
          No feedback from user
        </div>
      
        <div v-if="item.feedback_filled" class="status-item status-approved">
          Done Feedback
        </div>

      </div>


        <!-- Action Buttons (same for both) -->
        <div class="global-button-line"></div>
        <div class="global-action-buttons">
          <button @click="initializeItem(item)" class="global-action-btn">
            <i class="fas fa-cogs"></i> Initialize
          </button>
          <!-- <button @click="viewDetails(item)" class="global-action-btn">
            <i class="fas fa-sticky-note"></i> View Details
          </button> -->
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
      <PDFICT v-if="selectedItem.types === 'ict'" :id="String(selectedItem.id)" />
      <PDFICTFF v-if="selectedItem.types === 'ict' && selectedItem.feedback_filled" :id="String(selectedItem.id)"/>
      <PDFTravelOrder v-if="selectedItem.types === 'travelOrder'" :travel_order_id="String(selectedItem.travel_order_id)" />
      <PDFLeaveForm v-if="selectedItem.types === 'leaveForm'" :leaveform_id="String(selectedItem.leaveform_id)" />
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
  import ItemIndicators from '@/components/validators/TravelOrderTable.js'; // Import ItemIndicators
  
  const authStore = useAuthStore();
  
  const feedItems = ref([]); // All travel orders and leave forms combined
  const loading = ref(false);
  const cardsPerLoad = 3;
  const nameId = authStore.name_id;

  const showAddForm = ref(true);
  const threshold = 50; // prevent flicker on micro scrolls
  let lastScrollTop = 0;
  const names =ref([])
    

  const extractDate = (input) => {
  return new Date(input).toISOString().slice(0, 10);
};
  
  // Fetch both travel orders and leave forms data
  async function fetchData() {
    if (loading.value) return;
    loading.value = true;
  
    try {
        const [travelOrdersResponse, leaveFormsResponse, ictServicesResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/get_forms_json/${nameId}/Pending/${cardsPerLoad}/${feedItems.value.length/2}`),
      axios.get(`${API_BASE_URL}/get_leave_json/${nameId}/Pending/${cardsPerLoad}/${feedItems.value.length/2}`),
      axios.get(`${API_BASE_URL}/services/${nameId}/kulang/all/${cardsPerLoad}/${feedItems.value.length/2}`)
    ]);
  
      // Tag and combine data
      console.log(leaveFormsResponse.data)
      const travelOrders = travelOrdersResponse.data.map(item => ({ ...item, types: 'travelOrder' }));
      const leaveForms = leaveFormsResponse.data.map(item => ({ ...item, types: 'leaveForm' }));
      const ictRequests = ictServicesResponse.data.map(item => ({ ...item, types: 'ict' }));
      const combinedData = [...travelOrders, ...leaveForms, ...ictRequests];

      // Shuffle new data
      const newItems = shuffleArray(combinedData);

      // Prevent duplicates using a Set
const existingIds = new Set(
  feedItems.value.map(item => {
    // If both travel_order_id and leaveform_id are undefined, skip the item
    const id = item.types + '-' + (item.travel_order_id ?? item.leaveform_id ?? item.id); // Use a fallback like 'item.id' if both are undefined
    return id;
  })
);

// Filter out items that are already in the feed
const uniqueNewItems = newItems.filter(item => {
  // Generate unique ID, falling back to `item.id` if both `travel_order_id` and `leaveform_id` are missing
  const id = item.types + '-' + (item.travel_order_id ?? item.leaveform_id ?? item.id);
  
  // Check if the ID exists in the Set of existing IDs
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

  async function fetchNames() {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_names_json/`)
    names.value = response.data
  } catch (error) {
    console.error('Failed to fetch names:', error)
  }
}
function getName(nameID) {
  const name = names.value.find(n => n.name_id === nameID)

  if (!name) {
    return 'Name not found'
  }

  // Format the name as 'FIRST NAME MIDDLE INIT. LASTNAME'
  return `${name.first_name.toUpperCase()} ${name.middle_init.toUpperCase()} ${name.last_name.toUpperCase()}`
}

// Method to format the date and number
function formattedItem(date, to_num) {
  // Split the date into year, month, and day (we will only use the year)
  const [year] = date.split('-')

  // Format 'to_num' as a 4-digit number (with leading zeros if necessary)
  const formattedToNum = to_num.toString().padStart(4, '0')

  // Return formatted string in the format: 'YYYY-0001'
  return `${year}-${formattedToNum}`
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

// Define methods as const functions inside `setup()`
    const isInitialNull = (item) => ItemIndicators.isInitialNull(item);
    const isInitialized = (item) => ItemIndicators.isInitialized(item);
    const initializedByRD = (item) => ItemIndicators.initializedByRD(item);
    const initializedByDC = (item) => ItemIndicators.initializedByDC(item);
    const isNoteNull = (item) => ItemIndicators.isNoteNull(item);
    const isNoted = (item) => ItemIndicators.isNoted(item);
    const forRecommendationNoneORDNoneChief = (item) =>
      ItemIndicators.forRecommendationNoneORDNoneChief(item);
    const forRecommendationORDandChiefwithIntervals = (item) =>
      ItemIndicators.forRecommendationORDandChiefwithIntervals(item);
    const forRecommendationCAOnotIncluded = (item) =>
      ItemIndicators.forRecommendationCAOnotIncluded(item);
    const forRecommendationbyRED = (item) =>
      ItemIndicators.forRecommendationbyRED(item);
    const forRecommendationToSCbyCAO = (item) =>
      ItemIndicators.forRecommendationToSCbyCAO(item);
    const recommendedNoneORDNoneChief = (item) =>
      ItemIndicators.recommendedNoneORDNoneChief(item);
    const recommendedORDandChiefwithIntervals = (item) =>
      ItemIndicators.recommendedORDandChiefwithIntervals(item);
    const recommendedbyRED = (item) => ItemIndicators.recommendedbyRED(item);
    const recommendedbyCAO = (item) => ItemIndicators.recommendedbyCAO(item);
    const forApproval = (item) => ItemIndicators.forApproval(item);
    const forApprovalORDandChief = (item) =>
      ItemIndicators.forApprovalORDandChief(item);
    const forApprovalRDinterval = (item) =>
      ItemIndicators.forApprovalRDinterval(item);
    const forApprovalCAO = (item) => ItemIndicators.forApprovalCAO(item);
    const forApprovalbyRED = (item) => ItemIndicators.forApprovalbyRED(item);
    const forApprovalbyBD = (item) => ItemIndicators.forApprovalbyBD(item);
    const approved = (item) => ItemIndicators.approved(item);
    const approvedORD = (item) => ItemIndicators.approvedORD(item);

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
    fetchNames();
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

.feed-status-row {
  display: flex;
  justify-content: space-evenly; /* Distribute items evenly across the width */
  align-items: center;
  gap: 0.5rem; /* Adjust the gap between items */
  margin-top: 0.5rem;
  flex-wrap: nowrap; /* Prevent wrapping */
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: center; /* Center text and icons */
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  white-space: nowrap;
  flex: 1; /* Allow items to take equal space */
  text-align: center; /* Center text inside */
  max-width: 0; /* Prevent flex items from exceeding the container width */
}

/* Positive statuses (approved, noted, recommended, etc.) */
.status-approved,
.status-approved-note,
.status-approved-recommendation,
.status-approved-approval {
  background-color: #ffffff; /* light green */
  color: #2f8f46; /* green text */
}

.status-approved::before {
  content: "✅"; /* Checkmark icon */
  margin-right: 8px; /* Space between icon and text */
}

.status-approved-note::before {
  content: "✅"; /* Checkmark icon */
  margin-right: 8px; /* Space between icon and text */
}

.status-approved-recommendation::before {
  content: "✅"; /* Checkmark icon */
  margin-right: 8px; /* Space between icon and text */
}

.status-approved-approval::before {
  content: "✅"; /* Checkmark icon */
  margin-right: 8px; /* Space between icon and text */
}

/* Pending/To be statuses */
.status-pending,
.status-pending-note,
.status-pending-recommendation,
.status-pending-approval {
  background-color: #ffffff; /* light yellow */
  color: #ff0000; /* red text */
}

.status-pending::before {
  content: "⏳"; /* Hourglass icon */
  margin-right: 8px; /* Space between icon and text */
}

.status-pending-note::before {
  content: "⏳"; /* Hourglass icon */
  margin-right: 8px; /* Space between icon and text */
}

.status-pending-recommendation::before {
  content: "⏳"; /* Hourglass icon */
  margin-right: 8px; /* Space between icon and text */
}

.status-pending-approval::before {
  content: "⏳"; /* Hourglass icon */
  margin-right: 8px; /* Space between icon and text */
}


@media print{
  .global-feed-container{
    display: none;
  }
}
  </style>
  