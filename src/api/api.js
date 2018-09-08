import Vue from 'vue'
import store from '@/store'
import debouncePromise from 'debounce-promise'

function _setAuthHeaders () {
  console.log('set auth headers')
  return store.dispatch('auth/inspectToken').then(() => {
    if (store.getters['auth/hasAuthData']) {
      Vue.axios.defaults.headers.common = { Authorization: `Bearer ${store.state.auth.jwtAccess}` }
    }
  })
}

var setAuthHeaders = debouncePromise(_setAuthHeaders, 500)

function parseError (error) {
  if (error.response.status === 429) {
    var seconds = error.response.data.detail.split(' seconds')[0]
    seconds = seconds.split('available in ')[1]
    var message = `Vas muy rapido, prueba a hacer eso en ${seconds} seg.`
    return message
  } else {
    return error.message
  }
}

export default {
  makePOST (petition, payload) {
    return setAuthHeaders().then(() => {
      return Vue.axios.post(petition, payload).then((r) => {
        console.log(r)
        return r.data
      }).catch((err) => {
        throw parseError(err)
      })
    })
  },
  makePOSTnoHeaders (petition, payload) {
    return Vue.axios.post(petition, payload).then((r) => {
      return r.data
    }).catch((err) => {
      throw parseError(err)
    })
  },
  makePATCH (petition, payload, config) {
    return setAuthHeaders().then(() => {
      return Vue.axios.patch(petition, payload, config).then((r) => {
        return r.data
      }).catch((err) => {
        throw parseError(err)
      })
    })
  },
  makeGET (petition) {
    return setAuthHeaders().then(() => {
      return Vue.axios.get(petition).then((r) => {
        return r.data
      }).catch((err) => {
        throw parseError(err)
      })
    })
  },
  makeDELETE (petition, payload) {
    return setAuthHeaders().then(() => {
      return Vue.axios.delete(petition, payload).then((r) => {
        return r.data
      }).catch((err) => {
        throw parseError(err)
      })
    })
  }
}
