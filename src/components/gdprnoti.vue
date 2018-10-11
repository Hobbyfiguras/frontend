<template>
      <div v-if="!GDPRConsent" class="container cookie-notify">
        <div class="columns">
          <div class="column is-3"></div>
          <div class="column">
            <div class="notification is-primary">
              <div class="level is-marginless">
                <div class="level-left">
                  <div class="level-item">
                    <p class="title is-white">Aviso de cookies</p>
                  </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                      <button class="button is-info is-pulled-right" @click="updateGDPRConsent(true)">Aceptar</button>
                    </div>
                </div>
              </div>
              Usamos <a href="https://es.wikipedia.org/wiki/Cookie_(inform%C3%A1tica)#Prop%C3%B3sito">cookies</a> para, entre otras cosas, almacenar tus preferencias y protegerte ante comportamientos abusivos. Aprende mas en nuestra <router-link :to="{name: 'privacy'}">Politica de privacidad</router-link>.
            </div>
          </div>
          <div class="column is-3"></div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'gdprnoti',
  methods: {
    ...mapActions('settings', ['updateGDPRConsent'])
  },
  computed: {
    ...mapState({
      GDPRConsent: state => state.settings.GDPRConsent
    })
  }
}
</script>

<style lang="scss" scoped>
  .cookie-notify {
    position:fixed !important;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
  }
  .notification {
    a {
      text-decoration: underline !important;
    }
  }
</style>
