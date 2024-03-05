<template>
 


  <nav>
    <!-- <router-link to="/">Login</router-link> | <router-link to="/dashboard">dashboard</router-link> |
    <router-link to="/form">form</router-link> | <router-link to="/home">home</router-link>  -->
  </nav>
  <main>
    <router-view />
  </main>
</template>

<style>
.backs{
  background-color: #3a95fc;
  color: #000000;
  padding: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

 #app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  text-align: center;
  justify-content: center ;
  /* color: #2c3e50;
  margin-top: 60px; */
} 
</style>
