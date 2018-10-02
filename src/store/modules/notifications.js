import forum from '../../api/forum'
var W3CWebSocket = require('websocket').w3cwebsocket

const state = {
  notifications: [],
  websocketClient: null
}

const getters = {
  hasForumSettings: state => !!state.forumSettings
}

const actions = {
  getForumSettings ({ commit }) {
    return forum.getForumSettings().then((settings) => {
      console.log(settings)
      commit('setForumSettings', settings)
    })
  },
  connectToNotificationsService ({ commit, dispatch }) {
    var promise = dispatch('auth/inspectToken', null, { root: true })
    promise.then((token) => {
      var client
      // HACK, we use sec-websocket-protocol to send the access token
      // because websockets are a bunch of idiots
      if (process.env.NODE_ENV === 'development') {
        client = new W3CWebSocket(`ws://127.0.0.1:8081/ws/notifications/?token=${token}`)
      } else {
        client = new W3CWebSocket(`wss://127.0.0.1:8081/ws/notifications/?token=${token}`)
      }
      console.log('client connected')
      client.onmessage = (event) => {
        console.log('received notification', JSON.parse(event.data))
        commit('addNotification', JSON.parse(event.data))
      }
      commit('setWebsocketClient', client)
    })
  }
}

const mutations = {
  setForumSettings (state, settings) {
    state.forumSettings = settings
  },
  setWebsocketClient (state, client) {
    state.websocketClient = client
  },
  addNotification (state, notification) {
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
