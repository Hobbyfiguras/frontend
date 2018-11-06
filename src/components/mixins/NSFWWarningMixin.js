import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  methods: {
    enableNSFW () {
      this.setNSFW(true).then(() => {
        this.$toast.open('Habilitado el contenido NSFW!')
      })
    },
    askNSFW () {
      this.$dialog.confirm({
        title: 'Contenido NSFW',
        message: 'La página a la que intentas entrar contiene material sensible no apto para menores de 18 años. ¿Quieres habilitar este tipo de contenido de ahora en adelante?',
        confirmText: 'Habilitar contenido NSFW',
        cancelText: 'No, volver atrás',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.enableNSFW(),
        onCancel: () => this.$router.go(-1)
      })
    },
    ...mapMutations('auth', ['setCurrentUser']),
    ...mapActions('settings', ['setNSFW'])
  },
  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  }
}
