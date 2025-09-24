<template>
  <aside :class="{ 'collapsed': !isMenuOpen, 'mobile-footer': isMobile }">
    <div class="sidebar-header">
      <input id="burger-checkbox" type="checkbox" v-model="isMenuOpen" @change="toggleSidebar" />
      <label class="burger" for="burger-checkbox">
        <span></span>
        <span></span>
        <span></span>
      </label>
    </div>
    <ul>
      <!-- Home Link -->
      <li>
        <router-link to="/" exact-active-class="active" class="list-item">
          <img :src="home" alt="Home" class="icon" />
          <span v-if="isMenuOpen" class="indent">Home</span>
        </router-link>
      </li>

      <!-- Services Dropdown -->
      <!-- <li @click="toggleServices" class="dropdown">
        <span class="count" v-if="totalCount && !isServicesOpen">{{ totalCount < 9 ? totalCount : '9+' }}</span>
        <router-link to="/services" exact-active-class="active" class="list-item">
          <img :src="services" alt="Services" class="icon" />
          <span v-if="isMenuOpen" class="indent">Services</span>
        </router-link>
      </li> -->
      <ul v-if="isServicesOpen" class="dropdown-menu">
        <li>
          <span class="count" v-if="travelOrderCount">{{ travelOrderCount < 9 ? travelOrderCount : '9+' }}</span>
          <router-link to="/travelorder" exact-active-class="active" class="list-item">
            <img :src="travelorder" alt="Travel Order" class="icon" />
            <span v-if="isMenuOpen" class="indent">Travel Order</span>
          </router-link>
        </li>
        <li>
          <span class="count" v-if="leaveFormCount">{{ leaveFormCount < 9 ? leaveFormCount : '9+' }}</span>
          <router-link to="/leaveform" exact-active-class="active" class="list-item">
            <img :src="leaveform" alt="Leave Form" class="icon" />
            <span v-if="isMenuOpen" class="indent">Leave Form</span>
          </router-link>
        </li>
        <li>
          <span class="count" v-if="ICTRequestCount">{{ ICTRequestCount < 9 ? ICTRequestCount : '9+' }}</span>
          <router-link to="/ICTSRF" exact-active-class="active" class="list-item">
            <img :src="ictservice" alt="ICT Service" class="icon" />
            <span v-if="isMenuOpen" class="indent">ICT Service</span>
          </router-link>
        </li>
        <li>
          <router-link to="/requestform" exact-active-class="active" class="servicesbutton list-item">
            <img :src="admin" alt="Request Form" class="icon" />
            <span v-if="isMenuOpen" class="indent" style="font-size: 13px;">Admin Request Form</span>
          </router-link>
        </li>
        <li>
          <router-link to="/FADRF" exact-active-class="active" class="servicesbutton list-item">
            <img :src="procurement" alt="Procurement Form" class="icon" />
            <span v-if="isMenuOpen" class="indent" style="font-size: 15px;">Procurement Form</span>
          </router-link>
        </li>
        <li>
          <router-link to="/rso" exact-active-class="active" class="list-item">
            <img :src="specialorder" alt="Special Order" class="icon" />
            <span v-if="isMenuOpen" class="indent">Special Order</span>
          </router-link>
        </li>
      </ul>

      <!-- Settings Link -->
      <li>
        <span class="count" v-if="isPasswordDefault">!</span>
        <router-link to="/settings" exact-active-class="active" class="list-item">
          <img :src="settings" alt="Settings" class="icon" />
          <span v-if="isMenuOpen" class="indent">Settings</span>
        </router-link>
      </li>
      <li v-if="isAdmin">
          <router-link to="/registration" exact-active-class="active" class="list-item">
            <img :src="registration" alt="Registration" class="icon" />
            <span v-if="isMenuOpen" class="indent">Registration</span>
          </router-link>
        </li>
        <li v-if="isAdmin">
          <router-link to="/employeelist" exact-active-class="active" class="list-item">
            <img :src="employeelist" alt="Employee List" class="icon" />
            <span v-if="isMenuOpen" class="indent">Employee List</span>
          </router-link>
        </li>

      <!-- Logout Link -->
      <li>
        <router-link to="/logout" exact-active-class="active" class="list-item">
          <img :src="logoutIcon" alt="Logout" class="icon" />
          <span v-if="isMenuOpen" class="indent">Logout</span>
        </router-link>
      </li>
      <footer class="footer" v-if="!isMobile">
      <div class="footer-content">
        <div @click="openLink('https://www.facebook.com/mgbregionxofficialpage')"> 
        <img src="./logos/facebook.png" alt="Facebook Logo" class="footer-image" /> 
        <p style="text-decoration: underline;" v-if="isMenuOpen">Facebook Page</p>    
        </div> 
        <div @click="openLink('https://region10.mgb.gov.ph/')">
        <img src="./logos/web.png" alt="Web Logo" class="footer-image" />
        <p style="text-decoration: underline;" v-if="isMenuOpen">MGBX Website</p>    
        </div> 
      </div>
    </footer>
    </ul>
  </aside>
