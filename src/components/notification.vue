<template>
  <div class="notification-container">
    <h2 class="header">
      <span  class="notification-count">{{ pendingCount }}</span>
    </h2>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config';
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
    };
  },
  computed: {
    pendingCount() {
      return this.countPendingNotifications(this.formData, this.acc, this.sectionChiefIds, this.members);
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
          console.log(this.formData)
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
        }
      } else if (acc.type_id === 2) {
        pendingCount += formData.filter(form => {
          return form.name_id === acc.name_id && form.signature2 === null;
        }).length;
      }
      return pendingCount;
    },
  },
  mounted() {
    this.fetchAccounts()
  },
};
</script>

<style scoped>
.notification-container {
  padding: 20px;
  position: relative;
  margin-left: 230px;
  margin-top: -90px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Playfair Display', serif; /* Elegant font */
}

.notification-count {
  background: linear-gradient(145deg, #646363, #000000); /* Luxurious gold gradient */
  color: white;
  font-size: 18px;
  font-weight: bold;
  border-radius: 50%;
  padding: 10px 15px;
  text-align: center;
  min-width: 40px;
  min-height: 40px;
  line-height: 1;
  display: inline-block;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
  animation: pulse 1.5s infinite ease-in-out; /* Subtle pulse effect */
}

/* Pulse effect */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

/* Responsive styling for smaller screens */
@media (max-width: 768px) {
  .notification-container {
    margin-left: 90%;
    margin-top: -25%;
  }

  .notification-count {
    font-size: 16px;
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .notification-container {
    margin-left: 90%;
    margin-top: -55%;
  }

  .notification-count {
    font-size: 14px;
    padding: 6px 10px;
  }
}
</style>