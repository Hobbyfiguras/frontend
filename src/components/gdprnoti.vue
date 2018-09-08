<template>
      <div v-if="!GDPRConsent" class="container cookie-notify">
        <div class="columns">
          <div class="column is-3"></div>
          <div class="column">
            <div class="notification is-primary">
              <div class="level is-marginless">
                <div class="level-left">
                  <div class="level-item">
                    <div class="content">
                      <h3>Cookies disclaimer</h3>
                    </div>
                  </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                      <button class="button is-info is-pulled-right" @click="updateGDPRConsent(true)">Agree</button>
                    </div>
                </div>
              </div>
              We use <a href="https://en.wikipedia.org/wiki/HTTP_cookie#Terminology">cookies</a> to, amongst other things, store your preferences and to protect against abusive behavior. Learn more in our <router-link :to="{name: 'privacy'}">Privacy Policy</router-link> page.
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
</style>
