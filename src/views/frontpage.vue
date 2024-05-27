<template>
  <div class="frontcontainer">
    <div class="frontpic">
      <img src="../assets/logo.png" class = "frontpic"/>
    </div>
    <div style="margin-top: 20px; font-size: 24px; font-weight: bold;">
      <p >Republic of the Philipines<br>
     Department of Environment and Natural Resources<br>
     Mines and Geosciences Bureau<br>
     Regional Office No.X</p>
<div style="display: flex; justify-content: center; margin-top: 30px;">
     <p>MGB Application Form</p>
    </div>
     <!-- <p>DENR-X Compound Puntod, Cagayan de Oro City</p>
      <p>Tel. Nos. (088) 856-2110; (088) 856-1331</p>
      <p>Email: <a href="https://region10.mgb.gov.ph/">region10.mgb.gov.ph/</a></p> -->
    </div>
    <div class="hakdogzzz">
      <button class="frontbutton"  @click="navigateTo('TravelOrder')">Travel Order Form</button>
      <button class="frontbutton" @click="navigateTo('LeaveForm')">Leave Form</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
  },
};
</script>

<style>
.frontcontainer{
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 

}
.frontbutton{
  height: 60px; 
  width: 300px; 
  font-size: 20px; 
  font-weight: bold;
  border-radius: 10px;
  margin: 10px;
}
.hakdogzzz{
    margin-top: 5px;
    display: flex;
    justify-content:space-between;
    flex-direction: row;
}
.frontpic{
  height: 400px;
}

@media (max-width: 768px) {
   .hakdogzzz{
    justify-content:center;
    flex-direction: column;
    
   }
   .frontpic{
    height: 200px;
   }
  
}

</style>