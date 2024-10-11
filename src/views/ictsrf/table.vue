<template>
      <!-- <div class="radio-input" v-if="admin.includes(parseInt(nameId))">
        <label>
          <input value="services" v-model="selectedView" type="radio" />
          <span>Manage Services</span>
        </label>
        <label>
          <input value="feedback" v-model="selectedView" type="radio" />
          <span>Manage Feedback</span>
        </label>
        <span class="selection"></span>
      </div> -->
      
  
      <div class="scrollable-table">
        <div class="services-section" v-if="selectedView === 'services'">
          <!-- Status Filter -->
          <div class="status-filter">
            <label>Status:</label>
            <select v-model="selectedStatus">
              <option value="all">All</option>
              <option value="">Pending</option>
              <option value="disapproved">Disapproved</option>
              <option value="approved">Approved</option>
              <option value="ongoing">On-going</option>
              <option value="done">Done</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>Request No</th>
                <th>Date</th>
                <th>Requested By</th>
                <th>Type of Service</th>
                <th>Status</th>
                <th>Has feedback?</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in filteredServices" :key="service.id">
                <td>{{ service.serviceRequestNo }}</td>
                <td>{{ formatDate(service.date) }}</td>
                <td>{{ getName(service.requestedBy) }}</td>
                <td>{{ service.typeOfService }}</td>
                <td>{{ service.remarks ? service.remarks : 'Pending' }} {{ service.approvedBy || service.remarks == 'Disapproved'? '' : '(Not yet Approved)' }}</td>
                <td>
                  <div class="feedback">
                    <p>{{ service.feedback_filled == 0 ? 'Not yet' : 'Done' }} </p>
                    <button class="action-button" @click="openFeedback(service.id)" v-if="service.id !== feedbackView && service.feedback_filled == 0">Feedback</button> 
                    <button class="action-button" @click="cancelFeedback()" v-if="service.id == feedbackView && service.feedback_filled == 0">Cancel Feedback</button>
                    <button class="action-button" @click="viewFeedback(service.id)" v-if="service.id !== selectedFeedbackView && service.feedback_filled == 1">View</button>
                    <button class="action-button" @click="closeFeedback()" v-if="service.id == selectedFeedbackView && service.feedback_filled == 1">Close Feeback</button>
                  </div>
                  
                </td>
                <td class="actions">
                  <button class="action-button" @click="editService(service)" v-if="admin.includes(parseInt(nameId))">Edit </button>
                  <button class="action-button" @click="deleteService(service.id)" v-if="admin.includes(parseInt(nameId))">Delete</button>
                  <button class="action-button" @click="approveService(service.id)" v-if="nameId == 36 && service.approvedBy == null">Approve</button>
                  <button class="action-button" @click="disapproveService(service.id)" v-if="nameId == 36 && service.approvedBy == null && service.remarks !== 'Disapproved'">Dissapprove</button>
                  <button class="action-button" @click="viewService(service.id)" v-if="service.id !== selectedview">View</button>
                  <button class="action-button" @click="closeView()" v-if="service.id == selectedview">Close View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="feedback-section" v-if="selectedView === 'feedback'">
          <table>
            <thead>
              <tr>
                <th>Feedback ID</th>
                <th>Reference ID</th>
                <th>Date</th>
                <th>Evaluations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="feedback in feedbacks" :key="feedback.feedbackid">
                <td>{{ feedback.feedbackid }}</td>
                <td @mouseover="showPopup(feedback.referenceid)" @mouseleave="hidePopup">
                  {{ feedback.referenceid }}
                  <div v-if="popupVisible && currentReferenceId === feedback.referenceid" class="popup">
                    <h2>Service Request Details</h2>
                    <div class="popup-content">
                      <p><strong>Service Request No:</strong> {{ getServiceDetails(feedback.referenceid).serviceRequestNo }}</p>
                      <p><strong>Date:</strong> {{ getServiceDetails(feedback.referenceid).date }}</p>
                      <p><strong>Type of Service:</strong> {{ getServiceDetails(feedback.referenceid).typeOfService }}</p>
                      <p><strong>Note:</strong> {{ getServiceDetails(feedback.referenceid).note }}</p>
                      <p><strong>Requested by:</strong> {{ getName(getServiceDetails(feedback.referenceid).requestedBy) }}</p>
                      <p><strong>Email:</strong> {{ getServiceDetails(feedback.referenceid).email }}</p>
                    </div>
                  </div>
                </td>
                <td>{{ feedback.date }}</td>
                <td>{{ feedback.evaluation1 }}, {{ feedback.evaluation2 }}, {{ feedback.evaluation3 }}, {{ feedback.evaluation4 }}</td>
                <td class="actions">
                  <button class="action-button" @click="editFeedback(feedback.feedbackid)">Edit</button>
                  <button class="action-button" @click="deleteFeedback(feedback.feedbackid)">Delete</button>
                  <button class="action-button" @click="viewFeedback(feedback.feedbackid)">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Popup for editing service -->
      <div v-if="editPopupVisible" class="edit-popup">
        <h2>Edit Service</h2>
        <div class="form-group">
          <label class="left-label">Service By:</label>
          <select v-model="selectedServiceBy" class="right-select">
            <option value="53">{{ getName(53) }}</option>
            <option value="77">{{ getName(77) }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="left-label">Status:</label>
          <select v-model="selectedStatusForEdit" class="right-select">
            <option value="">Pending</option>
            <option value="On-going">On-going</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div class="button-group">
          <button class="action-button" @click="updateService">Update</button>
          <button class="action-button" @click="editPopupVisible = false">Cancel</button>
        </div>
      </div>
    
    <div class="popup-overlay" v-if="isPopupVisible">
      <div class="popup">
        <h2>{{ confirmationMessage }}</h2>
        <div class="button-group">
          <button class="action-button" @click="handleConfirm">Yes</button>
          <button class="action-button" @click="handleCancel">No</button>
        </div>
      </div>
    </div>

    <ICTSRFview :id="selectedview" v-if="selectedview !== 0"/>
    <feedback :id="feedbackView" v-if="feedbackView !== 0" @cancelled="handleCancellation"/>
    <ICTSFFview :id="selectedFeedbackView" v-if="selectedFeedbackView !== 0"/>
  </template>
  
    
    <script setup>
    import { ref, onMounted, computed} from 'vue';
    import axios from 'axios';
    import ICTSRFview from './ICTSRFview.vue';
    import ICTSFFview from './ICTSFFview.vue';
    import feedback from './feedbackform.vue'
    // import { useRouter } from 'vue-router';
    
    // const router = useRouter();
    const selectedView = ref('services');
    const services = ref([]);
    const feedbacks = ref([]);
    const selectedStatus = ref('all');
    const editPopupVisible = ref(false);
    const selectedServiceBy = ref('53'); // Default selection
    const selectedStatusForEdit = ref('');
    const serviceToEdit = ref(null); // To keep track of the service being edited
    const popupVisible = ref(false);
    const currentReferenceId = ref(null); // Add this line
    const admin = ref([53,76,77])
    const nameId = localStorage.getItem('nameId');

    const selectedview = ref(0)
    const feedbackView = ref(0)
    const selectedFeedbackView = ref(0)

    const handleCancellation = (id) => {
    console.log('Cancel clicked, ID set to:', id);
    feedbackView.value = id
  }
    
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://202.137.117.84:8011/services/');
        services.value = response.data;
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://202.137.117.84:8011/feedbacks/');
        feedbacks.value = response.data;
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };
    
  
  //   const filteredServices = computed(() => {
  //   return services.value.filter(service => {
  //     if (selectedStatus.value === 'all') return true;
  //     if (selectedStatus.value === '') return service.remarks === null; // blank
  //     if (selectedStatus.value === 'approved') return service.remarks === 'Approved';
  //     if (selectedStatus.value === 'disapproved') return service.remarks === 'Disapproved';
  //     if (selectedStatus.value === 'ongoing') return service.remarks === 'On-going';
  //     if (selectedStatus.value === 'done') return service.remarks === 'Done';
  //     return false;
  //   });
  // });

  const filteredServices = computed(() => {
  return services.value.filter(service => {
    // If the user is an admin, show all services
    if (admin.value.includes(parseInt(nameId))) {
      if (selectedStatus.value === 'all') return true;
      if (selectedStatus.value === '') return service.remarks === null; // blank
      if (selectedStatus.value === 'approved') return service.approvedBy !== null;
      if (selectedStatus.value === 'disapproved') return service.approvedBy == null && service.remarks == 'Disapproved';
      if (selectedStatus.value === 'ongoing') return service.remarks === 'On-going';
      if (selectedStatus.value === 'done') return service.remarks === 'Done';
    }

    // If `approvedBy` is null, show these services
    if (parseInt(nameId) == 36) {
      if (selectedStatus.value === 'all') return true;
      if (selectedStatus.value === '') return service.remarks === null; // blank
      if (selectedStatus.value === 'approved') return service.approvedBy !== null;
      if (selectedStatus.value === 'disapproved') return service.approvedBy == null && service.remarks == 'Disapproved';
      if (selectedStatus.value === 'ongoing') return service.remarks === 'On-going';
      if (selectedStatus.value === 'done') return service.remarks === 'Done';
    }

    // For users who are not admins, filter based on `requestedBy`
    if (service.requestedBy === parseInt(nameId)) {
      if (selectedStatus.value === 'all') return true;
      if (selectedStatus.value === '') return service.remarks === null; // blank
      if (selectedStatus.value === 'approved') return service.approvedBy !== null;
      if (selectedStatus.value === 'disapproved') return service.approvedBy == null && service.remarks == 'Disapproved';
      if (selectedStatus.value === 'ongoing') return service.remarks === 'On-going';
      if (selectedStatus.value === 'done') return service.remarks === 'Done';
      return false; // No specific status matched
    }

    return false; // Default case: service does not match any criteria
  });
});



    const showPopup = (referenceId) => {
      popupVisible.value = true;
      currentReferenceId.value = referenceId;
    }
    const hidePopup = () => {
      popupVisible.value = false;
      currentReferenceId.value = null;
    }
    const getServiceDetails = (referenceId) => {
      return services.value.find(service => service.id === referenceId) || {};
    }
  
    const editService = (service) => {
    serviceToEdit.value = service;
    selectedServiceBy.value = service.serviceBy || '53'; // Default to existing serviceBy if available
    selectedStatusForEdit.value = service.remarks || '';
    editPopupVisible.value = true;
  };
  
  const updateService = async () => {
    if (serviceToEdit.value) {
      const updatedStatus = selectedStatusForEdit.value ? selectedStatusForEdit.value.charAt(0).toUpperCase() + selectedStatusForEdit.value.slice(1) : null;
      const serviceBy = selectedServiceBy.value; // Get the selected servicedBy
      try {
        await axios.post(`http://202.137.117.84:8011/services/update/${serviceToEdit.value.id}`, {
          remarks: updatedStatus,
          servicedBy: serviceBy
        });
        // Refresh services after updating
        await fetchServices();
        editPopupVisible.value = false; // Close the popup after updating
      } catch (error) {
        console.error('Error updating service:', error);
      }
    }
  };
  
  const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
  
    const names = ref([]);
  
    const fetchNames = async () => {
    try {
      const namesResponse = await axios.get('http://202.137.117.84:8011/get_names_json');
      // names.value = namesResponse.data;
      // Process names: Sort by last name, format in uppercase
      names.value = namesResponse.data
        .map(person => ({
          ...person,
          last_name: person.last_name.toUpperCase(),
          first_name: person.first_name.toUpperCase(),
          middle_init: person.middle_init.toUpperCase() || ''
        }))
        .sort((a, b) => a.last_name.localeCompare(b.last_name));
  
    } catch (error) {
      console.error('Error fetching names and divisions:', error);
    }
  };
  
  // Get name by employee ID
  const getName = (nameId) => {
    const name = names.value.find(name => name.name_id === nameId);
    if (name) {
      return `${name.first_name} ${name.middle_init} ${name.last_name}`;
    }
    return 'Invalid Ferson';
  };
    
    // Fetch data when component is mounted
    onMounted(() => {
      fetchServices();
      fetchFeedbacks();
      fetchNames();
    });

    // const approveService = async (id) => {
    //   console.log('approve service:', id);
    //   try {
    //     await axios.post(`http://202.137.117.84:8011/services/update/${id}`, {
    //       approvedBy: nameId
    //     });
    //     // Refresh services after updating
    //     await fetchServices();
    //     editPopupVisible.value = false; // Close the popup after updating
    //   } catch (error) {
    //     console.error('Error updating service:', error);
    //   }
    // };

    // const disapproveService = async (id) => {
    //   console.log('disapprove service:', id);
    //   try {
    //     await axios.post(`http://202.137.117.84:8011/services/update/${id}`, {
    //       remarks: 'Disapproved'
    //     });
    //     // Refresh services after updating
    //     await fetchServices();
    //     editPopupVisible.value = false; // Close the popup after updating
    //   } catch (error) {
    //     console.error('Error updating service:', error);
    //   }
    // };
    const isPopupVisible = ref(false);