</template>
  
  <script>
  import Footer from '../footer/Footer.vue';
  import settings from '../../assets/sidebar/settings.png';
  import home from '@/assets/sidebar/home.png';
  import services from '../../assets/sidebar/services.png';
  import travelorder from '../../assets/sidebar/travelorder.png';
  import leaveform from '../../assets/sidebar/leaveform.png';
  import ictservice from '../../assets/sidebar/ictservice.png';
  import procurement from '../../assets/sidebar/procurement.png';
  import admin from '../../assets/sidebar/admin.png';
  import specialorder from '../../assets/sidebar/specialorder.png';
  import logoutIcon from '../../assets/sidebar/logout.png'; // Import your logout icon
  import registration from '@/assets/sidebar/registration.png';
  import employeelist from '@/assets/sidebar/employeelist.png';
  import { usePendingStore } from '@/store/pending';
  import { useAuthStore } from '@/store/auth';
  import CryptoJS from 'crypto-js';
  
  export default {
    name: 'Sidebar',
    data() {
      return {
        isMenuOpen: true, // Sidebar is open by default
        isServicesOpen: true, // Services dropdown is closed by default
        settings,
        home,
        services,
        travelorder,
        leaveform,
        ictservice,
        procurement,
        admin,
        specialorder,
        logoutIcon,
        registration,
        employeelist,
        Footer,
        pendingStore: usePendingStore(),
        authStore: useAuthStore(),
        predefinedPassword: 'Pass12345',
      };
    },
    computed: {
    isMobile() {
      return window.innerWidth <= 768; // Detect if screen width is 768px or less
    },
    totalCount() {
      return this.pendingStore.travelorder + this.pendingStore.leaveform + this.pendingStore.ictrequest
    },
    travelOrderCount() {
      return this.pendingStore.travelorder
    },
    leaveFormCount() {
      return this.pendingStore.leaveform
    },
    ICTRequestCount() {
      return this.pendingStore.ictrequest
    },
    isAdmin() {
      return this.authStore.name_id == 76
    },
    isPasswordDefault() {
      const decryptedPassword = CryptoJS.AES.decrypt(this.authStore.password, 'jUr3ñr0yR@br4g@n').toString(CryptoJS.enc.Utf8);
      return decryptedPassword === this.predefinedPassword ;
    },
  },
  methods: {
      toggleServices() {
        this.isServicesOpen = !this.isServicesOpen; // Toggle the services dropdown
      },
      toggleSidebar() {
        this.$emit('toggle-sidebar', this.isMenuOpen); // Emit event to parent
      },
      handleResize() {
      this.isMobile = window.innerWidth <= 768; // Update the value on resize
      this.$emit('toggle-sidebar', this.isMenuOpen); // Emit event to parent
      }
    },
    mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  };
  </script>
  
  <style scoped>
  /* Sidebar styles */
  aside {
    background: linear-gradient(to bottom, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
    color: #f5f5dc;
    padding: 20px;
    width: 205px; /* Width when expanded */
    height: 100vh; /* Full height */
    position: fixed; /* Fixed position */
    transition: all 0.3s ease; /* Smooth transition */
    display: flex;
    flex-direction: column; /* Stack items vertically */
    justify-content: space-between; /* Space between header and footer */
    overflow-y: scroll;
  }
  
  aside.collapsed {
    width: 70px; /* Width when collapsed */
    .list-item{
      width: max-content;
    }
    /* Show count when collapsed */
    aside.collapsed li .count {
      display: flex; /* Ensure the count is displayed */
      position: absolute; /* Position it absolutely */
      top: 0; /* Align to the top */
      right: 0; /* Align to the right */
      background-color: #ff0000; /* Optional: background color for visibility */
      border-radius: 50%; /* Optional: make it circular */
      padding: 0.2rem 0.4rem; /* Optional: padding for the count */
      font-size: 12px; /* Optional: font size */
      color: #fff; /* Optional: text color */
    }
  }
  /* Styles for the sidebar as a footer on mobile */
aside.mobile-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 80px;
  z-index: 1000;
  flex-direction: row; /* Sidebar items aligned horizontally on mobile */
  justify-content: space-evenly; /* Distribute items evenly */
  overflow-x: scroll;
  overflow-y: hidden;
  .indent{
    display: none;
  }
  .burger{
    display: none;
  }
  ul{
    flex-direction: row;
  }
  li{
    flex-direction: row;
  }
  .list-item{
    width: fit-content;
    margin-top: -48px;
    margin-right: 25px;
  }
  .dropdown-menu{
    margin-top: 5px;
    margin-right: 25px;
  }
  .icon{
    height: 45px;
    width: auto;
  }
}
  
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  ul {
    list-style-type: none;
    padding: 0px;
    flex-grow: 1; /* Allow the list to grow and take available space */
    display: flex;
    flex-direction: column;
  }
  
  li {
    margin: 15px 0;
  }
  
  .indent {
    text-indent: 10px;
  }
  
  .list-item {
    color: white; /* Link color */
    text-decoration: none; /* Remove underline */
    display: flex; /* Flexbox for icon and text alignment */
    align-items: center; /* Center items vertically */
    padding: 5px; /* Padding for clickable area */
    border-radius: 5px; /* Rounded corners */
    transition: background-color 0.3s; /* Smooth background transition */
    margin-left: -8px;
  }
  
  .list-item:hover {
    background-color: #726238; /* Darker background on hover */
  }
  
  .list-item.active {
    background-color: #b8860b; /* Active link color */
  }
  
  /* Dropdown styles */
  .dropdown {
    cursor: pointer; /* Change cursor to pointer for dropdown */
  }
  
  .dropdown-menu {
    list-style-type: none;
    padding: 0;
    margin: 0;
    margin-top: 20px;
  }
  
  .dropdown-menu li {
    margin: 10px 0; /* Space between dropdown items */
  }
  .count {
  background-color: #ff0000; /* Optional: background color for visibility */
  border-radius: 50%; /* Optional: make it circular */
  padding: 0.2rem 0.4rem; /* Optional: padding for the count */
  font-size: 12px; /* Optional: font size */
  color: #fff; /* Optional: text color */
}

