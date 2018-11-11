import Vue from 'vue'
import Vuex from 'vuex'
import settings from './modules/settings'
import auth from './modules/auth'
import forum from './modules/forum'
import notifications from './modules/notifications'
import privateMessages from './modules/privateMessages'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    settings,
    auth,
    forum,
    notifications,
    privateMessages
  },
  strict: debug
})
