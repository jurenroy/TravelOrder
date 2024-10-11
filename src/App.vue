<template>
  <nav>
  </nav>
  <main @contextmenu.prevent>
    <router-view />
  </main>
</template>
<script lang="js">
document.addEventListener('keydown', function(event) {
  // Disable Ctrl + S (Save)
  if (event.ctrlKey && (event.key === 's' || event.key === 'S')) {
    event.preventDefault();
  }
});
</script>
<style scoped></style>
