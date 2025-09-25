<template>
  <div class="layout">
    <Header />

    <div class="grid-layout" :style="layoutStyle">
      <!-- Left Sidebar -->
      <Sidebar
        v-if="isLoggedIn && !isMobile"
        class="left-sidebar"
        @toggle-sidebar="handleSidebarToggle"
      />

      <!-- Spacer -->
      <div class="spacer-left"></div>

      <!-- Main Content -->
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </main>

      <!-- Spacer -->
      <div class="spacer-right" v-if="showChat && isLoggedIn && !isMobile"></div>

      <!-- Right Sidebar -->
      <Chat
        v-if="showChat && isLoggedIn && !isMobile"
        class="right-sidebar"
      />
    </div>

    <!-- Mobile Footer Sidebar -->
    <Sidebar v-if="isLoggedIn && isMobile" class="mobile-footer" />
    <Footer
      v-if="!isLoggedIn"
      class="mobile-footer"
      style="position: absolute; bottom: 0"
    />
  </div>
</template>

<script>
import Header from '../../components/header/Header.vue';
import Sidebar from '@/components/sidebar/Sidebar.vue';
import Footer from '@/components/footer/Footer.vue';
import Chat from '../chat/Dashboard.vue';
import { WS_BASE_URL } from '@/config';
import { useAuthStore } from '@/store/auth';
import { useChatStore } from '@/store/chat';

export default {
  name: 'Layout',
  components: {
    Header,
    Sidebar,
    Chat,
    Footer,
  },
  data() {
    return {
      isMenuOpen: true,
      isMobile: false,
      authStore: useAuthStore(),
      socket: null,
    };
  },
  computed: {
    chatStore() {
      return useChatStore();
    },
    isLoggedIn() {
      return this.authStore.isLoggedIn;
    },
    showChat() {
      return this.chatStore.show;
    },
    layoutStyle() {
      return {
        '--left-sidebar': this.isLoggedIn && !this.isMobile
          ? (this.isMenuOpen ? '200px' : '70px')
          : '0px',
        '--right-sidebar': this.showChat && this.isLoggedIn && !this.isMobile
          ? '300px'
          : '0px',
      };
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    this.setupWebSocket();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
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
    },
  },
};
</script>

<style scoped>
.grid-layout {
  display: grid;
  grid-template-columns: var(--left-sidebar, 0px) 16px 1fr 16px var(--right-sidebar, 0px);
  grid-template-areas: "left gap1 main gap2 right";
  width: 100%;
  transition: all 0.3s ease;
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
  position: relative;
  height: 100%;
}

.main-content {
  grid-area: main;
  padding: 1rem;
  overflow-x: hidden;
}

/* Mobile: collapse grid to single column */
@media screen and (max-width: 768px) {
  .grid-layout {
    grid-template-columns: 1fr;
    grid-template-areas: "main";
  }

  .left-sidebar,
  .spacer-left,
  .spacer-right,
  .right-sidebar {
    display: none;
  }

  .main-content {
    padding: 1rem;
  }

  .mobile-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background: white;
    border-top: 1px solid #ddd;
  }
}



@media print {
  /* Hide sidebars and gaps */
  .left-sidebar,
  .spacer-left,
  .spacer-right,
  .right-sidebar {
    display: none !important;
  }

  /* Make sure the main content takes up full width */
  .grid-layout {
    grid-template-columns: 1fr !important;
    grid-template-areas: "main" !important;
  }

  /* Adjust main content padding for better print layout */
  .main-content {
    padding: 0 !important;
    width: 100% !important;
  }

  /* Ensure no unnecessary margins or borders on the body */
  body {
    margin: 0;
    padding: 0;
  }

  /* Optional: Hide page header and footer if you don't want them printed */
  .mobile-footer {
    display: none !important;
  }
}
</style>
