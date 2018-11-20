<template>

            <div class="column is-4 is-offset-4">
                <div class="box" v-if="!postRegister">
                  <h1 class="title">Registro</h1>
                    <p class="help is-danger">{{errors.non_field_errors}}</p>
                        <b-field label="Nombre de usuario" :message="errors['username']" :type="!!errors['username'] ? 'is-danger' : ''">
                              <b-input
                                  value=""
                                  v-model="username"
                                  placeholder="Nombre de usuario"
                                  size="is-large">
                              </b-input>
                        </b-field>
                        <b-field label="Correo Electronico" :message="errors['email']" :type="!!errors['email'] ? 'is-danger' : ''">
                            <b-input type="email"
                                value=""
                                v-model="email"
                                placeholder="Correo electronico"
                                size="is-large">
                            </b-input>
                        </b-field>

                       <b-field label="Contraseña" :message="errors['password1']" :type="!!errors['password1'] ? 'is-danger' : ''">
                              <b-input type="password"
                                  v-model="password1"
                                  value=""
                                  placeholder="Contraseña"
                                  size="is-large"
                                  password-reveal>
                              </b-input>
                        </b-field>
                        <b-field label="Contraseña (otra vez)" :message="errors['password2']" :type="!!errors['password2'] ? 'is-danger' : ''">
                              <b-input type="password"
                                  v-model="password2"
                                  value=""
                                  placeholder="Contraseña (otra vez)"
                                  size="is-large"
                                  password-reveal>
                              </b-input>
                        </b-field>
                        <b-field>
                          <b-switch v-model="consent">Consiento a que Hobbyfiguras me envie correos electrónicos necesarios para el funcionamiento del sitio y de otras caracteristicas como promocionales.</b-switch>
                        </b-field>
                        <button @click="register()" class="button is-block is-primary is-large is-fullwidth">Registrarse</button>
                </div>
                <div class="box" v-else>
                  Cuenta registrada correctamente. Hemos enviado un mensaje de verificación a tu correo electrónico.
                  Si no aparece, comprueba tu carpeta de Spam.
                </div>
            </div>
</template>

<script>

import { mapActions } from 'vuex'
import petitionsMixin from '@/components/mixins/petitions'
import FigureSite from '@/api/figuresite'
export default {
  name: 'LoginPrompt',
  mixins: [petitionsMixin],
  data () {
    return {
      username: '',
      password1: '',
      password2: '',
      email: '',
      postRegister: false,
      consent: false,
      errors: {
        email: null,
        username: null,
        password1: null,
        password2: null,
        non_field_errors: null
      }
    }
  },
  methods: {
    ...mapActions('auth', ['logIn']),
    register () {
      if (!this.consent) {
        this.errors.non_field_errors = 'Es necesario aceptar el consentimiento a correos electronicos para poder registrarse en el sitio.'
      } else {
        var userData = {
          username: this.username,
          password1: this.password1,
          password2: this.password2,
          email: this.email
        }
        this.makePetition(FigureSite.registerUser(userData), false).then((response) => {
          this.postRegister = true
        }).catch((error) => {
          if (error.response.status === 400) {
            this.setErrors(error.response.data)
          }
        })
      }
    },
    getFieldMessage (fieldName) {
      if (this.errors[fieldName]) {
        return this.errors[fieldName][0]
      }
      return null
    }
  }
}
</script>

<style scoped>

.login-buttons {
  margin-top: 0.75rem;
}

</style>
