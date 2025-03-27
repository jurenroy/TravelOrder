import { defineStore } from 'pinia';

export const useChatStore = defineStore({
  id: 'chat',
  state: () => {
    const showSide = localStorage.getItem('show');
    return {
      show: showSide ? JSON.parse(showSide).show : false, // Initialize from localStorage
    };
  },
  actions: {
    toggleShow() {
      this.show = !this.show; // Toggle the show state
      this.saveToLocalStorage(); // Save to localStorage
      console.log('saved', this.show);
    },
    saveToLocalStorage() {
      localStorage.setItem('show', JSON.stringify({ show: this.show })); // Save the current state
    },
  },
});