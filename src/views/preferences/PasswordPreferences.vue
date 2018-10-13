<template>
<div class="container">
  <div class="tile is-ancestor">
    <div class="tile is-vertical is-12">
      <div class="tile">
        <div class="tile is-parent is-vertical card">
          <div class="columns">
            <div class="column">
              <p class="title">Contraseña</p>
              <p class="help is-danger">{{errors.non_field_errors}}</p>
              <b-field label="Nueva contraseña" :message="errors['new_password1']" :type="!!errors['new_password1'] ? 'is-danger' : ''">
                <b-input
                v-model="payload.new_password1"
                placeholder="Nueva contraseña"
                type="password"
                password-reveal>
                </b-input>
              </b-field>
              <b-field label="Nueva contraseña (otra vez)" :message="errors['new_password2']" :type="!!errors['new_password2'] ? 'is-danger' : ''">
                <b-input
                v-model="payload.new_password2"
                type="password"
                placeholder="Nueva contraseña (otra vez)"
                password-reveal>
                </b-input>
              </b-field>
            </div>
          </div>
          <div class="is-divider"></div>
          <div class="container">
            <a class="button is-primary" @click="change">Aceptar</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import FigureSite from '@/api/figuresite'
import PetitionsMixin from '@/components/mixins/petitions'

export default {
  mixins: [PetitionsMixin],
  data () {
    return {
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
  created () {
    this.userData = JSON.parse(JSON.stringify(this.currentUser))
  },
  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },
  methods: {
    change () {
      this.makePetition(FigureSite.changePassword(this.payload), false).then((data) => {
        console.log(data)
        this.$awn.success('Contraseña cambiada con exito.')
      }).catch((err) => {
        this.setErrors(err.response.data)
      })
    }
  }
}
</script>

<style scoped>

</style>
