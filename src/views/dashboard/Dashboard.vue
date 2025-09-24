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

  <!-- Main content with scroll event handling -->
  <div>
    <NewsFeed v-if="isLoggedIn && isHomePage" :scrollTop="scrollTop"/>
  </div>
</template>

<script>
import TravelCard from '../travelorderV2/Card.vue';
import LeaveCard from '../leaveform/Card.vue';
import ICTCard from '../ictsrf/Card.vue'
import { useAuthStore } from '@/store/auth'; // Adjust the path as necessary
import { computed, ref, onMounted, onBeforeUnmount, defineEmits, defineProps } from 'vue';
import { useRoute } from 'vue-router'; // Import useRoute
import NewsFeed from './NewsFeed/NewsFeed.vue';

export default {
  name: 'Dashboard',
  components: {
    TravelCard,
    LeaveCard,
    ICTCard,
    NewsFeed
  },
  setup() {
    const authStore = useAuthStore(); // Access the auth store
    const isLoggedIn = computed(() => authStore.isLoggedIn); // Create a computed property for isLoggedIn
    const route = useRoute(); // Get the current route

    // Computed property to check if the current path is '/'
    const isHomePage = computed(() => route.path === '/');

    // Scroll tracking
    const scrollTop = ref(0);

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

    const props = defineProps({
  scrollTop: Number  // Receiving the scrollTop prop from Layout (Grandparent)
});

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
      previousCard,
      scrollTop,
    }
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  justify-content: center;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  margin-top: 3%;
  left: 0;
  transform: translate(50% 50%);
}

.grid-container {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 20px;
  width: 100%;
  max-width: 1200px; /* Optional max width */
}

.main-header {
  text-align: center;
}

.content-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.content-text {
  font-weight: bold;
  font-size: 1rem;
  color: #000;
  text-align: center;
}

.news-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
</style>
