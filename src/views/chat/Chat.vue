<template>
    <div class="chat-container">
      <div class="sender">{{ sender }}</div>
      <div class="messages">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="msg.sender === sender ? 'message right' : 'message left'"
        >
          <strong>{{ msg.sender }}:</strong> {{ msg.message }}
        </div>
      </div>
      <div class="input-container">
        <input
          type="text"
          v-model="message"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
        />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        message: '',
        messages: [],
        socket: null,
        sender: this.generateRandomString(10), // Hardcoded sender for demonstration
      };
    },
    methods: {
      generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters[randomIndex];
        }
        return result;
      },
      sendMessage() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ message: this.message, sender: this.sender }));
          this.message = ''; // Clear the input field after sending
        } else {
          console.error('WebSocket is not open or no match found.');
        }
      },
      setupWebSocket() {
        this.socket = new WebSocket('ws://172.31.10.156:8000/ws/chat/');
  
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
        };
  
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.messages.push({ sender: data.sender, message: data.message });
        };
  
        this.socket.onclose = (event) => {
          console.log('WebSocket closed:', event);
        };
  
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      },
    },
    mounted() {
      this.setupWebSocket();
    },
    beforeDestroy() {
      if (this.socket) {
        this.socket.close();
      }
    },
  };
  </script>
  
  <style scoped>
  .chat-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .sender {
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .messages {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: white;
  }
  
  .message {
    margin-bottom: 5px;
  }
  
  .right {
    text-align: right;
    color: green;
  }
  
  .left {
    text-align: left;
    color: blue;
  }
  
  .input-container {
    display: flex;
  }
  
  input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
    padding: 10px;
    background-color: #008000;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #005700;
  }
  </style>