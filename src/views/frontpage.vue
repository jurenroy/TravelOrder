<template>
  <div class="frontcontainer">
    <div style="height: auto; width: auto; ">
      <img src="../assets/logo.png" class="frontpic" style="height: 500px;" />
    </div>
    <div style="margin-top: 10px;">
      <p>Republic of the Philipines</p>
      <p>Department of Environment and Natural Resources</p>
      <p>Mines and Geosciences Bureau</p>
      <p>Regional Office No.X</p>
      <!-- <p>DENR-X Compound Puntod, Cagayan de Oro City</p>
      <p>Tel. Nos. (088) 856-2110; (088) 856-1331</p>
      <p>Email: <a href="https://region10.mgb.gov.ph/">region10.mgb.gov.ph/</a></p> -->
    </div>
    <div
      style="margin-top: 70px; width: 1000px; height: auto; display: flex; justify-content: space-between;">
      <button class="frontbutton"  @click="navigateTo('TravelOrder')">Travel Order Fozrm</button>
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
  display: flex; flex-direction: column; justify-content: center; align-items: center; 
  
}
.frontbutton{
  height: 60px; 
  width: 300px; 
  font-size: 30px; 
  font-weight: bold;
  border-radius: 10px;

}

@media screen and (max-width: 700px) {
  .frontcontainer{
 display: flex; flex-direction: column; justify-content: center; align-items: center; 
}
.frontpic{
  height: 20px;
}
  .frontbutton{  height: 60px; 
  width: 300px; 
  font-size: 30px; 
  font-weight: bold;
  border-radius: 10px;}

}
</style>