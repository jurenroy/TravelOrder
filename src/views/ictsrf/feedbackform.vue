<template>
  <div class="feedback-container" :style="{marginTop: serviceRequests.length < '20%' ? '50%' : (!isFeedbackEnabled ? '10%' : '5%')}">
    <h1 style="margin-top: -10px; margin-bottom: 10px;">ICT Service Feedback Form</h1>
    <form @submit.prevent="handleSubmit">
      <div >
        <label>Requested by: {{ getName(requesters.requestedBy) }}</label>
        <label>{{ requesters.typeOfService }} - {{ formatDate(requesters.date) }}</label>
      </div>
      <div v-if="isFeedbackEnabled">
        <div class="feedback-group" v-for="(statement, index) in statements" :key="index">
          <label>{{ statement }}</label>
          <div class="checkbox-group">
            <label>
              <input type="radio" v-model="responses[index]" value="4" />
              <span class="choice-label">Very Satisfied</span>
            </label>
            <label>
              <input type="radio" v-model="responses[index]" value="3" />
              <span class="choice-label">Satisfied</span>
            </label>
            <label>
              <input type="radio" v-model="responses[index]" value="2" />
              <span class="choice-label">Dissatisfied</span>
            </label>
            <label>
              <input type="radio" v-model="responses[index]" value="1" />
              <span class="choice-label">Very Dissatisfied</span>
            </label>
          </div>
        </div>
      </div>

      <div style="display: flex; flex-direction: row;">
      <button class="feedbackbutton" type="button" @click="handleCancel">Cancel</button>
      <button class="feedbackbutton" type="submit" :disabled="!isFeedbackEnabled">Submit Feedback</button>
      </div>

      <div v-if="showErrorModal" class="modal">
        <div class="modal-content">
          <p>Please complete all feedback questions before submitting.</p>
          <button class="modal-button" @click="showErrorModal = false">Okay</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';

// Define props
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(); // Add this line
const handleCancel = () => {
  emit('cancelled', 0); // Emit the ID as 0
  // Reset form fields if necessary
  responses.value = (Array(statements.value.length).fill(null))
};

// Watch for changes in the id prop
watch(() => props.id, (newId) => {
  fetchRequesters(newId); // Fetch new service details
});

const requesters = ref([]);
const serviceRequests = ref([]);
const selectedName = ref('');
const selectedServiceRequest = ref('');
const isFeedbackEnabled = ref(true);
const statements = ref([
  'Response time to your call for service',
  'Quality of service provided to resolve the problem',
  'Courtesy and Professionalism of the attending ICT staff',
  'Overall satisfaction with the assistance / service provided'
]);
const responses = ref(Array(statements.value.length).fill(null));
const showErrorModal = ref(false);

const fetchRequesters = async (reference) => {
  try {
    console.log(props.id)
    const response = await axios.get(`http://202.137.117.84:8011/services/${reference}`);
    requesters.value = response.data
    selectedServiceRequest.value = requesters.value.id
    responses.value = (Array(statements.value.length).fill(null))
  } catch (error) {
    console.error('Error fetching requesters:', error);
  }
};

const names = ref([]);
const fetchNames = async () => {
  try {
    const response = await axios.get('http://202.137.117.84:8011/get_names_json');
    names.value = response.data
      .map(person => ({
        ...person,
        last_name: person.last_name.toUpperCase(),
        first_name: person.first_name.toUpperCase(),
        middle_init: person.middle_init.toUpperCase() || ''
      }))
      .sort((a, b) => a.last_name.localeCompare(b.last_name));
  } catch (error) {
    console.error('Error fetching names:', error);
  }
};

const getName = (nameId) => {
  const name = names.value.find(name => name.name_id === nameId);
  return name ? `${name.first_name} ${name.middle_init} ${name.last_name}` : 'Invalid Person';
};

const enableFeedback = () => {
  isFeedbackEnabled.value = true;
  responses.value = Array(statements.value.length).fill(null);
};

const handleSubmit = async () => {
  if (responses.value.includes(null)) {
    showErrorModal.value = true;
    return;
  }

  const feedbackData = {
    referenceid: selectedServiceRequest.value,
    evaluation1: responses.value[0],
    evaluation2: responses.value[1],
    evaluation3: responses.value[2],
    evaluation4: responses.value[3],
  };

  try {
    const response = await axios.post('http://202.137.117.84:8011/feedbacks', feedbackData);
    console.log('Feedback submitted successfully:', response.data);
    resetForm();
    alert('Feedback submitted successfully!');
  } catch (error) {
    console.error('Error submitting feedback:', error);
    alert('There was an error submitting your feedback. Please try again.');
  }
};

const resetForm = () => {
  selectedName.value = '';
  selectedServiceRequest.value = '';
  handleCancel()
  isFeedbackEnabled.value = false;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

onMounted(() => {
  fetchNames();
  fetchRequesters(props.id);
});
</script>

<style scoped>
.feedback-container {
  background: linear-gradient(30deg, #DDC7AD, #92785b);
  border-radius: 15px;
  padding: 20px;
  width: 90%;
  max-width: 1000px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid #000000;
  font-family: 'Roboto', sans-serif;
  top: 40%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Adjust for the element's size */
  z-index: 1000; /* Ensure it's on top of other content */
  position: absolute;

}

h1 {
  font-family: 'Playfair Display', serif;
  color: #000000;
  margin-bottom: 1.5em;
  font-size: 2.5em;
  font-weight: 700;
}

.feedback-group {
  margin-bottom: 2em;
}

label {
  font-size: 1.1em;
  color: #000000;
  margin-bottom: 0.5em;
  display: block;
  font-weight: 600;
}

.checkbox-group {
  display: flex;
  justify-content: center;
  gap: 1.5em;
  align-items: center;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  font-size: 1.1em;
}

input[type="radio"] {
  accent-color: #000000;
  width: 1.5em;
  height: 1.5em;
}

.choice-label {
  margin-left: 0.5em;
  white-space: nowrap;
}

button {
  padding: 0.75em 2em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 2em;
  width: 90%;
  max-width: 500px;
  text-align: center;
}

.modal-button {
  padding: 0.75em 2em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1em;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.modal-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

select {
  padding: 0.75em;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 1em;
  width: 100%;
}

.feedbackbutton {
  display: block;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Media query for mobile devices */
@media (max-width: 768px) {
  .feedback-container {
    padding: 1em;
    width: 92%;
    margin: 0;
    top: 52%;
  }

  h1 {
    font-size: 1.5em;
  }

  .feedback-group {
    margin-bottom: 0em;
  }

  .checkbox-group {
    flex-direction: column; 
    align-items: flex-start; 
    gap: 0.5em; 
  }

  .checkbox-group label {
    font-size: 1em; 
  }

  input[type="radio"] {
    width: 1.2em;
    height: 1.2em;
  }

  .choice-label {
    margin-left: 0.1em; 
  }

  button {
    padding: 0.5em 1.5em;
    font-size: 1em;
  }
}
</style>
