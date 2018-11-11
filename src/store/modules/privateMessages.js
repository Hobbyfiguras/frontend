import FigureSite from '../../api/figuresite'

const state = {
  messages: [],
  unreadMessageCount: 0
}

const actions = {
  getMessages ({ commit }, page = 1) {
    console.log('GETMESS')
    FigureSite.getPrivateMessages(page, false).then((response) => {
      commit('setUnreadMessageCount', response.count)
    })
    return FigureSite.getPrivateMessages(page).then((response) => {
      commit('setMessages', { count: response.count, page, messages: response.results })
    })
  },
  setMessageread ({ commit, dispatch, state }, message) {
    message.read = true
    return FigureSite.updatePrivateMessage(message).then(() => {
      if ((state.messages.length) < 4) {
        dispatch('getMessages', state.currentPage)
      }
    })
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
