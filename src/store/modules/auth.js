import figuresite from '../../api/figuresite'
import jwtDecode from 'jwt-decode'

const state = {
  jwtAccess: localStorage.getItem('jwtAccess'),
  jwtRefresh: localStorage.getItem('jwtRefresh'),
  currentUser: null,
  userLoadingPromise: null,
  refreshingToken: false,
  refreshTokenPromise: null
}

const getters = {
  isAuthenticated: state => !!state.jwtAccess && !!state.jwtRefresh && !!state.currentUser,
  hasAuthData: state => !!state.jwtAccess && !!state.jwtRefresh,
  hasRefreshToken: state => !!state.jwtRefresh
}

const actions = {
  logOff ({ commit }) {
    commit('removeToken')
    commit('deleteCurrentUser')
    commit('setUserLoadingPromise', null)
    console.log('user log off')
  },
  logIn ({ commit, dispatch }, payload) {
    commit('setRefreshToken', payload.refresh)
    commit('setAccessToken', payload.access)
    dispatch('getCurrentUser')
  },
  inspectToken ({ commit, dispatch, state }) {
    if (state.refreshingToken) {
      console.log('return promise')
      return state.refreshTokenPromise
    }
    const tokenRefresh = state.jwtRefresh

    if (tokenRefresh) {
      try {
        const tokenAccess = state.jwtAccess
        var renewAccess = false
        if (tokenAccess) {
          const decodedAccess = jwtDecode(tokenAccess)
          const expAccess = decodedAccess.exp
          if (Math.floor((expAccess - Date.now() / 1000)) / 60 <= 5) {
            // If access token has under 5 minutes left or is not there, try to refresh it
            renewAccess = true
          }
        } else {
          renewAccess = true
        }
        const decodedRefresh = jwtDecode(tokenRefresh)

        const expRefresh = decodedRefresh.exp

        console.log('probando token')

        // If refresh token is expired, remove it so we aren't authenticated anymore
        if (Math.floor((expRefresh - Date.now() / 1000)) / 3600 / 24 <= 0 && (Date.now)) {
          console.log('borrando token porque ha expirado')
          commit('removeToken')
        }

        if (renewAccess) {
          commit('removeAccessToken')
          console.log('returning refresh promise')
          return dispatch('refreshToken')
        }
      } catch (err) {
        console.log('borrando token por algo que no se', err)
        commit('removeAccessToken')
      }
    }
    return Promise.resolve(state.jwtAccess)
  },
  refreshToken ({ commit, state, dispatch }) {
    commit('setRefreshingToken', true)
    commit('setRefreshTokenPromise', new Promise((resolve, reject) => {
      console.log('updating token', state)
      figuresite.refreshToken(state.jwtRefresh).then((response) => {
        console.log('token update succ', response)
        commit('setAccessToken', response.access)
        dispatch('getCurrentUser')
        commit('setRefreshingToken', false)
        resolve(response.access)
      }).catch((error) => {
        commit('removeToken')
        commit('setRefreshingToken', false)
        console.log('token update faill')
        reject(error)
      })
    }))

    return state.refreshTokenPromise
  },
  getCurrentUser ({ commit, state }) {
    if (state.userLoadingPromise) {
      return state.userLoadingPromise
    } else {
      var promise = new Promise((resolve, reject) => {
        figuresite.getUser('current').then((user) => {
          commit('setCurrentUser', user)
          resolve()
        })
      })
      commit('setUserLoadingPromise', promise)
      return state.userLoadingPromise
    }
  }
}

const mutations = {
  setRefreshToken (state, token) {
    state.jwtRefresh = token
    localStorage.setItem('jwtRefresh', state.jwtRefresh)
  },
  setAccessToken (state, token) {
    state.jwtAccess = token
    localStorage.setItem('jwtAccess', state.jwtAccess)
  },
  removeToken (state) {
    localStorage.removeItem('jwtAccess')
    localStorage.removeItem('jwtRefresh')
    state.jwtAccess = null
    state.jwtRefresh = null
  },
  removeAccessToken (state) {
    localStorage.removeItem('jwtAccess')
    state.jwtAccess = null
  },
  setCurrentUser (state, user) {
    if (state.currentUser) {
      state.currentUser = { ...state.currentUser, ...user }
    } else {
      state.currentUser = user
    }
  },
  deleteCurrentUser (state) {
    state.currentUser = null
  },
  setRefreshTokenPromise (state, promise) {
    state.refreshTokenPromise = promise
  },
  setRefreshingToken (state, refreshing) {
    state.refreshingToken = refreshing
  },
  setUserLoadingPromise (state, promise) {
    state.userLoadingPromise = promise
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
