import Vue from 'vue'
import store from '@/store'
import debouncePromise from 'debounce-promise'

function _setAuthHeaders () {
  console.log('set auth headers')
  return store.dispatch('auth/inspectToken').then(() => {
    console.log('mid inspect')
    if (store.getters['auth/hasAuthData']) {
      Vue.axios.defaults.headers.common = { Authorization: `Bearer ${store.state.auth.jwtAccess}` }
    }
  })
}

var setAuthHeaders = debouncePromise(_setAuthHeaders, 500)

export default {
  makePOST (petition, payload) {
    return setAuthHeaders().then(() => {
      return Vue.axios.post(petition, payload).then((r) => {
        console.log(r)
        return r.data
      }).catch((err) => {
        throw err
      })
    })
  },
  makePOSTnoHeaders (petition, payload, returnFull) {
    return Vue.axios.post(petition, payload).then((r) => {
      if (returnFull) {
        return r
      }
      return r.data
    }).catch((err) => {
      throw err
    })
  },
  makePATCH (petition, payload, config) {
    return setAuthHeaders().then(() => {
      return Vue.axios.patch(petition, payload, config).then((r) => {
        return r.data
      }).catch((err) => {
        throw err
      })
    })
  },
  makeGET (petition) {
    return setAuthHeaders().then(() => {
      return Vue.axios.get(petition).then((r) => {
        return r.data
      }).catch((err) => {
        throw err
      })
    })
  },
  makeDELETE (petition, payload) {
    return setAuthHeaders().then(() => {
      return Vue.axios.delete(petition, payload).then((r) => {
        return r.data
      }).catch((err) => {
        throw err
      })
    })
  }
}
