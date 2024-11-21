<template>
   <div class="zerologout">
      <div class="firstlogout">
         <div class="secondlogout">
            <p class="logoutform">Are you sure you want to <br/>log out?  <span v-if="hoverYes">😞</span><span v-if="hoverNo">😎</span></p>
            <div class="buttonsslogout">
               <button class="button yeslogout" @click="logout" @mouseover="hoverYes = true" @mouseleave="hoverYes = false">Yes</button>
               <button class="button nologout" @click="handleNo" @mouseover="hoverNo = true" @mouseleave="hoverNo = false">No</button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'vue-router';
import { onMounted, onBeforeUnmount, ref } from 'vue';

const router = useRouter();
const authStore = useAuthStore();

const hoverYes = ref(false);  // Reactive state for 'Yes' button hover effect
const hoverNo = ref(false);   // Reactive state for 'No' button hover effect

const logout = () => {
   authStore.logout();
   localStorage.setItem('isLoggedIn', 'false');
   localStorage.removeItem('accountId');
   localStorage.removeItem('nameId');
   router.push("/");
   // Use setTimeout to ensure the redirection happens before reload
   setTimeout(() => {
      window.location.reload(); // Reload the page after the redirection
   }, 500); // Delay (in ms) to give the router time to complete the push
};

const handleKeyPress = (event) => {
   if (event.key === 'Enter') {
       logout();
   } else if (event.key === 'Escape') {
       handleNo();
   }
};

onMounted(() => {
   window.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
   window.removeEventListener('keydown', handleKeyPress);
});

const props = defineProps({
 show: {
   type: Boolean,
   required: true,
 },
});

const emit = defineEmits();
const handleNo = () => {
 emit('handleNo', false);
};
</script>

<style scoped>
/* Background overlay */
.zerologout {
   display: flex;
   justify-content: center;
   align-items: center;
   position: fixed;
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
   z-index: 999;
   backdrop-filter: blur(5px);
}

/* Centered modal */
.firstlogout {
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100%;
   width: 100%;
}

.secondlogout {
   background: linear-gradient(150deg, #DDC7AD, #92785b);
   border-radius: 12px;
   padding: 30px 40px;
   box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.15); /* Luxurious shadow */
   max-width: 500px;
   width: 90%;
   text-align: center;
   color: #000000; /* Light text for contrast */
   font-family: 'Helvetica Neue', sans-serif;
   animation: fadeIn 0.3s ease-out;
}

/* Title / Text styling */
.logoutform {
   font-size: 26px;
   font-weight: 600;
   color: #000000;
   margin-bottom: 20px;
}

/* Buttons container */
.buttonsslogout {
   display: flex;
   justify-content: space-around;
   margin-top: 20px;
}

/* Button styling */
.button {
   padding: 12px 30px;
   border-radius: 8px;
   font-size: 18px;
   font-weight: bold;
   border: none;
   transition: transform 0.2s, background-color 0.3s ease;
   cursor: pointer;
}

.yeslogout {
   background-color: #4caf50; /* Green for Yes */
   color: white;
}

.nologout {
   background-color: #f44336; /* Red for No */
   color: white;
}

.button:hover {
   transform: scale(1.05);
}

/* Hover effects */
.yeslogout:hover {
   background-color: #45a049; /* Darker green */
}

.nologout:hover {
   background-color: #d32f2f; /* Darker red */
}
/* Emoji styling */
.emoji {
  font-size: 30px;
  margin-left: 10px;
  transition: transform 0.3s ease;
}

/* Responsive design */
@media (max-width: 768px) {
   .secondlogout {
       width: 80%;
       padding: 20px;
   }
   .logoutform {
       font-size: 22px;
   }
}

/* Animation for fade in */
@keyframes fadeIn {
   0% {
       opacity: 0;
       transform: translateY(20px);
   }
   100% {
       opacity: 1;
       transform: translateY(0);
   }
}
</style>
