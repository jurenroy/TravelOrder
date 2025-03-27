<template>
  <div class="layout">
    <Header />
    <div class="content-wrapper">
      <Sidebar v-if="isLoggedIn && !isMobile" @toggle-sidebar="handleSidebarToggle" class="sidebar" /> <!-- Only show Sidebar if logged in and not mobile -->
      <main class="main-content" :style="{ marginLeft: sidebarMargin }">
        <router-view />  <!-- This is where the page content will be injected -->
      </main>
    </div>
    <Sidebar v-if="isLoggedIn && isMobile" @toggle-sidebar="handleSidebarToggle" class="mobile-footer" /> <!-- Sidebar becomes the footer on mobile -->
    <Footer v-if="!isMobile" /> <!-- Show footer on large screens only -->
  </div>
</template>

  
<script>
import Header from '../../components/header/Header.vue';
import Footer from '../../components/footer/Footer.vue';
import Sidebar from '@/components/sidebar/Sidebar.vue';
import Chat from '../chat/Dashboard.vue'
import { useAuthStore } from '@/store/auth';

export default {
  name: 'Layout',
  components: {
    Header,
    Footer,
    Sidebar,
    Chat,
  },
  data() {
    return {
      isMenuOpen: true, // Track sidebar state
      isMobile: false, // Track if the device is mobile
      authStore: useAuthStore(),
      socket: null,
    };
  },
  computed: {
    isLoggedIn() {
      return this.authStore.isLoggedIn; // Check if user is logged in
    },
    sidebarMargin() {
      if (!this.isMobile){
        return this.isMenuOpen ? '200px' : '70px'; // Adjust margin for mobile view
      }else {
        return this.isMenuOpen ? '0px' : '0px'; // Adjust margin for mobile view
      }
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile); // Check screen size on resize
    this.setupWebSocket();
  },
  
  methods: {
    setupWebSocket() {
        this.socket = new WebSocket('ws://202.137.117.84:8012/ws/chat/');
  
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
        };
  
        this.socket.onclose = (event) => {
          console.log('WebSocket closed:', event);
        };
  
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      },
    handleSidebarToggle(isOpen) {
      this.isMenuOpen = isOpen; 
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768; 
    },destroyed() {
    window.removeEventListener('resize', this.checkMobile); 
    },
  }
};
</script>

  
<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensures the layout covers the full height of the screen */
}

.content-wrapper {
  display: flex; /* Use flexbox to align Sidebar and main-content side by side */
  flex: 1; /* Allow the content wrapper to grow */
}

.main-content {
  flex: 1; /* Makes the content area expand and contract with screen size */
  padding: 20px;
  box-sizing: border-box;
}


@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column; /* Stack the sidebar and content vertically on mobile */
  }

  .main-content {
    margin-left: 0; /* No sidebar margin on mobile */
  }

  .sidebar {
    display: none; /* Hide sidebar on mobile */
  }

  .mobile-footer {
    position: fixed;
    bottom: 0;
    width: 30%;
    z-index: 900;
  }
}

@media print{
  .main-content {
    margin-left: 0 !important; /* Set margin-left to 0 when printing */
  }

  .sidebar {
    display: none; /* Optionally hide the sidebar when printing */
  }

  .mobile-footer {
    display: none; /* Optionally hide the mobile footer when printing */
  }
}

</style>
