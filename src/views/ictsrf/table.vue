<template>
    <div class="luxury-title">    
      <select v-model="selectedStatus" style="margin-bottom: -0px;">
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="disapproved">Disapproved</option>
        <option value="approved">Approved</option>
        <option value="ongoing">On-going</option>
        <option value="done">Done</option>
      </select>

      <select v-model="typeOfService" style="margin-bottom: -0px;">
        <option value="all">All</option>
        <option v-for="type in serviceTypes" :key="type" :value="type">{{ type }}</option>
      </select>

      <!-- <select v-model="numberOfRows">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="200">200</option>
        <option value="500">500</option>
      </select> -->
    </div>
  
          <div class="outer">
      <div class="scrollable-table"  @scroll.passive="handleScroll" ref="scrollContainer">
          <!-- Status Filter -->
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
              <tr v-for="service in services" :key="service.id">
                <td>{{ service.serviceRequestNo }}</td>
                <td>{{ formatDate(service.date) }}</td>
                <td>{{ getName(service.requestedBy) }}</td>
                <td style="width: fit-content;">{{ service.typeOfService }}, <br>{{ service.note }}</td>
                <td>{{ service.remarks ? service.remarks : 'Pending' }} {{ service.approvedBy || service.remarks == 'Disapproved'? '' : '(Not yet Approved)' }}</td>
                <td>
                  <div class="feedback">
                    <p>{{ service.feedback_filled == 0 ? 'Not yet' : 'Done' }} </p>
                    <button class="action-button2" @click="openFeedback(service.id)" v-if="service.id !== feedbackView && service.feedback_filled == 0">Feedback</button> 
                    <button class="action-button2" @click="cancelFeedback()" v-if="service.id == feedbackView && service.feedback_filled == 0">Cancel Feedback</button>
                    <!-- <button class="action-button" @click="viewFeedback(service.id)" v-if="service.id !== selectedFeedbackView && service.feedback_filled == 1">View</button>
                    <button class="action-button" @click="closeFeedback()" v-if="service.id == selectedFeedbackView && service.feedback_filled == 1">Close Feeback</button> -->
                  </div>
                  
                </td>
                <td class="actions">
                  <button class="action-button" @click="openNote(service.id)" v-if="admin.includes(parseInt(nameId)) && notenum !== service.id && !service.ictnote">Add note</button>
                  <button class="action-button" @click="viewNotez(service.ictnote, service.id)" v-if="admin.includes(parseInt(nameId)) && service.ictnote && notenum !== service.id">View note</button>
                  <button class="action-button" @click="closeNote()" v-if="admin.includes(parseInt(nameId)) && notenum == service.id">Close {{ viewNote ? 'view': '' }} note</button>

                  <button class="action-button" @click="editService(service)" v-if="admin.includes(parseInt(nameId))">Edit </button>
                  <!-- <button class="action-button" @click="deleteService(service.id)" v-if="admin.includes(parseInt(nameId))">Delete</button> -->
                  <button class="action-button" @click="approveService(service.id)" v-if="nameId == 66 && service.approvedBy == null">Approve</button>
                  <button class="action-button" @click="disapproveService(service.id)" v-if="nameId == 66 && service.approvedBy == null && service.remarks !== 'Disapproved'">Dissapprove</button>
                  <button class="action-button" @click="viewService(service.id, service.feedback_filled)" v-if="service.id !== selectedview">View</button>
                  <button class="action-button" @click="closeView()" v-if="service.id == selectedview">Close View</button>
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
          <button class="action-button2" @click="updateService">Update</button>
          <button class="action-button2" @click="editPopupVisible = false">Cancel</button>
        </div>
      </div>
    
    <div class="popup-overlay" v-if="isPopupVisible">
      <div class="popup">
        <h2>{{ confirmationMessage }}</h2>
        <div class="button-group">
          <button class="action-button2" @click="handleConfirm">Yes</button>
          <button class="action-button2" @click="handleCancel">No</button>
        </div>
      </div>
    </div>

    <div class="note-modal" v-if="addNote">
      <div class="note-header">
        <span class="note-title">Add Note</span>
        <div class="close-btn" @click="closeNote">×</div>
      </div>

      <div class="note-body">
        <textarea v-model="noteText" rows="4" placeholder="Enter your note here..." class="notetextarea"></textarea>
        <div class="note-footer">
          <button class="save-btn" @click="postNote">Save</button>
          <button class="cancel-btn" @click="closeNote">Cancel</button>
        </div>
      </div>
    </div>

    <div class="note-modal" v-if="viewNote">
      <div class="note-header">
        <span class="note-title">View Note</span>
        <div class="close-btn" @click="closeNote">×</div>
      </div>

      <div class="note-body">
        <textarea v-model="noteText" rows="4" :readonly="!(admin.includes(parseInt(nameId)))" class="notetextarea"></textarea>
        <div class="note-footer">
          <button class="save-btn" @click="postNote" v-if="admin.includes(parseInt(nameId))">Save</button>
          <button class="cancel-btn" @click="closeNote">Close</button>
        </div>
      </div>
    </div>


    <feedback :id="feedbackView" v-if="feedbackView !== 0" @cancelled="handleCancellation"/>

    <div class="formview">
    <ICTSRFview :id="selectedview" v-if="selectedview !== 0"/>
    <ICTSFFview :id="selectedFeedbackView" v-if="selectedFeedbackView !== 0"/>
  </div>
  </template>
  
    
    <script setup>
    import { ref, onMounted, computed} from 'vue';
    import axios from 'axios';
    import ICTSRFview from './ICTSRFview.vue';
    import ICTSFFview from './ICTSFFview.vue';
    import feedback from './feedbackform.vue'
    import { API_BASE_URL } from '@/config';
    import { useAuthStore } from '@/store/auth';
    import { watch } from 'vue';
    
    const authStore = useAuthStore()
    const services = ref([]);
    const feedbacks = ref([]);
    const selectedStatus = ref('all');
    const typeOfService = ref('all');
    const numberOfRows = ref(10);
    const editPopupVisible = ref(false);
    const selectedServiceBy = ref('53'); // Default selection
    const selectedStatusForEdit = ref('');
    const serviceToEdit = ref(null); // To keep track of the service being edited
    const admin = ref([53,76,77])
    const nameId = authStore.name_id
    const serviceTypes = [
    'Existing system unit',
    'Existing network connection',
    'Existing ICT equipment',
    'Uploading of data in website',
    'Others, please specify'
  ];

    const selectedview = ref(0)
    const feedbackView = ref(0)
    const selectedFeedbackView = ref(0)

    const addNote = ref(false)
    const viewNote = ref(false)
    const notenum = ref(0)
    const noteText = ref('')

    const handleCancellation = (id) => {
    console.log('Cancel clicked, ID set to:', id);
    feedbackView.value = id
  }
    
    const fetchServices = async (reset = false) => {
      try {
        if (reset) {
      services.value = []; // Clear the array only when status changes
    }

        const response = await axios.get(`${API_BASE_URL}/services/${nameId}/${selectedStatus.value}/${typeOfService.value}/${numberOfRows.value}/${services.value.length}`);
      console.log(response.data)
        // services.value = response.data.sort((a, b) => b.id - a.id);
        // services.value = [...services.value , ...response.data.sort((a, b) => b.id - a.id) ]
        const newData = response.data.sort((a, b) => b.id - a.id);
        const existingIds = new Set(services.value.map(item => item.id));
        const uniqueData = newData.filter(item => !existingIds.has(item.id));

        services.value = [...services.value, ...uniqueData];

      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    // Watch for changes in selectedStatus, typeOfService, and numberOfRows
    watch([selectedStatus, typeOfService, numberOfRows], () => {
  // When selectedStatus or typeOfService changes, reset the services and fetch again
  fetchServices(true); // True means reset
}, { immediate: true });

    
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/feedbacks/`);
        feedbacks.value = response.data;
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };


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
        await axios.post(`${API_BASE_URL}/services/update/${serviceToEdit.value.id}`, {
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

    const viewNotez = (nutz, numx) => {
      viewNote.value = true
      noteText.value = nutz
      notenum.value = numx
    };
    const openNote = (numz) => {
      addNote.value = true,
      notenum.value = numz
      noteText.value = ""
    };
    const closeNote = () => {
      addNote.value = false,
      viewNote.value = false,
      notenum.value = 0
    };
    const postNote = () => {
      const formData = new FormData();
        formData.append('ictnote', noteText.value)
      axios.post(`${API_BASE_URL}/services/update/${notenum.value}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        fetchServices();
      }).catch(error => {
        console.error('Error:', error);
      });
      closeNote()
    };
  
    const names = ref([]);
  
    const fetchNames = async () => {
    try {
      const namesResponse = await axios.get(`${API_BASE_URL}/get_names_json`);
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

  const scrollContainer = ref(null);

  const handleScroll = () => {
        const container = scrollContainer.value;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
          console.log("scroll")
          // Near bottom, load more
          fetchServices()
        }
      }
    
    // Fetch data when component is mounted
    onMounted(() => {
      fetchServices();
      fetchFeedbacks();
      fetchNames();
    });

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
        await axios.post(`${API_BASE_URL}/services/update/${selectedServiceId.value}`, {
          approvedBy: nameId,
        });
      } else {
        await axios.post(`${API_BASE_URL}/services/update/${selectedServiceId.value}`, {
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
    
    const viewService = (id,ballyan) => {
      console.log('View service:', id);
      // router.push(`/ictsrfv/${id}`); // Navigate to service view
    //window.open(`/ictsrfv/${id}`, '_blank'); // Open in a new tab
     selectedview.value = id
      if (ballyan == 1) {
       viewFeedback(id)
      }
    };
    // Function to close the view (optional since toggle handles this)
    const closeView = () => {
      selectedview.value = 0;
      closeFeedback()
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
    .scrollable-table{
      overflow-y: auto;
      overflow-x: auto;
      display: flex;
      flex-grow: 1;
    }
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
    background: linear-gradient(150deg, #DDC7AD, #92785b);
    border: 2px solid #000000;
    border-radius: 12px;
    padding: 10px 20px;
    font-size: 16px;
    font-family: 'Roboto', sans-serif;
    color: #333;
    transition: background-color 0.3s ease, border 0.3s ease;
    margin-left: 20px;
    font-weight: bolder;
  }
  option {
    background-color: #DDC7AD;
    color: black;
    font-weight: bolder;
  }
  option:hover {
  background-color: #ff0000;  /* Adjust the color for hover effect */
  color: #ff0000; /* Change text color on hover */
}
option:checked{
    background-color: #92785b;
  }
  select:hover {
    background-color: #8e8e8e !important;  /* Force hover effect */
    color: #fff !important;  /* Change text color on hover */
  }

  .luxury-title {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap; /* allows wrapping on smaller screens */
}

.luxury-title select {
  flex: 1;
  min-width: 150px;
  padding: 0.5rem;
  font-size: 1rem;
  max-width: 100%;
}

/* Stack selects vertically on small screens */
@media (max-width: 768px) {
  .luxury-title {
    flex-direction: column;
    align-items: stretch;
  }

  .luxury-title select {
    width: 95%;
  }
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
    height: max-content;
  }
  
  .action-button {
    border-radius: 10px;
    background-color: #000000;
    border: solid rgb(255, 255, 255) 2px;
    padding: 10px 20px;
    color: rgb(255, 255, 255);
    cursor: pointer;
    transition: background 0.3s;
    margin: 0 5px;
    height: fit-content;
    
  }
  .action-button2 {
    border-radius: 10px;
    background-color: #000;
    padding: 10px 20px;
    color: rgb(255, 255, 255);
    cursor: pointer;
    transition: background 0.3s;
    margin: 0 5px;
    height: fit-content;
    padding: 10px;
  }
  
  .action-button:hover {
    background-color: #696969;
  }
  
  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(150deg, #DDC7AD, #92785b);
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
    color: #000000; /* Accent color for the title */
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
    background: linear-gradient(150deg, #a1834a, #b8860b); /* Gradient from light gold to dark gold */
    border: solid black 2px;
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
    background-color: #000;
    border-radius: 8px;
    color: white;
    font-size: 20px;
    font-weight: bolder;
    border: solid black 2px;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    height: fit-content;
  }
  .button-group .action-button:hover {
    padding: 18px 40px;
    font-size: 15px;
    font-weight: 700;
    background-color: #000000;
    color: rgb(255, 255, 255);
    border: solid black 2px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 10px 30px rgba(243, 156, 18, 0.3);
    font-family: 'Playfair Display', serif;
  }
  button:hover {
    background-color: #6d6c6c;
    transform: translateY(-3px);
  }
  .status-filter{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 30px;
  }
  .status-filter select{
    height: 50px;
  }

  .note-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 400px;
    background: linear-gradient(150deg, #a1834a, #b8860b); /* Gradient from light gold to dark gold */
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    padding: 20px;
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.3s ease-out;
    border: solid black 2px;
  }

  .note-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-size: 20px;
    color: #000000;
  }

  .note-title {
    font-size: 24px;
    font-weight: bold;
    color: #000000; /* Elegant gold */
  }

  .close-btn {
    font-size: 50px;
    cursor: pointer;
    color: #000000;
    border-radius: 20px;
    padding: 10px 20px;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .close-btn:hover {
    opacity: 1;
  }

  .note-body {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .notetextarea {
    width: 100%;
    border: none;
    padding: 15px;
    border-radius: 10px;
    background-color: #404040;
    color: #fff;
    font-size: 16px;
    resize: none;
    box-sizing: border-box;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .notetextarea:focus {
    outline: none;
    box-shadow: inset 0 2px 10px rgba(255, 215, 0, 0.5); /* Gold focus */
  }

  .note-options {
    display: flex;
    justify-content: space-evenly;
  }

  .option-btn {
    background-color: transparent;
    color: #000000;
    border: 1px solid #000000;
    padding: 8px 15px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }

  .option-btn:hover {
    background-color: #000000;
    color: #ffffff;
  }

  .note-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  .save-btn, .cancel-btn {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .save-btn {
    background-color: #000000;
    color: #ffffff;
    border: none;
  }

  .save-btn:hover {
    transform: scale(1.05);
    background-color: #2e2e2e;
    color: #ffffff;
  }

  .cancel-btn {
    background-color: transparent;
    color: #fff;
    border: 2px solid #000000;
  }

  .cancel-btn:hover {
    background-color: #000000;
    color: #ffffff;
    transform: scale(1.05);
  }

  /* Animations */
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
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

    @media print{
      .outer, .status-filter{
        display: none;
      }
      .formview{
        margin-left: -15%;
        width: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-self: center;
      }
      .formelements{
        margin-top: -10px;
      }

    }
    </style>
    