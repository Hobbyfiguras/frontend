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