@media (max-width: 768px) {
  .count{
    position: absolute;
    margin-top: -50px;
    margin-left: 30px;
  }
}

  /* Burger styles */
  .burger {
    display: inline-block;
    cursor: pointer;
    z-index: 900;
    margin-left: auto;
    margin-top: 20px;
  }
  
  .burger span {
    display: block;
    width: 30px;
    height: 3px;
    background: #ffffff;
    margin: 6px 0;
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      opacity 0.3s ease;
      margin-left: -10px;
  }
  
  #burger-checkbox {
    display: none; /* Hide the checkbox */
  }
  
  #burger-checkbox:checked + .burger span:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }
  
  #burger-checkbox:checked + .burger span:nth-child(2) {
    opacity: 0;
    transform: translateX(-20px);
  }
  
  #burger-checkbox:checked + .burger span:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }
  
  /* Hide text when collapsed */
  aside.collapsed li .indent {
    display: none; /* Hide text when collapsed */
  }
  
  .icon {
    width: 20px; /* Set a fixed width for the icon */
    height: 20px; /* Set a fixed height for the icon */
    object-fit: contain; /* Maintain aspect ratio while fitting within the box */
    transition: transform 0.2s; /* Smooth transition for hover effects */
  }
  
  .icon:hover {
    transform: scale(1.1); /* Slightly enlarge the icon on hover */
  }

  @media print{
    aside{
      display: none;
    }
  }

  .footer {
    display: flex;
    justify-content: center; /* Center the content horizontally */
    align-items: center;
    padding: 10px;
    color: rgb(0, 0, 0);
    width: 100%;
    text-align: center;
    height: auto;
  }
  .footer-content{
    display: flex;
    justify-content: space-around;
    flex-direction: column;
  }
  .footer-content div{
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: space-around;
    cursor: pointer;
  }
  
  .footer-content p {
    margin: 5px 0;
    font-size: 1rem;
    font-weight: normal;
  }
  .footer-content img {
  width: auto; /* Let the width adjust based on the image's aspect ratio */
  height: 20px; /* You can adjust the height based on your desired footer logo size */
  margin: 5px 0;
}
@media print{
    .footer{
      display: none;
    }
  }
  </style>