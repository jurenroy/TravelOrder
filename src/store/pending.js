import { defineStore } from 'pinia';

export const usePendingStore = defineStore({
  id: 'pending',
  state: () => {
    const pendingCounts = localStorage.getItem('pendingCount');
    return {
      travelorder: 0,
      leaveform: 0,
      ictrequest: 0,
      ...pendingCounts ? JSON.parse(pendingCounts) : {},
    };
  },
  actions: {
    count(type, count) {
        if (type == 'travelorder'){
            this.travelorder = count; // Set account_id
        } else if (type == 'leaveform'){
          this.leaveform = count; // Set account_id
        } else if (type == 'ictrequest'){
          this.ictrequest = count; // Set account_id
        }
        this.saveToLocalStorage(); // Save to localStorage
        console.log('saved', type)
      },
    saveToLocalStorage() {
      localStorage.setItem('pendingCount', JSON.stringify({
        travelorder: this.travelorder,
        leaveform: this.leaveform,
        ictrequest: this.ictrequest,
      }));
    },
  },
});