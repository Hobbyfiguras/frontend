<template>
      <div class="container">
      <div class="navbar-brand">
        <router-link :to="{name: 'index'}" class="navbar-item">
          Niño que ase viendo dibugito
        </router-link>
        <a role="button" class="navbar-burger" @click="toggleMenu" :class="{'is-active': navIsActive}" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" :class="{'is-active': navIsActive}">
            <div class="navbar-start">
              <router-link :to="{name: 'index'}" class="navbar-item" exact-active-class="is-active">Home</router-link>

            </div>
            <div class="navbar-end">
              <b-dropdown hoverable v-if="user">
                <a class="navbar-item" slot="trigger">
                  <figure class="image">
                      <img class="is-rounded" :src="user.avatar"/>
                  </figure>
                  {{user.username}}
                </a>
                <b-dropdown-item has-link>
                  <router-link :to="{'name': 'profile', 'params': {'username': user.username}}">
                    <b-icon icon="account"></b-icon><span style="vertical-align: middle;">Ver Perfil</span>
                  </router-link>
                </b-dropdown-item>
                <b-dropdown-item><b-icon icon="settings"></b-icon> <span style="vertical-align: middle;">Preferencias</span></b-dropdown-item>
                <b-dropdown-item><b-icon icon="logout"></b-icon> <span style="vertical-align: middle;">Salir</span></b-dropdown-item>
              </b-dropdown>
              <router-link v-else class="navbar-item" :to="{'name': 'login'}">Entrar</router-link>
              <a v-if="patreon_enabled" class="navbar-item is-paddingless patreon-link" slot="trigger" href="https://patreon.com/EIRTeam">
                <img class="patreon-image" src="../assets/images/become_a_patron_button.png" alt="">
              </a>

            </div>
        </div>
        </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import LoginPrompt from '@/components/login_prompt'
export default {
  name: 'AppNav',
  components: { LoginPrompt },
  data () {
    return {
      navIsActive: false,
      patreon_enabled: process.env.PATREON_ENABLED
    }
  },
  methods: {
    ...mapActions('settings', ['updateDarkTheme']),
    toggleMenu () {
      this.navIsActive = !this.navIsActive
    }
  },
  computed: {
    ...mapGetters('auth', [
      'isAuthenticated'
    ]),
    ...mapState({
      user: state => state.auth.currentUser
    })
  }
}
</script>

<style lang="scss" scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.patreon-image {
  max-height: 2.75rem !important;
}

.patreon-link {
  background-color: #fff !important;
}

.patreon-link:hover {
  background-color: darken(#fff, 10%) !important;
}

figure {
  display: inline-block;
  margin-right: 0.35rem;
}
</style>
