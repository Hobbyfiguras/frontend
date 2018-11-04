import Vue from 'vue'
import axios from 'axios'

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

const noRequestAxios = axios.create()

export default {
  makePOST (petition, payload, returnFull) {
    return Vue.axios.post(petition, payload).then((r) => {
      if (returnFull) {
        return r
      }
      return r.data
    }).catch((err) => {
      throw err
    })
  },
  makePOSTnoHeaders (petition, payload, returnFull) {
    return noRequestAxios.post(petition, payload).then((r) => {
      if (returnFull) {
        return r
      }
      return r.data
    }).catch((err) => {
      throw err
    })
  },
  makePATCH (petition, payload, config) {
    return Vue.axios.patch(petition, payload, config).then((r) => {
      return r.data
    }).catch((err) => {
      throw err
    })
  },
  makeGET (petition) {
    return Vue.axios.get(petition).then((r) => {
      return r.data
    }).catch((err) => {
      throw err
    })
  },
  makeDELETE (petition, payload) {
    return Vue.axios.delete(petition, payload).then((r) => {
      return r.data
    }).catch((err) => {
      throw err
    })
  }
}
