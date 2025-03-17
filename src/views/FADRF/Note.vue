<template>
  <div class="note-popup">
    <div class="popup-content">
      <!-- Close button fix -->
      <button class="close-button" @click="$emit('close-note')">
        &times;
      </button>

      <h3>{{ isAdmin ? (note ? "Edit Note" : "Add Note") : "View Note" }}</h3>
      
      <textarea 
  v-model="note" 
  :placeholder="isAdmin ? 'Write your note here...' : (note ? note : 'No note yet')"
  rows="4"
  :disabled="!isAdmin">
</textarea>

      <div class="popup-buttons">
        <button v-if="isAdmin" @click="saveNote">
          <div class="svg-wrapper-1">
            <div class="svg-wrapper">
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="30"
                height="30"
                class="icon"
              >
                <path 
                  d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"
                ></path>
              </svg>
            </div>
          </div>
          <span>Save</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["initialNote", "isAdmin"],
  data() {
    return {
      note: this.initialNote || "", // Keep existing note
    };
  },
  methods: {
    saveNote() {
      if (this.note.trim() !== "") {
        this.$emit("save-note", this.note);
      } else {
        alert("Note cannot be empty.");
      }
    },
  },
  watch: {
    initialNote(newVal) {
      this.note = newVal; // Ensure the note updates correctly when reopened
    },
  },
};
</script>

<style scoped>
/* Fix Close Button */
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

/* Popup */
.note-popup {
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
  position: relative;
  background: #fffbf2;
  padding: 60px;
  border-radius: 5px;
  
  text-align: center;
  color: #333129;
  width: 80%;
  max-width: 500px;
}

h3 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: left; /* Align text to the left */
}

textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 20px;
  resize: none;
}

/* Center the button */
.popup-buttons {
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
  margin-top: 10px;
}

/* Save Button Styles */
/* Save Button Styles */
.popup-buttons button {
  font-family: inherit;
  font-size: 20px;
  background: linear-gradient(to bottom, #bfa16d, rgba(172, 145, 116, 0.849));
  color: black;
  fill: black;
  padding: 0.4em 0.3em;
  padding-left: 0.2em;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
}

/* Spacing for icon */
.popup-buttons button .svg-wrapper-1 {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  transition: transform 0.3s ease-in-out;
}

/* Text animation */
.popup-buttons button span {
  display: block;
  transition: all 0.1s ease-in-out;
}

/* SVG animation */
.popup-buttons button svg {
  display: block;
  transform-origin: center center;
  transition: transform 0.3s ease-in-out;
}

/* Hover Effects */
.popup-buttons button:hover {
  background: linear-gradient(to bottom, rgba(172, 145, 116, 0.849, #bfa16d));
}

.popup-buttons button:hover .svg-wrapper-1 {
  transform: scale(1.25);
  transition: 0.5s linear;
}

.popup-buttons button:hover svg {
  transform: translateX(1.2em) scale(1.1);
  fill: black;
}

.popup-buttons button:hover span {
  opacity: 0;
  transition: 0.5s linear;
}

/* Click effect */
.popup-buttons button:active {
  transform: scale(0.95);
}
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #1a202c;
    --card-background: rgba(26, 32, 44, 0.8);
    --text-color: #f7fafc;
    --border-color: #2d3748;
  }
  
  
  .close-button:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  
}
</style>
