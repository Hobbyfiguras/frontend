<template>
    <div id="app" :class="{ 'dark': darkTheme === true}">
    <GDPRNoti/>
    <!-- HACK: Create a hidden navbar to ensure measures are correct (has-fixed-navbar-top doesn't work, I already tried) -->
    <nav class="navbar is-primary is-fixed-top" role="navigation" aria-label="main navigation">
      <AppNav/>
    </nav>

    <main class="app-content">
      <router-view/>
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
import AppNav from './components/nav.vue'
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
    if (this.hasAuthData) {
      console.log('get')
      this.getCurrentUser()
    }
  },
  methods: {
    ...mapActions('auth', ['getCurrentUser'])
  },
  computed: {
    ...mapState({
      darkTheme: state => state.settings.darkTheme
    }),
    ...mapGetters('auth', [
      'hasAuthData'
    ])
  },
  metaInfo: {
    name: 'Hobbyfiguras',
    titleTemplate: (titleChunk) => {
      // If undefined or blank then we don't need the hyphen
      return titleChunk ? `${titleChunk} - Hobbyfiguras` : 'Hobbyfiguras'
    }
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
