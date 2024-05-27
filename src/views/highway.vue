<template>
    <login v-if="!isLoggedIn" />
    <frontpage v-else />
    <!-- <dashboard v-else /> -->
</template>

<script setup>
import login from './login.vue';
import dashboard from './dashboard.vue'
import frontpage from './frontpage.vue';

const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Parse as boolean
</script>
