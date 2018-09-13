<template>
<section class="hero is-fullheight login-hero">
  <div class="hero-body">
    <div class="container has-text-centered">
      <RegisterPrompt></RegisterPrompt>
    </div>
  </div>
</section>
</template>

<script>
import RegisterPrompt from '@/components/register_prompt'
export default {
  name: 'register',
  components: { RegisterPrompt }
}
</script>

<style scoped>
.login-hero {
  background-image: url('../assets/images/fondo-login.jpg');
  background-size: cover;
  background-position: center;
}
</style>
