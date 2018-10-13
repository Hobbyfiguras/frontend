<template>
    <div class="container">
        <div class="tabs is-centered">
            <ul>
                <li :class="{ 'is-active': $route.name === 'preferences' }">
                    <router-link :to="{name: 'preferences'}">
                        <b-icon icon="account"></b-icon>
                        <span>Cuenta</span>
                    </router-link>
                </li>
                <li :class="{ 'is-active': $route.name === 'preferences_password' }">
                    <router-link :to="{name: 'preferences_password'}">
                        <b-icon icon="key"></b-icon>
                        <span>Contraseña</span>
                    </router-link>
                </li>
            </ul>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import { mapState } from 'vuex'

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
  }
}
</script>

<style scoped>

</style>
