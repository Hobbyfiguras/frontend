<template>
    <div id="app" :class="{ 'dark': darkTheme === true}">
    <GDPRNoti/>
    <!-- HACK: Create a hidden navbar to ensure measures are correct (has-fixed-navbar-top doesn't work, I already tried) -->
    <nav class="navbar is-primary is-fixed-top" role="navigation" aria-label="main navigation">
      <AppNav/>
    </nav>

    <main class="app-content">
      <router-view v-if="hasForumSettings"/>
    </main>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <router-link :to="{name: 'privacy'}">Politica de privacidad</router-link>
      </p>
    </div>
    <div class="content has-text-centered">
      <p>
        Pagina web programada por Álex Román Nuñez con ayuda de Alberto Serrano
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
export default {
  name: 'app',
  mixins: [petitionsMixin],
  components: { AppNav, GDPRNoti },
  data () {
    return {
      currentUser: null
    }
  },
  created () {
    if (this.hasRefreshToken) {
      console.log('get')
      this.getCurrentUser()
      this.getUnreadNotifications()
      this.connectToNotificationsService()
    }
    this.getForumSettings()
  },
  methods: {
    ...mapActions('auth', ['getCurrentUser']),
    ...mapActions('forum', ['getForumSettings']),
    ...mapActions('notifications', ['connectToNotificationsService', 'getUnreadNotifications'])
  },
  computed: {
    ...mapState({
      darkTheme: state => state.settings.darkTheme
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
    name: 'Hobbyfiguras',
    titleTemplate: (titleChunk) => {
      // If undefined or blank then we don't need the hyphen
      return titleChunk ? `${titleChunk} - Hobbyfiguras` : 'Hobbyfiguras'
    },
    meta: [
      { property: 'og:site_name', content: 'Hobbyfiguras' },
      { property: 'og:type', content: 'website' }
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
