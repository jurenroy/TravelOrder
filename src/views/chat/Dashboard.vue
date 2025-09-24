<template>
  <div class="chat-app">
    <Sidebar ref="sidebar" :style="dynamicStyle" v-if="names" @start-chat="initiateChat" :names="names" @show="show" @update:unreadMessages="handleUnreadMessages"/>
    <div class="chat-main-container">
      
      <ChatMain
        v-for="(chat, index) in activeChats"
        :key="index"
        :sender="chat.sender"
        :receiver="chat.receiver"
        @close-chat="closeChat(chat)"
        class="chat-container"
      />
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue';
import ChatMain from './ChatMain.vue';
import { useChatStore } from '@/store/chat';

export default {
  components: {
    Sidebar,
    ChatMain,
  },
  data() {
    return {
      names: [],
      activeChats: [], // Array to hold active chat sessions
      chatStore: useChatStore(),
      unreadMessagesCount: 0,
      isActive: false
    };
  },
  computed: {
    showSide(){
      console.log(this.chatStore.show)
      return this.chatStore.show
    },
    dynamicStyle() {
      return {
        opacity: this.showSide ? '100%' : '0%' // Conditional styling
      };
    }
  },
  mounted() {
        document.addEventListener('click', this.resetChatApp);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.resetChatApp);
    },
  methods: {
    activateChatApp(event) {
            this.isActive = true;
            event.stopPropagation(); // Prevent click from bubbling up
        },
        resetChatApp() {
            this.isActive = false;
        },
    initiateChat({ sender, receiver }) {
      // Check if the chat already exists
      const existingChat = this.activeChats.find(chat => 
        (chat.sender === sender && chat.receiver === receiver) || 
        (chat.sender === receiver && chat.receiver === sender)
      );

      // if (existingChat !== -1) {
      //   // If the chat exists, remove it from the array
      //   this.activeChats.splice(existingChat, 1);
      // }
      
      // If limit reached, remove the oldest chat
      if (this.activeChats.length >= 3) {
        this.activeChats.shift(); // remove the first (oldest) chat
      }

      // Add the new chat session
      this.activeChats.push({ sender, receiver });

      // Optionally, you can bring the existing chat to the front or handle it differently
      console.log('New chat initiated:', { sender, receiver });
    },
    
    closeChat(chatToClose) {
      // Remove the chat from activeChats
      this.activeChats = this.activeChats.filter(chat => 
        (chat.sender !== chatToClose.sender || chat.receiver !== chatToClose.receiver) &&
        (chat.sender !== chatToClose.receiver || chat.receiver !== chatToClose.sender)
      );
    },
    handleUnreadMessages(count) {
      this.$emit('update:unreadMessages', count);
    }
  },
};
</script>

<style scoped>
.chat-app {
  display: flex;
  flex-direction: row;
  justify-content: flex-end; /* Align items to the right */
  top: 0;
  right: 0;
  z-index: 900;
  height: 50%;
}

.chat-app.inactive {
  pointer-events: none;
}


.chat-main-container {
  position: absolute;
  display: flex;
  flex-direction: row; /* Arrange chat windows in a row */
  align-items: flex-end; /* Align chat windows to the bottom */
  bottom: 0; /* Align to the bottom */
}

.chat-container {
  background-color: orange;
  margin-left: 10px; /* Space between chat windows */
  /* Add any other styles for chat containers here */
}

@media print{
  .chat-app{
    display: none;
  }
}
</style>