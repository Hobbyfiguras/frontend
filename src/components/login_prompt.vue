<template>

            <div class="column is-4 is-offset-4">
                <div class="box">
                  <h1 class="title">Entrar</h1>
                        <div class="field">
                            <div class="control">
                              <b-input type="email"
                                  value=""
                                  v-model="username"
                                  placeholder="Correo electronico o nombre de usuario"
                                  size="is-large">
                              </b-input>
                            </div>
                        </div>

                        <div class="field">
                            <div class="control">
                              <b-input type="password"
                                  v-model="password"
                                  value=""
                                  placeholder="Contraseña"
                                  size="is-large"
                                  password-reveal>
                              </b-input>
                            </div>
                        </div>
                        <div class="field">
                    <b-checkbox>
                        Recuerdame
                    </b-checkbox>
                        </div>
                        <button @click="logIn({username: username, password: password})" class="button is-block is-primary is-large is-fullwidth">Entrar</button>

                      <p class="has-text-grey login-buttons">
                          <a href="../">Registrarse</a> &nbsp;·&nbsp;
                          <a href="../">Contraseña olvidada</a>
                      </p>
                </div>
            </div>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  name: 'LoginPrompt',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    ...mapActions('auth', ['logIn'])
  }
}
</script>

<style scoped>

.login-buttons {
  margin-top: 0.75rem;
}

</style>
