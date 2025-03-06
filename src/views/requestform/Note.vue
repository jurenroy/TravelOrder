<template>
  <div class="note-popup">
    <div class="popup-content">
      <h3>{{ note ? "Edit Note" : "Add Note" }}</h3>
      <textarea
        v-model="note"
        placeholder="Write your note here..."
        rows="4"
        :disabled="!isAdmin"
      >
      </textarea>
      <div class="popup-buttons">
        <button v-if="isAdmin" @click="saveNote">Save</button>
      </div>
        <button class="close-button" @click="$emit('close-note')">&times;</button>
      
    </div>
  </div>
</template>

<script>
export default {
  props: ["initialNote", "isAdmin"],
  data() {
    return {
      note: this.initialNote || "",
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
      this.note = newVal;
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
  background: #2d2d2d;
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
  width: 90%;
  max-width: 400px;
}

.popup-content {
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
}

textarea {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #555;
  background: #1e1e1e;
  color: #fff;
  resize: none;
  outline: none;
  transition: border 0.3s;
}

textarea:focus {
  border-color: #ff9800;
}

.popup-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.popup-buttons button {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background-color: transparent;
  border: 2px solid #ff9800;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  color: #ff9800;
  border-radius: 6px;
  transition: all 0.3s ease-in-out;
}

.popup-buttons button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #ff9800, #ffb74d);
  transition: left 0.3s ease-in-out;
  z-index: -1;
}

.popup-buttons button:hover::before {
  left: 0;
}

.popup-buttons button:hover {
  color: #fff;
  border-color: #ffb74d;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 50px;
  color: #ff9800;
  cursor: pointer;
}

.close-button:hover {
  color: #ffb74d;
}
</style>
