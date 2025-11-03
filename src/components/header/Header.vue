<template>
  <header class="header">
    <!-- Logo section -->
    <div class="logo" @click="goHome">
      <h1>{{ title }} </h1>
    </div>

    <Heder/>
    <!-- Navigation container with links -->
    <nav class="nav-container">
      <nav class="nav" :class="{ 'is-open': isMenuOpen }">
        <ul>
          <li v-for="link in filteredLinks" :key="link.text" >
            <a @click="handleLinkClick(link.text)">{{ link.text }}{{ link.text == 'Chats' && unreadMessagesCount ?  '('+unreadMessagesCount+')' : ''}}</a>
          </li>
        </ul>
      </nav>
    </nav>

    <!-- Notification Bell -->
    <div class="notification-container" v-if="isLoggedIn">
      <div class="notification-bell" @click="toggleNotifications" :class="{ 'has-unread': notificationsStore.unreadCount > 0 }">
        <i class="bell-icon">🔔</i>
        <span v-if="notificationsStore.unreadCount > 0" class="notification-count">{{ notificationsStore.unreadCount }}</span>
      </div>
      <!-- Notifications Dropdown -->
      <div v-if="showNotifications" class="notifications-dropdown">
        <div class="dropdown-header">
          <h4>Notifications</h4>
          <button @click="markAsRead" class="mark-read-btn">Mark All Read</button>
        </div>
        <div class="notifications-list">
          <div v-if="notificationsStore.notifications.length === 0" class="no-notifications">No notifications</div>
          <div v-for="notification in notificationsStore.notifications" :key="notification.id" class="notification-item" :class="{ 'unread': !notification.read }">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
          </div>
        </div>
        <div class="dropdown-footer">
          <button @click="goToAuditTrails" class="view-audit-btn">View Audit Trails</button>
        </div>
      </div>
    </div>

    <!-- Hamburger icon for mobile -->
    <div class="hamburger" @click="toggleMenu" v-if="isMobile || !isMenuOpen">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
    <p style="color: red;">{{ isMobile && !isMenuOpen &&  unreadMessagesCount ? '('+unreadMessagesCount+')' : '' }}</p>
  </header>
  <!-- Login Popup -->
  <!-- <Login :login="showLogin" @closeLogin="closeLoginModal"/> -->
  <Login v-if="showLogin" :login="showLogin" @closeLogin="closeLoginModal"/>
  <!-- Logout Confirmation Popup -->
  <Logout v-if="isLogoutClicked" :show="isLogoutClicked" @handleNo="handleNo" @handleYes="handleLogout"/>
  <!-- <Chat v-if="(isLoggedIn && !isMobile) || (isMobile && checkMobileChat)" @update:unreadMessages="updateUnreadMessages"/> -->

</template>

<script>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Logout from '../logout/Logout.vue';
import Login from '../login/Login.vue';
import Heder from '../heder.vue';
import { useAuthStore } from '@/store/auth';
import { useChatStore } from '@/store/chat';
import { useNotificationsStore } from '@/store/notifications';
import Chat from '@/views/chat/Dashboard.vue';
import { API_BASE_URL } from '../../config';
import { usePendingStore } from '@/store/pending';
import axios from 'axios';


