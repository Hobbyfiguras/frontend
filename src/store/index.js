import Vue from 'vue'
import Vuex from 'vuex'
import settings from './modules/settings'
import auth from './modules/auth'
import forum from './modules/forum'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    settings,
    auth,
    forum
  },
  strict: debug
})
