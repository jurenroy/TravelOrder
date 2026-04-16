<template>
  <div class="card">
    <h4>Total Leave Hours</h4>
    <h3>{{ summary.total_leave_hours }}</h3>
  </div>
</template>

<script>
export default {
  props: ["summary"],
};
</script>

<style>
.card {
  background: #f3f3f3;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 350px;
}
</style>
