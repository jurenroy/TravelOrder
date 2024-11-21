<template>
    <div class="layout">
      <Header />
      <main class="main-content">
        <router-view />  <!-- This is where the page content will be injected -->
      </main>
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from '../../components/header/Header.vue';
  import Footer from '../../components/footer/Footer.vue';
  
  export default {
    name: 'Layout',
    components: {
      Header,
      Footer
    }
  };
  </script>
  
  <style scoped>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;  /* Ensures the layout covers the full height of the screen */
  }
  
  .main-content {
    flex: 1;  /* Makes the content area expand and contract with screen size */
    padding: 20px;
    box-sizing: border-box;
  }
  </style>
  