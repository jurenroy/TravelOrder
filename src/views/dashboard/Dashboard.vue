<template>
    <div class="dashboard" v-if="!isLoggedIn || !isHomePage">
      <main class="main-content">
        <div class="content-wrapper">
          <img src="../../assets/background_image.png" alt="Background Image" class="content-image" />
          <div class="content-text">
            <p>Republic of the Philippines</p>
            <p>Department of Environment and Natural Resources</p>
            <p>Mines and Geosciences Bureau</p>
            <p>Regional Office No. X</p>
          </div>
        </div>
      </main>
    </div>
    <div class="card-container" @touchstart="startTouch" @touchmove="moveTouch" @touchend="endTouch">
    <TravelCard v-if="isLoggedIn && isHomePage && currentCardIndex === 0"/>
    <LeaveCard v-if="isLoggedIn && isHomePage && currentCardIndex === 1" />
    <ICTCard v-if="isLoggedIn && isHomePage && currentCardIndex === 2" />
    </div>
  </template>
  
  <script>
import TravelCard from '../travelorderV2/Card.vue';
import LeaveCard from '../leaveform/Card.vue';
import ICTCard from '../ictsrf/Card.vue'
import { useAuthStore } from '@/store/auth'; // Adjust the path as necessary
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router'; // Import useRoute

export default {
  name: 'Dashboard',
  components: {
    TravelCard,
    LeaveCard,
    ICTCard
  },
  setup() {
    const authStore = useAuthStore(); // Access the auth store
    const isLoggedIn = computed(() => authStore.isLoggedIn); // Create a computed property for isLoggedIn
    const route = useRoute(); // Get the current route

    // Computed property to check if the current path is '/'
    const isHomePage = computed(() => route.path === '/');

    // Track the current card index
    const currentCardIndex = ref(0);
    const cardCount = 3; // Total number of card types

     // Variables to track touch positions
     const startY = ref(0);
    const endY = ref(0);

    // Touch event handlers
    const startTouch = (event) => {
      startY.value = event.touches[0].clientY;
    };

    const moveTouch = (event) => {
      endY.value = event.touches[0].clientY;
    };

    const endTouch = () => {
      if (startY.value - endY.value > 50) {
        // Swipe up
        nextCard();
      } else if (endY.value - startY.value > 50) {
        // Swipe down
        previousCard();
      }
    };

    const nextCard = () => {
      if (currentCardIndex.value < cardCount - 1) {
        currentCardIndex.value++;
      }
    };

    const previousCard = () => {
      if (currentCardIndex.value > 0) {
        currentCardIndex.value--;
      }
    };

    // Handle keydown events
    const handleKeydown = (event) => {
      if (event.key === 'ArrowDown') {
        // Move down to the next card
        if (currentCardIndex.value < cardCount - 1) {
          currentCardIndex.value++;
        }
      } else if (event.key === 'ArrowUp') {
        // Move up to the previous card
        if (currentCardIndex.value > 0) {
          currentCardIndex.value--;
        }
      }
    };

    // Add event listener for keydown
    onMounted(() => {
      window.addEventListener('keydown', handleKeydown);
    });

    // Clean up the event listener
    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeydown);
    });


    return {
      isLoggedIn,
      isHomePage,
      currentCardIndex,
      startTouch,
      moveTouch,
      endTouch,
      nextCard,
      previousCard
    }
  }
};
</script>
  
  <style scoped>
  .dashboard {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    overflow-x: hidden; /* Prevent horizontal scrolling */
    margin-top: -50px;
    margin-bottom: -50px;
  }
  
  .main-content {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex: 1; /* This makes sure the content takes up remaining vertical space */
    width: 100%; /* Full width of the screen */
  }
  
  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%; /* Ensures content-wrapper takes up full width */
    padding: 10px;
    box-sizing: border-box; /* Include padding in width calculations */
  }
  
  .content-image {
    max-width: 100%; /* Ensures the image never exceeds the container width */
    height: auto;
    margin-bottom: -10px;
    margin-top: 40px;
  }
  
  .content-text {
    color: black;
    margin: 5px 0;
    font-size: 1rem;
    font-weight: bold;
    padding: 0 20px; /* Adds some spacing on the sides */
  }

  .card-container{
    height: 0px;
  }
  </style>
  