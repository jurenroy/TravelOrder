<template>
    <footer class="footer">
      <div class="footer-content">
        <div @click="openLink('https://www.facebook.com/mgbregionxofficialpage')"> 
        <img src="./logos/facebook.png" alt="Facebook Logo" class="footer-image" /> 
        <p>Facebook Page</p>    
        </div> 
        <div @click="openLink('https://region10.mgb.gov.ph/')">
        <img src="./logos/web.png" alt="Web Logo" class="footer-image" />
        <p>MGBX Website</p>    
        </div> 
      </div>
    </footer>
  </template>
  
  <script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer',
  setup() {
    // Function to open a URL
    const openLink = (url) => {
      window.open(url, '_blank');
    };

    return {
      openLink,
    };
  },
});
</script>
  
  <style scoped>
  .footer {
    display: flex;
    justify-content: center; /* Center the content horizontally */
    align-items: center;
    padding: 10px;
    background-color: #DDC7AD;
    color: rgb(0, 0, 0);
    width: 100%;
    text-align: center;
    height: auto;
  }
  .footer-content{
    display: flex;
    justify-content: space-around;
    gap: 50px;
  }
  .footer-content div{
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: space-around;
    cursor: pointer;
  }
  
  .footer-content p {
    margin: 5px 0;
    font-size: 1rem;
    font-weight: normal;
  }
  .footer-content img {
  width: auto; /* Let the width adjust based on the image's aspect ratio */
  height: 20px; /* You can adjust the height based on your desired footer logo size */
  margin: 5px 0;
}
@media print{
    .footer{
      display: none;
    }
  }
  </style>
  