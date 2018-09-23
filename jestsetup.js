import Vue from 'vue'

import axios from 'axios'
import moment from 'moment'

import Buefy from 'buefy'
import VueAxios from 'vue-axios'
import VueProgressBar from 'vue-progressbar'
import VueAWN from 'vue-awesome-notifications'
import PortalVue from 'portal-vue'
import VueMoment from 'vue-moment'
import VueMarkdown from 'vue-markdown'
import Croppa from 'vue-croppa'
import VueScrollTo from 'vue-scrollto'
import VueMeta from 'vue-meta'

import GlobalMixin from '@/components/mixins/global'

// buefy
Vue.use(Buefy)

// Axios stuff
Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL

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
    error: ''
  }
}

Vue.use(VueAWN, AWNOptions)

// portal-vue
Vue.use(PortalVue)

// vue-moment
moment.locale('es')

Vue.use(VueMoment, {
  moment
})

// vue-markdown
Vue.use(VueMarkdown)

// vue-croppa
Vue.use(Croppa)

// vue-scrollto
Vue.use(VueScrollTo, {
  duration: 1000,
  offset: -75
})

// vue-meta

Vue.use(VueMeta)

Vue.config.productionTip = false

Vue.mixin(GlobalMixin)
