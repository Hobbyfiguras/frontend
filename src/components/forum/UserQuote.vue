<template>
  <div class="quote" v-if="username && id">
    <div class="quote-top">
      <router-link :to="{name: 'PostView', params: {id: this.id}}">Cita de {{username}}</router-link>
    </div>
    <div class="quote-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['username', 'id']
}
</script>

<style scoped>
.quote-top {
  background-color: #4827A2;
  padding-left: 1.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  color: white;
}

.quote {
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  margin-bottom: 0.5rem;
}
.quote-content {
  padding-left: 1.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.coontent {
  margin-left: 0;
}
</style>
