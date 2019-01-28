import FigureSite from '../../api/figuresite'

const state = {
  messages: [],
  unreadMessageCount: 0
}

const actions = {
  getMessages ({ commit }, page = 1) {
    FigureSite.getPrivateMessages(page, false).then((response) => {
      commit('setUnreadMessageCount', response.count)
    })
    return FigureSite.getPrivateMessages(page).then((response) => {
      commit('setMessages', { count: response.count, page, messages: response.results })
    })
  },
  setMessageRead ({ commit, dispatch, state }, message) {
    if (!message.read) {
      commit('setUnreadMessageCount', state.unreadMessageCount - 1)
      return FigureSite.updatePrivateMessage(message.id, { read: true })
    }
  }
}

const mutations = {
  addMessage (state, notification) {
    state.unreadNotifications.unshift(notification)
    state.unreadNotificationCount++
  },
  setUnreadMessageCount (state, messageCount) {
    state.unreadMessageCount = messageCount
  },
  setMessages (state, { count, page, messages }) {
    state.messages = messages
    state.currentPage = page
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
