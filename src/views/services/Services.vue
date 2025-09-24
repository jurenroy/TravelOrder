<template>
  <Dashboard />
  <div class="services">
    <div class="notificationcontainer">
      <button class="servicesbutton" @click="navigateTo('TravelOrder')">Travel Order Form </button> 
      <span class="luxury-notification-count">{{ pendingStore.travelorder < 9 ? pendingStore.travelorder : '9+' }}</span>
    </div>
    <div class="notificationcontainer">
      <button class="servicesbutton" @click="navigateTo('LeaveForm')">Leave Form</button>
      <span class="luxury-notification-count">{{ pendingStore.leaveform < 9 ? pendingStore.leaveform : '9+' }}</span>
    </div>
    <div class="notificationcontainer">
      <button class="servicesbutton" @click="navigateTo('ICTSRF')">ICT Service Request Form</button>
      <span class="luxury-notification-count">{{ pendingStore.ictrequest < 9 ? pendingStore.ictrequest : '9+' }}</span>
    </div>
    <button class="servicesbutton" @click="navigateTo('rso')">Special Order Viewer</button>
    <button class="servicesbutton" @click="openLink">Document Tracking System</button>
    <button class="servicesbutton" @click="navigateTo('requestform')">
      Request Form
    </button>
    <button class="servicesbutton" @click="navigateTo('FADRF')">Procurement form</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Dashboard from '../dashboard/Dashboard.vue';
import { usePendingStore } from '@/store/pending';

const pendingStore = usePendingStore()

const router = useRouter();

// Methods to handle button actions
const navigateTo = (page) => {
  router.push({ name: page });
};

const openLink = () => {
  window.open("http://202.137.117.84:8001/", "_blank");
};
</script>

<style scoped>
.services {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
  gap: 20px;
  padding: 0 20px;
  flex-wrap: wrap;
}

.servicesbutton {
  height: 60px;
  width: 280px;
  font-size: 18px;
  font-family: "Playfair Display", serif; /* Luxurious font */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #ffffff; /* White text for contrast */
  background: linear-gradient(135deg, #d4af37, #b8860b); /* Rich gold gradient */
  border: 2px solid #b8860b; /* Darker gold border */
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out; /* Smooth transition */
}

.servicesbutton:hover {
  background: linear-gradient(135deg, #c0a16b, #d4af37); /* Lighter gold gradient on hover */
  color: #ffffff; /* Keep text white */
  border: 2px solid #fff; /* White border on hover */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  transform: scale(1.05); /* Gentle scaling effect */
}

.servicesbutton:focus {
  outline: 2px solid #d4af37; /* Gold focus outline */
  outline-offset: 4px;
}

.servicesbutton:active {
  background: linear-gradient(135deg, #a67c5d, #b8860b); /* Darker gold gradient for active state */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
}

.luxury-notification-count {
    background-color: #8b0000; /* Dark red for notifications */
    color: white;
    border-radius: 100%;
    padding: 6px 12px;
    font-weight: bold;
    font-size: 20px;
    border: solid black 2px;
    position: relative;
    top: -30px;
    right: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.notificationcontainer {
  margin-right: -45px;
}

@media (max-width: 768px) {
  .services {
    flex-direction: column;
    gap: 10px;
  }

  .servicesbutton {
    width: 85%;
  }
  .notificationcontainer {
    margin-right: -15%;
    width: 100%;
    margin-bottom: -5%;
  }

  .luxury-notification-count {
    margin-left: 85%;
    top: -70px;
  }
}
</style>