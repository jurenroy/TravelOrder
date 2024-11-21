<template>
    <div class="dashboard">
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
  </template>
  
  <script>
  import Header from '../../components/header/Header.vue';
  import Footer from '../../components/footer/Footer.vue';
  
  export default {
    name: 'Dashboard',
    components: {
      Header,
      Footer,
    },
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
    margin-bottom: 20px;
    margin-top: 50px;
  }
  
  .content-text {
    color: black;
    margin: 5px 0;
    font-size: 1.2rem;
    font-weight: bold;
    padding: 0 20px; /* Adds some spacing on the sides */
  }
  </style>
  