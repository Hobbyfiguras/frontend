<template>
      <div class="container">
      <Menu ref="navItem" :noOverlay="true" right>
        <div class="level is-marginless bm-top" v-if="user">
          <div class="level-left">

          </div>
          <div class="level-right bm-level-item">
            <b-icon class="badge" data-badge="2" icon="bell"></b-icon>
          </div>
        </div>
        <router-link class="level mobile-navbar-item bm-top is-top" v-if="user" :to="{'name': 'profile', 'params': {'username': user.username}}">
            <div class="level-left">
              <div class="level-item">
                <figure class="image is-64x64">
                  <img class="is-rounded" :src="user.avatar"/>
                </figure>
                <div>{{user.username}}</div>
              </div>
            </div>
            <div class="level-right">
            </div>
        </router-link>

        <router-link v-if="!user" :to="{name: 'login', query: {from: $route.path}}" class="mobile-navbar-item is-vertical-center"><b-icon icon="login"></b-icon> Entrar</router-link>
        <router-link class="mobile-navbar-item is-vertical-center" :to="{'name': 'index'}"><b-icon icon="home"></b-icon> Inicio</router-link>
        <router-link class="mobile-navbar-item is-vertical-center" :to="{'name': 'ForumIndex'}"><b-icon icon="forum"></b-icon> Foro</router-link>
      </Menu>
      <div class="navbar-brand">
        <router-link :to="{name: 'index'}" class="navbar-item">
          <img src="@/assets/logo.png" alt="">
        </router-link>
        <a role="button" class="navbar-burger" @click="toggleMenu" :class="{'is-active': navIsActive}" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu">
            <div class="navbar-start">
              <router-link :to="{name: 'index'}" class="navbar-item" exact-active-class="is-active"><b-icon icon="home"></b-icon></router-link>
              <router-link :to="{name: 'ForumIndex'}" class="navbar-item" active-class="is-active"><b-icon icon="forum"></b-icon></router-link>
            </div>
            <div class="navbar-end">
              <b-dropdown hoverable v-if="user">
                <a class="navbar-item" slot="trigger">
                  <figure class="image">
                      <img class="is-rounded navbar-avatar" :src="user.avatar"/>
                  </figure>
                  {{user.username}}
                </a>
                <b-dropdown-item has-link>
                  <router-link :to="{'name': 'profile', 'params': {'username': user.username}}">
                    <b-icon icon="account"></b-icon><span style="vertical-align: middle;">Ver Perfil</span>
                  </router-link>
                </b-dropdown-item>
                <b-dropdown-item><b-icon icon="settings"></b-icon> <span style="vertical-align: middle;">Preferencias</span></b-dropdown-item>
                <b-dropdown-item  @click="logOff()"><b-icon icon="logout"></b-icon> <span style="vertical-align: middle;">Salir</span></b-dropdown-item>
              </b-dropdown>
              <b-dropdown v-if="user">
                <a class="navbar-item badge" slot="trigger">
                  <span class="badge" data-badge="2"><b-icon class="is-vertical-center" icon="bell"></b-icon></span>
                </a>
                <b-dropdown-item has-link>
                  <router-link :to="{'name': 'profile', 'params': {'username': user.username}}">
                    <b-icon icon="account"></b-icon><span style="vertical-align: middle;">Ver Perfil</span>
                  </router-link>
                </b-dropdown-item>
              </b-dropdown>
              <router-link v-else class="navbar-item" :to="{'name': 'login', query: {from: $route.path}}">Entrar</router-link>
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
import { Menu } from 'vue-burger-menu'

export default {
  name: 'AppNav',
  components: { LoginPrompt, Menu },
  data () {
    return {
      navIsActive: false,
      patreon_enabled: process.env.PATREON_ENABLED
    }
  },
  methods: {
    ...mapActions('settings', ['updateDarkTheme']),
    ...mapActions('auth', ['logOff']),
    toggleMenu () {
      this.$nextTick(() => {
        this.$refs.navItem.openMenu()
      })
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
@import "src/sass/variables_light";

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
.navbar-burger {
  color: $white;
  &:hover {
    background-color: darken($primary, 5%);
  }
}

.mobile-navbar-item {
  padding-left: 2rem;
  color: $white;
  &:hover, &:active {
    background-color: $primary;
  }
  display: flex;
  &.is-top {
    &:hover, &:active {
      background-color: darken($info, 5%);
    }
  }
}

.level-item {
  color: $white;
}

.navbar-avatar {
  width: auto !important;
}
</style>
