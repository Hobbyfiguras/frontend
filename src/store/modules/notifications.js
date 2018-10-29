import forum from '../../api/forum'
import FigureSite from '../../api/figuresite'

var W3CWebSocket = require('websocket').w3cwebsocket

const state = {
  notifications: [],
  websocketClient: null,
  unreadNotifications: [],
  unreadNotificationCount: 0
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
        console.log(`connecting using token: ${token}`)
        client = new W3CWebSocket(`ws://127.0.0.1:8081/ws/notifications/?token=${token}`)
      } else {
        client = new W3CWebSocket(`wss://hobbyfiguras.moe/ws/notifications/?token=${token}`)
      }
      console.log('client connected')
      client.onmessage = (event) => {
        console.log('received notification', JSON.parse(event.data))
        commit('addUnreadNotification', JSON.parse(event.data))
      }
      commit('setWebsocketClient', client)
    })
  },
  getUnreadNotifications ({ commit }, page = 1) {
    return FigureSite.getUnreadNotifications(page).then((response) => {
      commit('setUnreadNotifications', { count: response.count, page, notifications: response.results })
    })
  },
  setNotificationRead ({ commit, dispatch, state }, notification) {
    notification.read = true
    return FigureSite.updateNotification(notification).then(() => {
      commit('deleteNotification', notification)
      if ((state.unreadNotifications.length) < 4) {
        dispatch('getUnreadNotifications', state.currentPage)
      }
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
  addUnreadNotification (state, notification) {
    state.unreadNotifications.unshift(notification)
    state.unreadNotificationCount++
  },
  setUnreadNotifications (state, { count, page, notifications }) {
    state.unreadNotificationCount = count
    state.unreadNotifications = notifications
    state.currentPage = page
  },
  deleteNotification (state, notification) {
    var notificationIndex = state.unreadNotifications.findIndex((unreadNotification) => unreadNotification.id === notification.id)
    if (notificationIndex !== -1) {
      state.unreadNotifications.splice(notificationIndex, 1)
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
