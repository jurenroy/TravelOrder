<template>
  <div class="title">
      <div class="navigationz">
          <p class="headerzz">Admin Request Slip</p>
          <button class="add-button" @click="toggleForm">{{ isVisible ? 'Close Form' : 'Add Form' }}</button>
      </div>
  </div>
  <tablez class="tablex" v-if="!isVisible"/>
  <addforms class="formz" v-if="isVisible"/>
</template>


<script setup>
import addforms from './requestform.vue';
import tablez from './Table.vue';
</script>

<script>
import { ref } from 'vue';
const isVisible = ref(false);

// visible sa  Add form
const toggleForm = () => {
  isVisible.value = !isVisible.value;
};
</script>


<style>

</style>