<template>
<section class="hero is-fullheight login-hero">
  <div class="hero-body">
    <div class="container has-text-centered">
      <LoginPrompt></LoginPrompt>
    </div>
  </div>
</section>
</template>

<script>
import LoginPrompt from '@/components/login_prompt'
export default {
  name: 'login',
  components: { LoginPrompt }
}
</script>

<style scoped>
.login-hero {
  background-image: url('../assets/images/fondo-login.jpg');
  background-size: cover;
  background-position: center;
}
</style>
