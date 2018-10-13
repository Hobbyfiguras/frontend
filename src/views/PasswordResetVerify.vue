<template>
<section class="hero is-fullheight login-hero">
  <div class="hero-body">
    <div class="container has-text-centered">
      <div class="column is-4 is-offset-4">
          <div class="box" v-if="!postReset">
            <h1 class="title">Cambio de contraseña</h1>
              <p class="help is-danger">{{errors.non_field_errors}}</p>
                  <b-field label="Nueva contraseña" :message="errors['new_password1']" :type="!!errors['new_password1'] ? 'is-danger' : ''">
                        <b-input type="password"
                            value=""
                            v-model="payload.new_password1"
                            placeholder="Nueva contraseña"
                            size="is-large"
                            password-reveal>
                        </b-input>
                  </b-field>
                  <b-field label="Nueva contraseña (otra vez)" :message="errors['new_password2']" :type="!!errors['new_password2'] ? 'is-danger' : ''">
                        <b-input type="password"
                            value=""
                            v-model="payload.new_password2"
                            placeholder="Nueva contraseña (otra vez)"
                            size="is-large"
                            password-reveal>
                        </b-input>
                  </b-field>
                  <button @click="change()" class="button is-block is-primary is-large is-fullwidth">Enviar</button>
          </div>
          <div class="box" v-else>
            Contraseña cambiada con exito, ya puedes entrar.
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
  name: 'password_reset_verifyr',
  mixins: [petitionsMixin],
  data () {
    return {
      postReset: false,
      payload: {
        new_password1: '',
        new_password2: ''
      },
      errors: {
        new_password1: '',
        new_password2: ''
      }
    }
  },
  methods: {
    change () {
      if ('uid' in this.$route.query && 'token' in this.$route.query) {
        let payload = { ...this.payload, ...{ uid: this.$route.query.uid, token: this.$route.query.token } }
        console.log(payload)
        this.makePetition(FigureSite.resetPassword(payload), false).then((response) => {
          this.postReset = true
        }).catch((error) => {
          if (error.response.status === 400) {
            this.setErrors(error.response.data)
          }
        })
      }
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