export default {
  name: 'Header',
  components: {
    Logout,
    Login,
    Heder,
    Chat
  },
  setup() {
    const title = ref('MGBxPORTAL');
    const authStore = useAuthStore();
    const router = useRouter();
    const notificationsStore = useNotificationsStore();
    const isLoggedIn = computed(() => authStore.isLoggedIn);
    const nameId = computed(() => authStore.name_id);
    const isMenuOpen = ref(true);
    const isMobile = ref(false);
    const chatStore = useChatStore();
    const unreadMessagesCount = ref(0);
    const showNotifications = ref(false);
    let websocket = null;

    const goHome = () => {
      router.push('/');
    };

    const showLogin = ref(false);

    const showLoginModal = () => {
      showLogin.value = false;
    };

    const fetchCounts = async () => {
  const ictRequestApiUrl = `${API_BASE_URL}/services/${nameId.value}/count`;
  const leaveFormApiUrl = `${API_BASE_URL}/get_leave_json/${nameId.value}/count`;
  const travelOrderApiUrl = `${API_BASE_URL}/get_forms_json/${nameId.value}/count`;

  try {
    // Fetch all counts concurrently using Promise.all
    const [ictRequestResponse, leaveFormResponse, travelOrderResponse] = await Promise.all([
      axios.get(ictRequestApiUrl),
      axios.get(leaveFormApiUrl),
      axios.get(travelOrderApiUrl)
    ]);

    // Assuming the API responses have a 'count' field
    const ictRequestCount = ictRequestResponse.data;
    const leaveFormCount = leaveFormResponse.data;
    const travelOrderCount = travelOrderResponse.data;

    // Use the pending store to update counts
    const pendingStore = usePendingStore();

    pendingStore.count('ictrequest', ictRequestCount);
    pendingStore.count('leaveform', leaveFormCount);
    pendingStore.count('travelorder', travelOrderCount);

    console.log("Counts updated:", {
      ictRequestCount,
      leaveFormCount,
      travelOrderCount
    });

  } catch (error) {
    console.error("Error fetching counts:", error);
  }
};


    const closeLoginModal = () => {
      showLogin.value = false;
    };

    const updateUnreadMessages = (count) => {
      unreadMessagesCount.value = count;
    };

    const isLogoutClicked = ref(false);

    const handleNo = () => {
      isLogoutClicked.value = false; // Close the logout confirmation dialog
    };

    const handleLogout = () => {
      isLoggedIn.value = false;  // Set the logged-in state to false
      authStore.logout(); // Call the logout action
      isLogoutClicked.value = false; // Close the logout confirmation dialog
      disconnectWebSocket();
    };

    // WebSocket functions
    const connectWebSocket = () => {
      if (!isLoggedIn.value) return;

      websocket = new WebSocket('ws://172.31.10.34:8012/ws/chat/');

      websocket.onopen = () => {
        console.log('WebSocket connected');
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'notification_message') {
          notificationsStore.addNotification({
            id: Date.now(),
            title: data.title,
            message: data.message,
            timestamp: new Date(),
            read: false
          });
        }
      };

      websocket.onclose = () => {
        console.log('WebSocket disconnected');
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    const disconnectWebSocket = () => {
      if (websocket) {
        websocket.close();
        websocket = null;
      }
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const markAsRead = () => {
      notificationsStore.markAsRead();
    };

    const goToAuditTrails = () => {
      router.push('/audit-trails');
      showNotifications.value = false;
    };

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString();
    };

    // Update the links based on login status
    const links = ref([
      { text: 'Home', url: '/' },
      { text: 'Chats', url: '/chat' },
      { text: isLoggedIn.value ? 'Logout' : 'Login', url: '#' } // Set URL to '#' to prevent routing
    ]);

    const filteredLinks = computed(() => {
      return links.value.filter(link => {
        // Exclude 'Chats' link if not logged in
        return !(link.text === 'Chats' && !isLoggedIn.value);
      });
    });

    // Handle link click (for login/logout pop-up)
    const handleLinkClick = (linkText) => {
      console.log(linkText , isLoggedIn.value)
      console.log(authStore.value)
      if (linkText === 'Login' && !isLoggedIn.value) {
        // Trigger login popup here if you want to show a login dialog
        showLogin.value = true;
      } else if (linkText === 'Logout' && isLoggedIn.value) {
        isLogoutClicked.value = true; // Show the logout confirmation dialog
      } else if (linkText === 'Services' && isLoggedIn.value){
        router.push('/services');
      } else if (linkText === 'Services' && !isLoggedIn.value){
        showLogin.value = true;
      } else if (linkText === 'Chats' && isLoggedIn.value){
        if (window.innerWidth >= 768) {
          chatStore.toggleShow();
          console.log('desktop')
        }else if (window.innerWidth <= 768 && router.currentRoute.value.path !== 'chat') {
        router.push('/chat');
        console.log('ipa show sa route ra', router.currentRoute.value.path !== 'chat')
          if (!chatStore.show) {
            chatStore.toggleShow(); // Call toggleShow if it's false
            console.log('ipashow')
          }
        }
      } else if (linkText === 'Chats' && !isLoggedIn.value){
        showLogin.value = true;
      }else if (linkText === 'Home'){
        router.push('/');
      }

      if (linkText !== 'Chats' && chatStore.show){
        console.log('dili ipashow')
        chatStore.toggleShow()
      }


    };

    // Toggle hamburger menu
    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    // Check for mobile screen size
    const checkMobileScreen = () => {
      isMobile.value = window.innerWidth <= 768; // Adjust the width based on your design
    };
    // Check for mobile screen size
    const checkMobileScreens = computed(() => {
      return window.innerWidth <= 768; // Adjust the width based on your design
    });
    // Check for mobile screen size
    const checkMobileChat = computed(() => {
      console.log(router.currentRoute.value.path !== 'chat')
      return router.currentRoute.value.path !== 'chat'; // Adjust the width based on your design
    });

    onMounted(() => {
      fetchCounts();
      checkMobileScreen();
      window.addEventListener('resize', checkMobileScreen);
      if (isLoggedIn.value) {
        connectWebSocket();
      }
    });

    onUnmounted(() => {
      disconnectWebSocket();
    });

    return {
      title,
      links,
      isMenuOpen,
      isMobile,
      isLoggedIn,
      handleLinkClick,
      toggleMenu,
      goHome,
      isLogoutClicked,
      handleNo,
      handleLogout,
      showLogin,
      showLoginModal,
      closeLoginModal,
      authStore,
      filteredLinks,
      unreadMessagesCount,
      updateUnreadMessages,
      checkMobileChat,
      checkMobileScreens,
      notificationsStore,
      showNotifications,
      toggleNotifications,
      markAsRead,
      goToAuditTrails,
      formatTime
    };
  }
};
</script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Monoton&display=swap');
  .microscopic-div {
      width: 0px; /* Example width */
      height: 0px; /* Example height */
      overflow: auto;
      transform: scale(0.01); /* Scale down the content */
      transform-origin: top left; /* Keep the scaling from the top left corner */
      border: 1px solid black;
    }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 10px;
    background: linear-gradient(to right, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
    color: rgb(0, 0, 0);
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    margin: -10px;
    z-index: 999;
  }
  
  .logo h1 {
    margin-left: 10px;
    font-family: 'Monoton', sans-serif;
    font-size: 2rem;
    white-space: nowrap; /* Prevent title from wrapping */
    overflow: hidden; /* Hide overflow if the text is too long */
    text-overflow: ellipsis; /* Optionally add ellipsis for overflow text */
    max-width: 100%; /* Prevent the text from overflowing the container */
    cursor: pointer;
  }
  
  /* Container for navigation */
  .nav-container {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-end; /* Align the hamburger to the right */
  }
  
  .nav {
    display: flex;
    transition: transform 0.3s ease-in-out;
    transform: translateX(-100%);
    flex-grow: 1; /* Make nav grow to fill available space */
  }
  
  .nav.is-open {
    display: block;
    transform: translateX(0);
  }
  
  .nav ul {
    display: flex;
    list-style: none;
    justify-content: flex-end;
    cursor: pointer;
  }
  
  .nav ul li {
    margin-right: 20px;
  }
  
  .nav ul li a {
    color: rgb(0, 0, 0);
    text-decoration: none;
  }
  
  .nav ul li a:hover {
    text-decoration: underline;
  }
  
  .hamburger {
    display: flex;
    cursor: pointer;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 21px;
    padding: 5px;
    margin-left: auto; /* Ensure hamburger icon is on the right */
  }
  
  .hamburger .line {
    height: 3px;
    background-color: black;
    border-radius: 5px;
    width: 20px;
  }
  
  @media (max-width: 768px) {
    .nav {
      display: none;
    }
  
    .nav ul {
      flex-direction: column;
      background: linear-gradient(to top, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
      width: 150px;
      padding: 10px 0;
      position: absolute;
      top: 0px; /* Position below the header */
      right: 0;
      margin-top: 0px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    .nav ul li {
      margin: 10px 0;
    }
  
    .nav ul li a {
      padding: 10px;
    }
  
    .hamburger {
      display: flex;
    }
  
    .nav.is-open {
      display: flex;
      position: absolute;
      top: 50px;
      right: 0;
      width: 200px; /* Adjust the width as needed */
    }
  }
  /* Notification Styles */
  .notification-container {
    position: relative;
    margin-right: 20px;
  }

  .notification-bell {
    position: relative;
    cursor: pointer;
    font-size: 24px;
    padding: 5px;
    border-radius: 50%;
    transition: background-color 0.3s;
  }

  .notification-bell:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .notification-bell.has-unread .bell-icon {
    color: #ff4444;
  }

  .notification-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ff4444;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: bold;
    min-width: 18px;
    text-align: center;
  }

  .notifications-dropdown {
    position: absolute;
    top: 40px;
    right: 0;
    width: 350px;
    max-height: 400px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
    background-color: #f8f9fa;
  }

  .dropdown-header h4 {
    margin: 0;
    color: #333;
  }

  .mark-read-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }

  .mark-read-btn:hover {
    background-color: #0056b3;
  }

  .notifications-list {
    flex: 1;
    overflow-y: auto;
    max-height: 300px;
  }

  .no-notifications {
    padding: 20px;
    text-align: center;
    color: #666;
    font-style: italic;
  }

  .notification-item {
    padding: 15px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .notification-item:hover {
    background-color: #f8f9fa;
  }

  .notification-item.unread {
    background-color: #e3f2fd;
  }

  .notification-item.unread .notification-title {
    font-weight: bold;
  }

  .notification-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
  }

  .notification-message {
    font-size: 13px;
    color: #666;
    margin-bottom: 5px;
    line-height: 1.4;
  }

  .notification-time {
    font-size: 11px;
    color: #999;
  }

  .dropdown-footer {
    padding: 15px;
    border-top: 1px solid #eee;
    background-color: #f8f9fa;
    text-align: center;
  }

  .view-audit-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .view-audit-btn:hover {
    background-color: #218838;
  }

  @media print{
    .header{
      display: none;
    }
  }
  </style>
  