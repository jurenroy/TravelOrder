<template>
    <div class="sidebar">
      <div class="sticky-header">
        
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search users..."
          class="search-input"
        />
      </div>
      <div v-if="searchQuery && filteredUsersSearch.length > 0">
        <div
            v-for="(user, index) in filteredUsersSearch"
            :key="user.name_id"
            class="user"
            @click="startChat(user.name_id)"
          >
            {{ getName(user) }}
        </div>
      </div>
      <div v-else-if="searchQuery">
          <p>No users found.</p>
        </div>
      <div v-if="isUserListVisible">
        <!-- above is search user below is the messages or unread -->
        <div
          v-for="(name, index) in filteredUsers"
          :key="index"
          class="user"
          @click="startChat(name.name_id)"
        >
          {{ getName(name) }} 
        <span v-if="unreadMessages[name.name_id] > 0">
          ({{ unreadMessages[name.name_id] }} unread)
        </span>
        </div>
        </div>
    </div>
  </template>
  
  <script>
  import chatnotif from '../../assets/chatnotif.mp3'
     import axios from 'axios';
     import { API_BASE_URL } from '@/config';
  import { useAuthStore } from '@/store/auth';
  import { useChatStore } from '@/store/chat';
 
  
  export default {
    data() {
      return {
        names: [],  // Initialize as an empty array
        authStore: useAuthStore(),
        chatStore: useChatStore(),
        unreadMessages: {}, // Track unread messages for each user
        searchQuery: '', // Search query for filtering users
        isUserListVisible: true, // Track visibility of the user list
      };
    },
    methods: {
      createAudio() {
      // Create an audio element dynamically
      this.audio = new Audio(chatnotif); // Path to your audio file
      this.audio.loop = false; // Set to true if you want it to loop
    },
    playAudio() {
      if (this.audio) {
        this.audio.currentTime = 0; // Reset audio to start
        this.audio.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    },
    toggleUserList() {
      this.isUserListVisible = !this.isUserListVisible; // Toggle visibility
      this.searchQuery = ''
    },
    show(){
      this.chatStore.toggleShow()
      this.$emit('show')
    },
      startChat(receiverId) {
        // Emit an event or call a method to open the chat with the selected user
        this.$emit('start-chat', {
          sender: this.authStore.name_id,
          receiver: receiverId,
        });
        // Reset unread messages when starting a chat
        if (this.unreadMessages[receiverId] !== undefined) {
        this.unreadMessages[receiverId] = 0;
        }
        this.searchQuery = ''
        console.log(`${this.authStore.name_id}/${receiverId}`)
        axios.get(`${API_BASE_URL}/readmessage/${this.authStore.name_id}/${receiverId}/`)
        .then(response => {
          console.log(response.data)
        });
      },
      getName(user) {
        // Assuming user is an object with first_name, middle_init, and last_name
        const { first_name, middle_init, last_name } = user;
        return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
      },
      fetchNames() {
        axios.get(`${API_BASE_URL}/get_names_json`)
          .then(response => {
            console.log(response.data)
            this.names = response.data;  // Assuming the response is an array of user objects
          })
          .catch(error => {
            console.error('Error fetching names:', error);
          });
      },
      setupWebSocket() {
        this.socket = new WebSocket('ws://202.137.117.84:8012/ws/chat/');

        this.socket.onopen = () => {
          console.log('WebSocket connection established');
        };

        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('received', this.unreadMessages)
          console.log(data)
            // Emit the event to increment unread messages for the sender
            if (data.receiver === this.authStore.name_id) {
            // this.increment-unread-messages(data.sender);
              if (this.unreadMessages[data.sender]) {
                this.unreadMessages[data.sender]++;
              } else {
                this.unreadMessages[data.sender] = 1; // Initialize if not present
              }
              // Play the audio after successfully sending the message
              if (data.receiver == this.authStore.name_id){
              this.playAudio();}
            }
        };
      },
      async fetchUnreadMessages() {
    try {
        const response = await axios.get(`${API_BASE_URL}/message/${this.authStore.name_id}/`);
        const data = response.data;

        // Convert the object to an array of entries and sort it by key
        const sortedUnreadMessages = Object.entries(data).sort(([keyA], [keyB]) => keyA - keyB);

        // If you want to convert it back to an object, you can do so
        this.unreadMessages = Object.fromEntries(sortedUnreadMessages);

        console.log(this.unreadMessages);
        console.log(this.authStore.name_id);
        console.log(response);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}
    },
    computed: {
      filteredUsers() {
        return this.names.filter(user => {
          // Check if the user's name_id exists in the unreadMessages object
          return this.unreadMessages.hasOwnProperty(user.name_id.toString()) && this.unreadMessages[user.name_id] > 0;
          return this.unreadMessages.hasOwnProperty(user.name_id.toString());
        }).sort((a, b) => {
        // Sort by the number of unread messages in descending order
        return (this.unreadMessages[b.name_id] || 0) - (this.unreadMessages[a.name_id] || 0);
      });
      },
      filteredUsersSearch() {
        return this.names.filter(user => {
          const fullName = this.getName(user).toLowerCase();
          return fullName.includes(this.searchQuery.toLowerCase());
        }).slice(0, 3); // Limit the result to the top 3 users;
      },
      totalUnreadMessages() {
    // Count how many users have unread messages greater than 0
    return Object.values(this.unreadMessages).filter(count => count > 0).length;
    },
    },
    mounted() {
      this.fetchUnreadMessages();
      this.setupWebSocket();
      this.fetchNames();
      this.createAudio();
    },
    beforeDestroy() {
      if (this.socket) {
        this.socket.close();
      }
    },
    watch: {
      totalUnreadMessages(newVal) {
        this.$emit('update:unreadMessages', newVal);
      }
    }
  };
  </script>
  
  <style scoped>
.sidebar {
    width: 100%; /* Sidebar takes full width of the viewport */
    
    /* You can add other styles here */
}

/* Optional: Add styles for smaller screens if needed */
@media screen and (max-width: 800px) {
    .sidebar {
        /* You can adjust styles for smaller screens if necessary */
        /* For example, you might want to change the background color */
        background-color: lightgray;
        flex-grow: 1;
        position:fixed;
    }
}
  
  .sticky-header {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick to the top of the sidebar */
    background: linear-gradient(to bottom, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
    z-index: 10; /* Ensure it stays above other content */
    margin-left: -5px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: 10px;
  }
  
  .user {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    background: linear-gradient(150deg, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
    border-radius: 10px;
    margin: 5px;
  }
  
  .user:hover {
    background-color: #e0e0e0;
  }
  .search-input {
  width: 100%; /* Full width */
  padding: 10px 15px; /* Padding for better spacing */
  border: 2px solid #ccc; /* Light gray border */
  border-radius: 5px; /* Rounded corners */
  font-size: 16px; /* Font size */
  transition: border-color 0.3s ease; /* Smooth transition for border color */
  outline: none; /* Remove default outline */
  margin-top: 50px;
}

.search-input::placeholder {
  color: #aaa; /* Placeholder text color */
  opacity: 1; /* Ensure full opacity */
}

.search-input:focus {
  border-color: #000000; /* Change border color on focus */
  box-shadow: 0 0 5px rgba(55, 55, 56, 0.5); /* Add shadow effect */
}
  </style>