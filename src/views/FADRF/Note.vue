<template>
  <div class="note-popup">
    <div class="popup-content">
       <button class="close-button" @click="$emit('close-note')">&times;</button>
      <h3>{{ note ? "Edit Note" : "Add Note" }}</h3>
      <textarea v-model="note" placeholder="Write your note here..."
       rows="4">
       :disabled="!isAdmin">
      </textarea>
      <div class="popup-buttons">
        <button v-if="isAdmin"  
          @click="saveNote">
          Save
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
  background: linear-gradient(145deg, #fff8f0, #e6d5c3);
  padding: 60px;
  border-radius: 8px;
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.7);
  text-align: center;
  color: #333129;
  width: 80%;
  max-width: 500px;
}

h3 {
  font-size: 24px;
  margin-bottom: 20px;
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
  justify-content: center;
  margin-top: 10px;
}

.popup-buttons button {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background-color: white;
  border: 2px solid black;
  padding: 10px 20px;
  border-radius: 16px;
  font-size: 16px;
  transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out;
}

.popup-buttons button:hover {
  transform: scale(1.1);
  background-color: rgba(109, 107, 107, 0.712);
}

.popup-buttons button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background-color: rgba(141, 71, 14, 0.856);
  transition: left 0.3s ease-in-out;
  z-index: -1;
}

.popup-buttons button:hover {
  color: rgb(0, 0, 0);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 50px;
  color: #ff9800;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  margin: 0;
}

.close-button:hover {
  color: #ffb74d;
}
</style>