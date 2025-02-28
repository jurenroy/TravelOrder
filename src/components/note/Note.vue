<template>
  <div class="note-modal" v-if="isVisible">
    <div class="note-header">
      <span class="note-title">{{ isAdding ? 'Add Note' : 'View Note' }}</span>
      <div class="close-btn" @click="close">×</div>
    </div>

    <div class="note-body">
      <textarea
        v-model="localNoteText"
        rows="4"
        :readonly="!isEditable"
        placeholder="Enter your note here..."
        class="notetextarea"
      ></textarea>
      <div class="note-options" v-if="isAdding && isEditable">
        <button class="option-btn" @click="focusTextarea('Within WFP')">Within WFP</button>
        <button class="option-btn" @click="focusTextarea('Not within WFP')">Not within WFP</button>
      </div>
      <div class="note-footer">
        <button class="save-btn" v-if="isAdding || isEditable" @click="postNote">Save</button>
        <button class="cancel-btn" @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/store/auth'; // Adjust the import path as necessary
import { API_BASE_URL } from '@/config';

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    isAdding: {
      type: Boolean,
      default: false,
    },
    notenum: {
      type: Number,
      required: true,
    },
    noteText: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: true,
    },
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      localNoteText: '',
    };
  },
  watch: {
    notenum(newVal) {
      // When notenum changes, clear localNoteText and set it to noteText
      this.localNoteText = this.noteText; // Set to the noteText received from the parent
    },
    noteText(newVal) {
      // If noteText changes, update localNoteText
      this.localNoteText = newVal;
    },
  },
  computed: {
    isEditable() {
      // Check if the user can edit based on the type of note
      if (this.type === 'update_form') {
        return [76, 37, 23, 64,15,21,20,45,48].includes(this.authStore.name_id);
      } else if (this.type === 'services') {
        return [77, 53].includes(this.authStore.name_id);
      }
      return false; // Default to not editable for other types
    },
  },
  mounted() {
    this.localNoteText = this.noteText;
  },
  methods: {
    close() {
      this.$emit('close');
    },
    focusTextarea(text) {
    //this.noteText += text;
    const adminText1 = "KAYSHE JOY F. PELINGON: Not within WFP";
    const adminText2 = "KAYSHE JOY F. PELINGON: Within WFP";

    // Check if the noteText already contains either of the admin texts
    if (this.localNoteText.includes(adminText1) || this.localNoteText.includes(adminText2)) {
        // If it does, replace the existing text with the new text
        this.localNoteText = 'KAYSHE JOY F. PELINGON: ' + text;
    } else {
        // If it doesn't, append the new text
        this.localNoteText += text;
    }
    this.$refs.noteInput.focus();
  },
    postNote() {
      const formData = new FormData();

      // Append the appropriate field based on the type
      if (this.type === 'services') {
        formData.append('ictnote', this.localNoteText);
      } else if (this.type === 'update_form') {
        formData.append('note', this.localNoteText);
      }

      // Construct the API endpoint based on the type
      const apiUrl = `${API_BASE_URL}/${this.type}/${this.notenum}`;

      axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        this.$emit('notePosted', this.localNoteText); // Emit event to parent
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        this.close(); // Ensure the note modal closes after posting
      });
    },
  },
};
</script>
  
  <style scoped>
.note-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 400px;
    background: linear-gradient(150deg, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
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
  </style>