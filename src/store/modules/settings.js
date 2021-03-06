import FigureSite from '@/api/figuresite'

const state = {
  darkTheme: localStorage.getItem('darkTheme') === 'true',
  GDPRConsent: localStorage.getItem('GDPRConsent') === 'true',
  NSFWConsent: localStorage.getItem('NSFWEnabled') === 'true'
}

const getters = {
  isNSFWEnabled: (state, getters, rootState) => {
    console.log(rootState)
    if (rootState.auth.currentUser) {
      return rootState.auth.currentUser.nsfw_enabled
    } else {
      return state.NSFWConsent
    }
  }
}

const actions = {
  updateDarkTheme ({ commit }, value) {
    commit('setDarkTheme', value)
  },
  updateGDPRConsent ({ commit }, value) {
    commit('setGDPRConsent', value)
  },
  setNSFW ({ commit, rootState }, value) {
    var user = JSON.parse(JSON.stringify(rootState.auth.currentUser))
    if (user) {
      user.nsfw_enabled = value
      return FigureSite.updateUser(user.username, user).then(() => {
        commit('auth/setCurrentUser', user, { root: true })
      })
    } else {
      commit('setLocalNSFW', true)
    }
  }
}

const mutations = {
  setDarkTheme (state, value) {
    state.darkTheme = value
    localStorage.setItem('darkTheme', state.darkTheme)
  },
  setGDPRConsent (state, value) {
    state.GDPRConsent = value
    localStorage.setItem('GDPRConsent', state.GDPRConsent)
  },
  setLocalNSFW (state, value) {
    state.NSFWConsent = value
    localStorage.setItem('NSFWEnabled', state.NSFWConsent)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
