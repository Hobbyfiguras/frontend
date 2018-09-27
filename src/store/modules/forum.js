import forum from '../../api/forum'

const state = {
  forumSettings: null
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
  }
}

const mutations = {
  setForumSettings (state, settings) {
    state.forumSettings = settings
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
