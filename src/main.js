import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './registerServiceWorker'

import axios from 'axios'

import Buefy from 'buefy'
import VueAxios from 'vue-axios'
import VueProgressBar from 'vue-progressbar'
import VueAWN from 'vue-awesome-notifications'
import PortalVue from 'portal-vue'
import VueMarkdown from 'vue-markdown'
import Croppa from 'vue-croppa'
import VueScrollTo from 'vue-scrollto'
import VueMeta from 'vue-meta'
import VueAnalytics from 'vue-analytics'

import GlobalMixin from '@/components/mixins/global'
import VueElementQuery from 'vue-element-query'

// buefy
Vue.use(Buefy)

// Axios stuff
Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL
Vue.axios.defaults.xsrfHeaderName = 'X-CSRFToken'
Vue.axios.defaults.xsrfCookieName = 'csrftoken'
// vue-progressbar
const progressbarOptions = {
  color: '#bffaf3',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 400
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, progressbarOptions)

// vue-awesome-notifications
var AWNOptions = {
  labels: {
    success: '',
    warning: '',
    error: '',
    async: 'Cargando'
  }
}

Vue.use(VueAWN, AWNOptions)

// portal-vue
Vue.use(PortalVue)

// vue-markdown
Vue.use(VueMarkdown)

// vue-croppa
Vue.use(Croppa)

// vue-scrollto
Vue.use(VueScrollTo, {
  duration: 1000,
  offset: -75
})

// vue-analytics
Vue.use(VueAnalytics, {
  id: 'UA-126975682-1',
  router,
  debug: {
    enabled: false
  }
})

// vue-element-query
Vue.use(VueElementQuery)

// vue-meta

Vue.use(VueMeta)

Vue.config.productionTip = false

Vue.mixin(GlobalMixin)

Vue.axios.interceptors.request.use((config) => {
  return store.dispatch('auth/inspectToken').then((newToken) => {
    console.log('mid inspect')
    if (store.getters['auth/hasAuthData']) {
      if (newToken) {
        config.headers.common = { Authorization: `Bearer ${newToken}` }
      } else {
        config.headers.common = { Authorization: `Bearer ${store.state.auth.jwtAccess}` }
      }
    }
    return Promise.resolve(config)
  })
})

window.App = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
