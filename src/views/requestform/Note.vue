<template>
    <div class="note-popup">
      <div class="popup-content">
        <h3>{{ note ? "Edit Note" : "Add Note" }}</h3>
        <textarea v-model="note" placeholder="Write your note here..." rows="4"></textarea>
        <div class="popup-buttons">
          <button @click="saveNote">Save</button>
          <button @click="$emit('close-note')">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ["initialNote"],
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
    .note-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(126, 71, 9, 0.856);
      padding: 60px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgb(218, 131, 0);
      z-index: 1000;
      text-align: center;
    }
    
    .popup-content {
      color: #f0eaea;
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
    
    .popup-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      gap: 10px;
    }
    
    .popup-buttons button {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      background-color: transparent;
      border: 2px solid black;
      padding: 10px 20px;
      font-size: 16px;
      transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out;
    }
    
    .popup-buttons button::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background-color: rgba(162, 123, 92, 0.856);
      transition: left 0.3s ease-in-out;
      z-index: -1;
    }
    
    .popup-buttons button:hover::before {
      left: 0;
    }
    
    .popup-buttons button:hover {
      color: white;
      border-color: rgba(162, 123, 92, 0.856);
    }
    </style>