const confirmationMessage = ref('');
const selectedServiceId = ref(null);
const isApproving = ref(false);

const approveService = (id) => {
  confirmationMessage.value = "Are you sure you want to approve this service?";
  isPopupVisible.value = true;
  selectedServiceId.value = id;
  isApproving.value = true;
};

const disapproveService = (id) => {
  confirmationMessage.value = "Are you sure you want to disapprove this service?";
  isPopupVisible.value = true;
  selectedServiceId.value = id;
  isApproving.value = false;
};

const handleConfirm = async () => {
  if (selectedServiceId.value) {
    try {
      if (isApproving.value) {
        await axios.post(`http://202.137.117.84:8011/services/update/${selectedServiceId.value}`, {
          approvedBy: nameId,
        });
      } else {
        await axios.post(`http://202.137.117.84:8011/services/update/${selectedServiceId.value}`, {
          remarks: 'Disapproved',
        });
      }
      await fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      isPopupVisible.value = false;
      selectedServiceId.value = null; // Reset the selected service ID
    }
  }
};

const handleCancel = () => {
  isPopupVisible.value = false; // Close the popup
};
    
    const deleteService = (id) => {
      console.log('Delete service:', id);
      // Implement deleting logic here
    };
    
    const viewService = (id) => {
      console.log('View service:', id);
      // router.push(`/ictsrfv/${id}`); // Navigate to service view
    //   window.open(`/ictsrfv/${id}`, '_blank'); // Open in a new tab
     selectedview.value = id
    };
    // Function to close the view (optional since toggle handles this)
    const closeView = () => {
      selectedview.value = 0;
    };
    
    const editFeedback = (id) => {
      console.log('Edit feedback:', id);
      // Implement editing logic here
    };
    
    const deleteFeedback = (id) => {
      console.log('Delete feedback:', id);
      // Implement deleting logic here
    };

    const openFeedback = (id) => {
      console.log('View feedback:', id);
      // router.push(`/ictsffv/${id}`); // Navigate to feedback view
      // window.open(`/ictsffv/${id}`, '_blank'); // Open in a new tab
      feedbackView.value = id
    };

    const cancelFeedback = () => {
      feedbackView.value = 0
    }
    
    const viewFeedback = (id) => {
      console.log('View feedback:', id);
      // router.push(`/ictsffv/${id}`); // Navigate to feedback view
      // window.open(`/ictsffv/${id}`, '_blank'); // Open in a new tab
      selectedFeedbackView.value = id
    };
    
    const closeFeedback = () => {
      selectedFeedbackView.value = 0
    }
  
  
    </script>
    
    <style scoped>
    .admin-container {
    padding: 20px;
    font-family: 'Arial', sans-serif;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    min-height: 100vh;
    display: flex; 
    flex-direction: column; 
  }
    
  .title {
    text-align: center;
    font-size: 2em;
    color: #343a40;
    margin-bottom: 10px; 
    position: sticky; /* Sticky positioning */
    top: 0; /* Stick to the top of the viewport */
    background-color: #fff; 
    z-index: 10; 
    padding: 10px; 
  }
  select {
    padding: 0.75em;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 1em;
    width: auto;
  }
  
  .radio-input {
    position: relative; /* Make the radio input sticky */
    top: 0px; /* Adjust this value based on the height of the title */
    display: flex;
    align-items: center;
    border-radius: 10px;
    background-color: #fff;
    color: #000;
    width: 350px;
    overflow: hidden;
    border: 1px solid rgba(53, 52, 52, 0.226);
    justify-content: center; 
    z-index: 9; 
    padding: 10px; 
    align-self: center;
    margin: auto;
    margin-top: 20px;
  }
  
  .radio-input input {
    display: none;
  }
  
  .radio-input label {
    flex: 1; /* Flex grow to take equal space */
    padding: 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    font-weight: bold;
    font-size: 14px;
    transition: color 0.3s;
  }
  
  .selection {
    position: absolute;
    height: 100%;
    width: calc(100% / 2); /* Adjust based on number of options */
    z-index: 0;
    left: 0;
    top: 0;
    transition: 0.15s ease;
    background-color: rgb(11, 117, 223);
  }
  
  .radio-input label:has(input:checked) {
    color: #fff; /* Change text color of active label */
  }
  
  .radio-input label:has(input:checked) ~ .selection {
    display: inline-block; /* Show selection when checked */
  }
  
  .radio-input label:nth-child(1):has(input:checked) ~ .selection {
    transform: translateX(0); /* Move selection to first option */
  }
  
  .radio-input label:nth-child(2):has(input:checked) ~ .selection {
    transform: translateX(100%); /* Move selection to second option */
  }
    
  table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  position: sticky;
  top: -2px;
}

