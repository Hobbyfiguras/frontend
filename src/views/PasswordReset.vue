<template>
<section class="hero is-fullheight login-hero">
  <div class="hero-body">
    <div class="container has-text-centered">
      <div class="column is-4 is-offset-4">
          <div class="box" v-if="!postReset">
            <h1 class="title">Cambio de contraseña</h1>
              <p class="help is-danger">{{errors.non_field_errors}}</p>
                  <b-field label="Correo electrónico" :message="errors['email']" :type="!!errors['email'] ? 'is-danger' : ''">
                        <b-input
                            value=""
                            v-model="payload.email"
                            placeholder="Correo electrónico"
                            size="is-large">
                        </b-input>
                  </b-field>
                  <button @click="change()" class="button is-block is-primary is-large is-fullwidth">Enviar</button>
          </div>
          <div class="box" v-else>
            Se ha enviado un correo para cambiar la contraseña.
          </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import petitionsMixin from '@/components/mixins/petitions'
import FigureSite from '@/api/figuresite'

export default {
  name: 'password_reset',
  mixins: [petitionsMixin],
  data () {
    return {
      postReset: false,
      payload: {
        email: ''
      },
      errors: {
        email: ''
      }
    }
  },
  methods: {
    change () {
      this.makePetition(FigureSite.requestResetPassword(this.payload), false).then((response) => {
        this.postReset = true
      }).catch((error) => {
        if (error.response.status === 400) {
          this.setErrors(error.response.data)
        }
      })
    }
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
