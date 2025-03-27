<template>
  <div class="chat-container">
    <div class="header">
      <div class="sender">{{ getName(parseInt($props.receiver)) }}</div>
      <button class="close-button" @click="closeChat">X</button>
    </div>
    <div class="messages" ref="messagesContainer">
      <div
        v-for="(msg, index) in filteredMessages"
        :key="index"
        class="message"
      >
        <div v-if="msg.sender !== authStore.name_id && shouldDisplaySenderName(index, msg.sender)" class="receiver-name">
          {{ getName(parseInt(msg.sender)) }}
        </div>
        <div :class="['message-content', msg.sender === authStore.name_id ? 'right' : 'left']">
          <p class="message-text">{{ msg.message }}</p>
        </div>
        
        <div v-if="msg.sender === authStore.name_id && index === filteredMessages.length - 1" class="status">
          {{ seen ? 'Sent' : '' }}
        </div>
      </div>
    </div>
    <div class="input-container">
      <input
        type="text"
        v-model="message"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
        @click="readMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
    <!-- <div  class="microscopic-div"> <Card/> s</div> -->
    
  </div>
</template>

  
  <script>
  import chatnotif from '../../assets/chatnotif.mp3'
  import { useAuthStore } from '@/store/auth';
  import { API_BASE_URL } from '@/config';
  import axios from 'axios';
  import Card from '../travelorderV2/Card.vue';
  
  export default {
    props: {
      sender: {
        type: Number,
        required: true,
      },
      receiver: {
        type: Number,
        required: true,
      },
    },
    components: {
      Card,
    },
    data() {
      return {
        message: '',
        messages: [],
        socket: null,
        authStore: useAuthStore(),
        names: {},
        seen: true
      };
    },
    computed: {
      filteredMessages() {
        return this.messages.filter(msg => 
          (msg.sender === this.sender && msg.receiver === this.receiver) ||
          (msg.sender === this.receiver && msg.receiver === this.sender)
        );
      },
    },
    methods: {
      closeChat() {
      this.$emit('close-chat', { sender: this.sender, receiver: this.receiver }); // Emit an event to close the chat
    },
      shouldDisplaySenderName(index, senderId) {
      // Check if this is the first message or if the previous message was from a different sender
      if (index === 0) return true; // Always show the first message's sender
      return this.filteredMessages[index - 1].sender !== senderId; // Show if the previous message is from a different sender
    },
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
    scrollToBottom() {
      const container = this.$refs.messagesContainer; // Reference to the messages container
      container.scrollTop = container.scrollHeight; // Scroll to the bottom
    },
      async sendMessage() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          const formData = new FormData();
        
          // Append the necessary fields
          formData.append('sender_id', this.sender); // Assuming you have this data
          formData.append('receiver_id', this.receiver); // Assuming you have this data
          formData.append('content', this.message); // The content of the message
          try {
            const response = await axios.post(`${API_BASE_URL}/message`, formData);
            const data = response.data;
            console.log(data)

            
          } catch (error) {
              console.error('Error sending message:', error);
              // Handle error (e.g., show a notification)
          }
          this.socket.send(JSON.stringify({ message: this.message, sender: this.sender, receiver: this.receiver }));
            this.message = ''; // Clear the input field after sending
            this.scrollToBottom();
        } else {
          console.error('WebSocket is not open or no match found.');
        }
      },
      setupWebSocket() {
        this.socket = new WebSocket('ws://202.137.117.84:8012/ws/chat/');
  
        this.socket.onopen = () => {
          console.log('WebSocket connection established', this.$props.sender, this.$props.receiver);
        };
  
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          // Check if the message is relevant to the current chat
          if ((data.sender === this.sender && data.receiver === this.receiver) ||
              (data.sender === this.receiver && data.receiver === this.sender)) {
            this.messages.push({ sender: data.sender, receiver: data.receiver, message: data.message });
          }
          if (data.receiver === this.sender){
            this.playAudio();
          }
        };
  
        this.socket.onclose = (event) => {
          console.log('WebSocket closed:', event);
        };
  
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      },
      fetchNames() {
        axios.get(`${API_BASE_URL}/get_names_json`)
          .then(response => {
            this.names = response.data;
          })
          .catch(error => {
            console.error('Error fetching names:', error);
          });
      },
      async readMessage() {
        const read = await axios.get(`${API_BASE_URL}/readmessage/${this.sender}/${this.receiver}/`);
        console.log(read)
      },
      async fetchMessages() {
      try {
        
        // Construct the URL using sender and receiver IDs
        const response = await axios.get(`${API_BASE_URL}/message/${this.sender}/${this.receiver}/`);
        
        // Assuming response.data is an array of messages
        const data = response.data;
        

        // Push each message into the messages array
        data.forEach(message => {
          this.messages.push({
            sender: message.sender_id,
            receiver: message.receiver_id,
            message: message.content,
          });
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
        // Handle error (e.g., show a notification)
      }
    },
    checkAndFetchMessages() {
      // Check if both sender and receiver are valid
      if (this.sender && this.receiver) {
        this.messages = []; // Clear the messages array
        this.fetchMessages(); // Call fetchMessages if both are valid
        this.readMessage()
      }
    },
      getName(nameId) {
        const name = this.names[nameId - 1];
        if (name) {
          const { first_name, middle_init, last_name } = name;
          return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
        }
        return 'Unknown';
      },
    },
    watch: {
      // Watch for changes in sender and receiver
      // sender: 'checkAndFetchMessages',
      sender(newVal, oldVal) {
        this.readMessage()
        // this.checkAndFetchMessages();
      },
      receiver(newVal, oldVal) {
        this.readMessage()
        // this.checkAndFetchMessages();
      },
      filteredMessages() {
      // Automatically scroll to the bottom when filteredMessages changes
      this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
    },
    mounted() {
      this.setupWebSocket();
      this.fetchNames();
      this.fetchMessages();
      this.createAudio();
      this.readMessage();
    },
    beforeDestroy() {
      if (this.socket) {
        this.socket.close();
      }
    },
  };
  </script>
  
  <style scoped>
  .microscopic-div {
      
      transform: scale(.7); /* Scale down the content */
      border: 1px solid black;
    }
  .chat-container {
    max-width: 390px;
    padding: 20px;
    background: linear-gradient(to right, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    width: 390px;
    height: 500px;
    font-size: 14px;
  }
  
  .header {
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 10px;
    display: flex; /* Use flexbox for alignment */
    justify-content: space-between; /* Space between sender name and close button */
    align-items: center; /* Center items vertically */
  }
  
  .sender {
    font-weight: bold;
    font-size: 1.2em;
    color: #333;
  }
  .close-button {
    background: none; /* No background */
    border: none; /* No border */
    color: #ff0000; /* Red color for the close button */
    font-size: 1.2em; /* Font size */
    cursor: pointer; /* Pointer cursor */
  }
  
  .close-button:hover {
    color: #ffffff; /* Darker red on hover */
    background-color: red;
  }
  
  .messages {
    flex: 1;
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f7f7f7;
    border-radius: 8px;
    height: 370px;
  }
  
  .message {
    margin-bottom: -10px;
    padding: 8px;
    border-radius: 5px;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .right {
    background-color: #b8860b;
    align-self: flex-end;
  }
  
  .left {
    background-color: #f0c36d;
    align-self: flex-start;
  }
  .message-content {
  padding: 10px;
  border-radius: 5px;
}

.message-content p {
  margin: 0; /* Remove default margin */
}
  
  .status {
    font-size: 0.8em;
    color: #888;
    bottom: 0px;
    margin-left: auto;
  }
  
  .input-container {
    display: flex;
    margin-top: 10px;
  }
  
  input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
    margin-right: 10px;
  }
  
  button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
  }
  
  button:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
  .chat-container {
    transform: translate(0px, -80px);
  }
  @media (max-width: 400px) {
  .chat-container {
    width: 100%;
  }
}
}
  </style>