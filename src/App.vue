<template>
    <div id="app" :class="{ 'dark': darkTheme === true}">
    <GDPRNoti/>
    <!-- HACK: Create a hidden navbar to ensure measures are correct (has-fixed-navbar-top doesn't work, I already tried) -->
    <nav class="navbar is-primary is-fixed-top" role="navigation" aria-label="main navigation">
      <AppNav/>
    </nav>
    <main class="app-content">
      <div class="container" v-if="user && isUserBanned(user)">
        <div class="notification is-danger">
          <p class="title">La has liado parda, figura.</p>
          <p>Si ves esto es porque has sido baneado del foro por algún motivo, piensa en lo que has hecho y reflexiona, principalmente deberias leerte las normas..</p>
          <p>Has sido baneado por {{user.bans[0].banner.username}} con el motivo: "{{user.bans[0].ban_reason}}"</p>
          <br/>
          <p>Serás desbaneado {{user.bans[0].ban_expiry_date | timeDiffFuture("to")}}</p>
        </div>
      </div>
      <router-view v-if="hasForumSettings"/>
    </main>
    <!--
    <Snowf
      :amount="50"
      :size="5"
      :speed="1.5"
      :wind="0"
      :opacity="0.8"
      :swing="1"
      :image="null"
      :zIndex="-1000"
      :resize="true"
      color="#AAA"
    /> -->
  <footer class="footer">
    <div class="content has-text-centered">
      <div class="columns is-centered">
        <div class="column is-2">
          <p><router-link :to="{name: 'privacy'}">Politica de privacidad</router-link></p>
        </div>
        <div class="column is-2">
          <p><a href="https://github.com/Hobbyfiguras/Hobbyfiguras">Código fuente</a></p>
        </div>
        <div class="column is-2">
          <p>Powered by <a href="http://bulma.io/">Bulma</a> and <a href="https://vuejs.org/">Vue.js</a></p>
        </div>
      </div>
      <p>
        Hobbyfiguras, un proyecto libre (Affero GPLv3) , programado por <a href="https://twitter.com/CkEIREXE">Álex Román</a> con apoyo de <a href="https://twitter.com/PikaDemigrante">Alberto Serrano</a>.
      </p>
    </div>
  </footer>
  <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import AppNav from './components/nav/nav.vue'
import GDPRNoti from './components/gdprnoti.vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import petitionsMixin from './components/mixins/petitions'
import Snowf from 'vue-snowf'
export default {
  name: 'app',
  mixins: [petitionsMixin],
  components: { AppNav, GDPRNoti, Snowf },
  data () {
    return {
      currentUser: null
    }
  },
  created () {
    if (this.hasRefreshToken) {
      console.log('get')
      this.getCurrentUser()
      this.getMessages()
      this.getUnreadNotifications()
      this.connectToNotificationsService()
    }
    this.getForumSettings()
  },
  methods: {
    ...mapActions('auth', ['getCurrentUser']),
    ...mapActions('forum', ['getForumSettings']),
    ...mapActions('notifications', ['connectToNotificationsService', 'getUnreadNotifications']),
    ...mapActions('privateMessages', ['getMessages'])
  },
  computed: {
    ...mapState({
      darkTheme: state => state.settings.darkTheme,
      user: state => state.auth.currentUser
    }),
    ...mapGetters('auth', [
      'hasAuthData',
      'hasRefreshToken'
    ]),
    ...mapGetters('forum', [
      'hasForumSettings'
    ])
  },
  metaInfo: {
    titleTemplate: (titleChunk) => {
      // If undefined or blank then we don't need the hyphen
      return titleChunk ? `${titleChunk} - Hobbyfiguras` : 'Hobbyfiguras'
    },
    meta: [
      { property: 'og:site_name', content: 'Hobbyfiguras' },
      { property: 'og:type', content: 'website' },
      { vmid: 'ogdesc', property: 'og:description', content: 'Comunidad de coleccionistas de figuras, aquí podrás encontrar tutoriales, guías, novedades, comparativa de figuras falsas, dudas, tiendas, y las ultimas noticias.' },
      { vmid: 'description', name: 'description', content: 'Comunidad de coleccionistas de figuras, aquí podrás encontrar tutoriales, guías, novedades, comparativa de figuras falsas, dudas, tiendas, y las ultimas noticias.' }
    ]
  }
}
</script>

<style lang="scss" rel='stylesheet/scss'>
@import 'sass/style.scss';
$mdi-font-path: '~@mdi/font/fonts';
@import '~@mdi/font/scss/materialdesignicons.scss';
$awn-toast-font-size: 18px !default;
@import '~vue-awesome-notifications/dist/styles/style.scss';
</style>
