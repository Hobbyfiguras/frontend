<template>

            <div class="column is-4 is-offset-4">
                <div class="box">
                  <h1 class="title">Iniciar sesión</h1>
                  <p class="subtitle is-size-7 help is-danger">{{errors.non_field_errors}}</p>
                        <b-field label="Nombre de usuario o correo electrónico" :message="errors['username']" :type="!!errors['username'] ? 'is-danger' : ''">
                            <div class="control">
                              <b-input
                                  value=""
                                  v-model="username"
                                  placeholder="Nombre de usuario o correo electrónico"
                                  size="is-large">
                              </b-input>
                            </div>
                        </b-field>

                        <b-field label="Contraseña" :message="errors['password']" :type="!!errors['password'] ? 'is-danger' : ''">
                          <b-input type="password"
                              v-model="password"
                              value=""
                              placeholder="Contraseña"
                              size="is-large"
                              password-reveal>
                          </b-input>
                        </b-field>
                        <button @click="doLogIn()" class="button is-block is-primary is-large is-fullwidth">Entrar</button>

                      <p class="has-text-grey login-buttons">
                          <a href="../">Registrarse</a> &nbsp;·&nbsp;
                          <router-link :to="{name: 'password_change'}">Contraseña olvidada</router-link>
                      </p>
                </div>
            </div>
</template>

<script>

import { mapActions } from 'vuex'
import FigureSite from '@/api/figuresite'
import petitionsMixin from '@/components/mixins/petitions'
export default {
  name: 'LoginPrompt',
  mixins: [petitionsMixin],
  data () {
    return {
      username: '',
      password: '',
      errors: {
        non_field_errors: ''
      }
    }
  },
  methods: {
    ...mapActions('auth', ['logIn']),
    doLogIn () {
      this.makePetition(FigureSite.login(this.username, this.password), false).then((response) => {
        this.logIn(response)
        this.getUnreadNotifications()
        this.connectToNotificationsService()
        if (this.$route.query.from) {
          this.$router.push(this.$route.query.from)
        } else {
          this.$router.push({ name: 'index' })
        }
      }).catch((error) => {
        if (error.response.status === 400) {
          this.setErrors(error.response.data)
        }
      })
    },
    ...mapActions('notifications', ['connectToNotificationsService', 'getUnreadNotifications'])
  }
}
</script>

<style scoped>

.login-buttons {
  margin-top: 0.75rem;
}

</style>
