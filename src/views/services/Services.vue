<template>
  <Dashboard />
  <div class="services">
    <div class="notificationcontainer">
      <button class="servicesbutton" @click="navigateTo('TravelOrder')">Travel Order Form </button> 
      <TravelOrderNotification class="luxury-notification-count"/>
    </div>
    <div class="notificationcontainer">
      <button class="servicesbutton" @click="navigateTo('LeaveForm')">Leave Form</button>
      <LeaveFormNotification class="luxury-notification-count"/>
    </div>
    <button class="servicesbutton" @click="navigateTo('ICTSRF')">ICT Service Request Form</button>
    <button class="servicesbutton" @click="navigateTo('rso')">Special Order Viewer</button>
    <button class="servicesbutton" @click="openLink">Document Tracking System</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Dashboard from '../dashboard/Dashboard.vue';
import TravelOrderNotification from '../../components/notifications/travelorder.vue';
import LeaveFormNotification from '../../components/notifications/leaveform.vue';

const router = useRouter();

// Methods to handle button actions
const navigateTo = (page) => {
  router.push({ name: page });
};

const openLink = () => {
  window.open('http://202.137.117.84:8001/', '_blank');
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
  flex-wrap: wrap ;
}

.servicesbutton {
  height: 60px;
  width: 280px;
  font-size: 18px;
  font-family: 'Playfair Display', serif; /* Luxurious font */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #000000;
  background: #bfa16d; /* Deep charcoal */
  border: 2px solid ; /* Luxurious gold border */
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out; /* Smooth transition */
}

.servicesbutton:hover {
  background: #704c0f; /* Rich gold on hover */
  color: #ffffff;
  border: 2px solid #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transform: scale(1.05); /* Gentle scaling effect */
}

.servicesbutton:focus {
  outline: 2px solid #bfa16d; /* Gold focus outline */
  outline-offset: 4px;
}

.servicesbutton:active {
  background: #c79b6b; /* Darker gold for active state */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transform: scale(1.02);
}

.luxury-notification-count {
    background-color: #fb0808;
    color: white;
    border-radius: 100%;
    padding: 6px 12px;
    font-weight: bold;
    font-size: 20px;
    border: solid black 2px;
    position: relative;
    top: -30px;
    right: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
.notificationcontainer{
  margin-right: -45px;
}


@media (max-width: 768px) {
  .services {
    flex-direction: column;
    gap: 15px;
  }

  .servicesbutton {
    width: 85%;
  }
  .notificationcontainer{
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