.scrollable-table {
  max-height: 630px;
  overflow-y: auto;
  margin: 15px;
}

.feedback{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.feedback button{
  width: 80px;
  height: auto;
}
  
  .actions {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
  }
  
  .action-button {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background 0.3s;
    margin: 0 5px;
    height: 30px;
  }
  
  .action-button:hover {
    background-color: #0056b3;
  }
  
  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff; /* Background color */
    border-radius: 12px; /* Rounded corners */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); /* Subtle shadow */
    padding: 20px; /* Padding for inner content */
    z-index: 1000; /* Ensure it sits above other content */
    width: 320px; /* Fixed width for the popup */
    max-width: 90%; /* Responsive width */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Modern font */
    color: #333; /* Text color */
  }
  
  .popup h2 {
    margin: 0 0 15px; /* Margin below the title */
    font-size: 20px; /* Title font size */
    color: #27b9c2; /* Accent color for the title */
    text-align: center; /* Center title */
  }
  
  .popup-content {
    display: flex;
    flex-direction: column; /* Stack content vertically */
  }
  
  .popup-content p {
    margin: 8px 0; /* Space between paragraphs */
    line-height: 1.5; /* Improved line height for readability */
  }
  
  .popup-content strong {
    color: #555; /* Darker color for labels */
  }
  
  .edit-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f8f9fa; /* Light background */
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    padding: 20px;
    z-index: 1000;
    width: 400px; /* Wider width for better spacing */
    max-width: 90%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
  }
  
  .form-group {
    display: flex;
    align-items: center;
    margin-bottom: 15px; /* Space between rows */
  }
  
  .left-label {
    flex: 1; /* Left label takes equal space */
    margin-right: 10px; /* Space between label and select */
  }
  
  .right-select {
    flex: 2; /* Right select takes more space */
    padding: 5px; /* Padding for better touch targets */
  }
  .button-group {
    display: flex;
    justify-content: space-between; /* Evenly space buttons */
    margin-top: 20px; /* Space above buttons */
  }
  
  .button-group .action-button {
    flex: 1; /* Make buttons take equal space */
    margin: 0 5px; /* Space between buttons */
  }
    
    @media (max-width: 600px) {
      .toggle-buttons {
        flex-direction: column;
      }
    
      .toggle {
        margin-bottom: 10px;
      }
    
      .action-button {
        width: 100%;
        margin-bottom: 5px;
      }
      .feedback{
        flex-direction: column;
      }
  
      .actions {
        flex-direction: column;
        display: flex;
        justify-content: center;
        height: 110px;
      }
      .admin-container{
        width: fit-content;
      }
      .edit-popup{
        top: 30%;
      }
    }
    </style>
    