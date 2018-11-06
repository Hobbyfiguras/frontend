<template>
<section class="hero is-fullheight login-hero">
  <div class="hero-body">
    <div class="container has-text-centered">
      <div class="box" v-if="emailVerified">
        Correo verificado correctamente. Ya puedes iniciar sesión con tu cuenta.
      </div>
    </div>
  </div>
</section>
</template>

<script>
import petitionsMixin from '@/components/mixins/petitions'
import FigureSite from '@/api/figuresite'

export default {
  name: 'register',
  mixins: [petitionsMixin],
  props: ['email_key'],
  data () {
    return {
      emailVerified: false
    }
  },
  mounted () {
    this.makePetition(FigureSite.verifyEmail(this.email_key)).then((response) => {
      if (response.status === 200) {
        this.emailVerified = true
      }
    })
  }
}
</script>

<style scoped>
.login-hero {
  background-image: url('../assets/images/fondo-login.jpg');
  background-size: cover;
  background-position: center;
}
</style>
