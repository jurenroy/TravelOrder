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
  <div class="microscopic-div" v-if="1==2">
    <TravelCard/>
    <LeaveCard/>
    <ICTCard/>
  </div>
  <Chat v-if="(isLoggedIn && !isMobile) || (isMobile && checkMobileChat)" @update:unreadMessages="updateUnreadMessages"/>

</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Logout from '../logout/Logout.vue';
import Login from '../login/Login.vue';
import Heder from '../heder.vue';
import { useAuthStore } from '@/store/auth';
import TravelCard from '@/views/travelorderV2/Card.vue';
import LeaveCard from '@/views/leaveform/Card.vue';
import ICTCard from '@/views/ictsrf/Card.vue'
import { useChatStore } from '@/store/chat';
import Chat from '@/views/chat/Dashboard.vue';


export default {
  name: 'Header',
  components: {
    Logout,
    Login,
    Heder,
    TravelCard,
    LeaveCard,
    ICTCard,
    Chat
  },
  setup() {
    const title = ref('MGBxPORTAL');
    const authStore = useAuthStore();
    const router = useRouter();
    const isLoggedIn = computed(() => authStore.isLoggedIn);
    const isMenuOpen = ref(true);
    const isMobile = ref(false);
    const chatStore = useChatStore();
    const unreadMessagesCount = ref(0)

    const goHome = () => {
      router.push('/');
    };

    const showLogin = ref(false);

    const showLoginModal = () => {
      showLogin.value = false;
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
    };

    // Update the links based on login status
    const links = ref([
      { text: 'Home', url: '/' },
      { text: 'Services', url: '/services' },
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
      checkMobileScreen();
      window.addEventListener('resize', checkMobileScreen);
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
      checkMobileScreens
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
  @media print{
    .header{
      display: none;
    }
  }
  </style>
  