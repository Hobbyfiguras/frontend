import { mapState, mapMutations } from 'vuex'
import FigureSite from '../../api/figuresite'
export default {
  methods: {
    enableNSFW () {
      var user = JSON.parse(JSON.stringify(this.currentUser))
      if (this.currentUser) {
        user.nsfw_enabled = true
        this.$awn.async(this.makePetition(FigureSite.updateUser(user.username, user)), 'Perfil actualizado correctamente',
          'Error actualizando perfil', 'Actualizando perfil').then(() => {
          this.setCurrentUser(user)
        })
      } else {
        this.setLocalNSFW(true)
      }

      this.$toast.open('Habilitado el contenido NSFW!')
    },
    askNSFW () {
      this.$dialog.confirm({
        title: 'Contenido NSFW',
        message: 'La pagina a la que intentas entrar contiene contenido sensible no apto para menores de 18 años. ¿Quieres habilitar este tipo de contenido de ahora en adelante?',
        confirmText: 'Habilitar contenido NSFW',
        cancelText: 'No, volver atrás',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.enableNSFW(),
        onCancel: () => this.$router.go(-1)
      })
    },
    ...mapMutations('auth', ['setCurrentUser']),
    ...mapMutations('settings', ['setLocalNSFW'])
  },
  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  }
}
