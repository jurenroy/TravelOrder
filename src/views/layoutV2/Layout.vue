<template>
  <div class="layout">
    <Header />

    <div :class="['grid-layout', layoutClass]">
      <!-- Left Sidebar -->
      <Sidebar v-if="isLoggedIn && !isMobile" class="left-sidebar" @toggle-sidebar="handleSidebarToggle"/>

      <!-- Spacer -->
      <div class="spacer-left"></div>

      <!-- Main Content -->
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <component :is="Component"  />
        </router-view>
      </main>

      <!-- Spacer -->
      <div class="spacer-right" v-if="showChat && isLoggedIn && !isMobile"></div>

      <!-- Right Sidebar -->
      <Chat v-if="showChat && isLoggedIn && !isMobile" class="right-sidebar" />
    </div>

    <!-- Mobile Footer Sidebar -->
    <Sidebar v-if="isLoggedIn && isMobile" class="mobile-footer" />
    <Footer v-if="!isLoggedIn" class="mobile-footer" style="position: absolute; bottom: 0;"/>
  </div>
</template>



  
<script>
import Header from '../../components/header/Header.vue';
import Sidebar from '@/components/sidebar/Sidebar.vue';
import Footer from '@/components/footer/Footer.vue'
import Chat from '../chat/Dashboard.vue'
import {WS_BASE_URL} from '@/config';
import { useAuthStore } from '@/store/auth';
import { useChatStore } from '@/store/chat';

export default {
  name: 'Layout',
  components: {
    Header,
    Sidebar,
    Chat,
    Footer
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
    chatStore() {
      return useChatStore(); // Use chat store from Pinia
    },
    isLoggedIn() {
      return this.authStore.isLoggedIn; // Check if user is logged in
    },
    sidebarMargin() {
      if (!this.isMobile){
        return this.isMenuOpen ? '200px' : '70px'; // Adjust margin for mobile view
      }else {
        return this.isMenuOpen ? '0px' : '0px'; // Adjust margin for mobile view
      }
    },
    showChat() {
      return this.chatStore.show; // new computed to check chat visibility
    },
    layoutClass() {
    if (this.isMobile) {
      return 'grid-mobile';
    }

    if (!this.showChat) {
      return this.isMenuOpen ? 'grid-no-chat-open' : 'grid-no-chat-collapsed';
    }

    return this.isMenuOpen ? 'grid-with-chat-open' : 'grid-with-chat-collapsed';
  }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile); // Check screen size on resize
    this.setupWebSocket();
    
  },
  methods: {
    setupWebSocket() {
        this.socket = new WebSocket(WS_BASE_URL);
  
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

.grid-layout {
  display: grid;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}

/* Chat shown + Sidebar open */
.grid-with-chat-open {
  grid-template-columns: 12% 0% 73% 0% 15%;
  grid-template-areas: "left gap1 main gap2 right";
}

/* Chat shown + Sidebar collapsed */
.grid-with-chat-collapsed {
  grid-template-columns: 4% 0% 80% 0% 15%;
  grid-template-areas: "left gap1 main gap2 right";
}

/* Chat hidden + Sidebar open */
.grid-no-chat-open {
  grid-template-columns: 11% 0% 89% 0% 0%;
  grid-template-areas: "left gap1 main gap2 .";
}

/* Chat hidden + Sidebar collapsed */
.grid-no-chat-collapsed {
  grid-template-columns: 4% 0% 95% 0% 0%;
  grid-template-areas: "left gap1 main gap2 .";
}

/* Mobile layout */
.grid-mobile {
  grid-template-columns: 0% 0% 100% 0% 0%;
  grid-template-areas: ". . main . .";
}


.sidebar {
  position: sticky;
  top: 0;
  background: #f0f2f5;
}

.left-sidebar {
  grid-area: left;
}

.spacer-left {
  grid-area: gap1;
}

.spacer-right {
  grid-area: gap2;
}

.right-sidebar {
  grid-area: right;
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  z-index: 10;
}

.main-content {
  grid-column: 3; /* Use the center column */
  padding: 1rem;
}
</style>
