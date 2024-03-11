<template>
    <login v-if="!isLoggedIn" />
    <dashboard v-else />
</template>

<script setup>
 import login from './login.vue';
 import dashboard from './dashboard.vue'

 const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Parse as boolean
</script>

