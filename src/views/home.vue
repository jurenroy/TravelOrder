<template>
   <div>
      <alerz />

      <div>
         <p class="travel">Travel Order</p>
         <div style="display: flex; justify-content: center;" v-if="isVisible">
            <formzz></formzz>
         </div>
      </div>

   </div>
</template>

<script setup>
import alerz from '../components/heder2.vue'

</script>




<style scoped>
.travel {
   font-weight: bold;
   font-size: 40px;
   margin-top: 90px;
}

.add {
   margin-top: -19px;
   margin-bottom: 13px;
   height: auto;
   width: 150px;
   padding: 5px;
   border-radius: 10px;
   font-size: 20px;
   font-weight: bold;
   box-shadow: 7px 7px 12px black;
   cursor: pointer;
}
</style>