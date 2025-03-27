<template>
  <!-- <span>{{ pendingCount }}</span> -->
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import notificationSound from '@/assets/notification.mp3'; // Import the audio file

export default {
name: 'Notification',
data() {
  return {
    accountId: localStorage.getItem('accountId'),
    sectionChiefIds: [39, 2, 3, 8, 42, 34, 29, 36, 48, 5, 47],
    members: [
      [23, 25, 35, 70, 64],
      [30, 7, 26, 18, 67, 49, 24],
      [43, 40],
      [32, 50, 71],
      [33, 6],
      [41, 46, 1, 28],
      [38, 9, 65],
      [44, 22, 61, 27],
      [31, 11],
      [16, 63, 19],
      [12, 14, 72, 73]
    ],
    acc: [], // This will be populated with account data
    formData: [],
    bus: {}, // Assuming this will be set in your logic
    sub: {}, // Assuming this will be set in your logic
    fetchInterval: null, // To store the interval ID
  };
},
computed: {
  pendingCount() {
    return this.countPendingNotifications(this.formData, this.acc, this.sectionChiefIds, this.members);
  },
},
watch: {
pendingCount(newCount) {
  if (newCount > 0) {
    this.playSound();
  }
},
},
methods: {
  fetchAccounts() {
    axios.get(`${API_BASE_URL}/get_accounts_json`)
      .then(response => {
        this.acc = response.data.find(result => result.account_id == this.accountId);
        this.fetchData()
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  },
  fetchData() {
    fetch(`${API_BASE_URL}/get_forms_json`)
      .then(response => response.json())
      .then(data => {
        this.formData = data;
        // Set acc based on your logic
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  },
  countPendingNotifications(formData, acc, sectionChiefIds, members) {
    let pendingCount = 0;
    
    if (acc.type_id === 2 && !(sectionChiefIds.includes(acc.name_id)) && !(acc.name_id === 37)) {
      pendingCount += formData.filter(form => {
        return form.name_id === acc.name_id && form.signature2 === null;
      }).length;
    }

    else if (sectionChiefIds.includes(acc.name_id)) {
      
      const index = sectionChiefIds.indexOf(acc.name_id);
      const memberGroup = members[index];

      if (acc.name_id === 48 && this.bus.name_id === this.sub.name_id) {
        pendingCount += formData.filter(form => {
          return (
            (memberGroup.includes(form.name_id) && form.initial === null) ||
            (form.division_id === this.sub.division_id && form.intervals === 0 && form.note !== null && form.signature1 === null && form.name_id !== this.sub.name_id) ||
            (form.division_id !== 5 && form.note !== null && form.signature1 !== null && form.signature2 === null) ||
            (form.division_id === 5 && form.note !== null && form.signature2 === null)
          );
        }).length;
      } else if (acc.name_id === 48) {
        pendingCount += formData.filter(form => {
          return (
              (memberGroup.includes(form.name_id) && form.initial === null) ||
              (form.division_id === this.sub.division_id && form.initial === null && form.intervals === 1 && form.name_id !== this.sub.name_id)
              );
            }).length;
          } else {
            pendingCount += formData.filter(form => {
              return memberGroup.includes(form.name_id) && form.initial === null && form.intervals === 0;
          }).length;
        }
      } else if (acc.name_id === 37) {
      pendingCount += formData.filter(form => {
        return form.note === null && form.initial !== null;
      }).length;
    } else if (this.bus.name_id === this.sub.name_id) {
      if (acc.name_id !== 20) {
        pendingCount += formData.filter(form => {
          return (
            (form.division_id !== 5 && form.note !== null && form.signature1 !== null && form.signature2 === null) ||
            (form.division_id === 5 && form.note !== null && form.signature2 === null)
          );
        }).length;
      }else {
          pendingCount += formData.filter(form => {
            return (
              (form.division_id !== 5 && form.note !== null && form.signature1 !== null && form.signature2 === null) ||
              (form.division_id === 5 && form.note !== null && form.signature2 === null && form.name_id !== 20) || ([15,21,45,48].includes(form.name_id) && form.signature2 == null && form.name_id !== this.sub.name_id)
            );
          }).length;
        }
    } else if (acc.type_id === 3) {
          if (acc.name_id === 15) {
            pendingCount += formData.filter(form => {
              return (
                (form.note !== null && form.initial !== null && form.signature1 === null && form.intervals === 0 && form.division_id === this.sub.division_id && form.name_id !== this.sub.name_id) ||
                (form.division_id === this.sub.division_id && form.initial === null && form.name_id !== this.sub.name_id)
              );
            }).length;
          }else if (acc.name_id === 20) {
            pendingCount += formData.filter(form => {
              return (
                (form.division_id !== 5 && form.note !== null && form.signature1 !== null && form.signature2 == null) || (form.division_id === 5 && form.note !== null && form.signature2 == null && form.name_id !== this.sub.name_id) || ([15,21,45,48].includes(form.name_id) && form.initial == null && form.intervals == 1 && form.aor == 1 && form.name_id !== this.sub.name_id) || ([15,21,45,48].includes(form.name_id) && form.signature2 == null && form.name_id !== this.sub.name_id)
              );
            }).length;
          } else {
            pendingCount += formData.filter(form => {
              return (
                (form.note !== null && form.initial !== null && form.signature1 === null && form.intervals === 0 && form.division_id === this.sub.division_id && form.name_id !== this.sub.name_id) ||
                (form.division_id === this.sub.division_id && form.initial === null && form.name_id !== this.sub.name_id)
              );
            }).length;
          }
      } else if (acc.type_id === 2) {
      pendingCount += formData.filter(form => {
        return form.name_id === acc.name_id && form.signature2 === null;
      }).length;
    }
    return pendingCount;
  },
  playSound() {
    //if (!this.audio) {
    //  this.audio = new Audio(notificationSound); // Use the imported audio file
    //}
    //if (this.pendingCount > 0){
    //this.audio.play().catch(error => {
    //      console.error('Error playing sound:', error);
    //    });
    //}
    
  },
},
mounted() {
  this.fetchAccounts()
  this.fetchInterval = setInterval(() => {
      this.fetchAccounts(); // Fetch accounts every minute
      if (this.pendingCount > 0){
        //this.playSound()
        }
    }, 60000); // 60000 milliseconds = 1 minute
  },
  beforeDestroy() {
    clearInterval(this.fetchInterval); // Clear the interval when the component is destroyed
  },
};
</script>