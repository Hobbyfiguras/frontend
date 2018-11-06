<template>
<div class="container">
  <div class="tile is-ancestor">
    <div class="tile is-vertical is-12">
      <div class="tile">
        <div class="tile is-parent is-vertical card">
          <div class="columns">
            <div class="column">
              <p class="title">Datos de cuenta</p>
              <b-field label="Correo electrónico">
                <b-input v-model="userData.email"></b-input>
              </b-field>
            </div>
            <div class="column">
              <p class="title">Contenido</p>
              <b-switch v-model="userData.nsfw_enabled">Mostrar contenido para adultos</b-switch>
            </div>
          </div>
          <div class="is-divider"></div>
          <div class="container">
            <a class="button is-primary" @click="updateUser">Aceptar</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import FigureSite from '@/api/figuresite'

export default {
  data () {
    return {
      userData: null
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
    updateUser () {
      console.log(JSON.stringify(this.userData))
      FigureSite.updateUser(this.userData.username, this.userData).then(() => {
        this.setCurrentUser(this.userData)
        this.$awn.success('Datos actualizados con exito')
      })
    },
    ...mapMutations('auth', ['setCurrentUser'])
  }
}
</script>

<style scoped>

</style>
