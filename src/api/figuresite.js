import API from './api'

export default {
  async login (username, password) {
    var payload = {
      username: username,
      password: password
    }
    return API.makePOST('/api/auth/login/', payload)
  },
  async refreshToken (token) {
    console.log('refresh', token)
    var payload = {
      refresh: token
    }
    return API.makePOSTnoHeaders('/api/auth/refresh/', payload)
  },
  async getUser (username) {
    return API.makeGET(`/api/users/${username}/`)
  },
  async updateUserAvatar (username, payload) {
    return API.makePATCH(`/api/users/${username}/`, payload)
  },
  async updateUser (username, payload) {
    if (payload.avatar) {
      delete payload.avatar
    }
    return API.makePATCH(`/api/users/${username}/`, payload)
  },
  async verifyToken (token) {
    return API.makeGET('/api/auth/token-verify/', { token: token })
  },
  async getUserPosts (username, page = 1) {
    return API.makeGET(`/api/users/${username}/posts/?page=${page}`)
  },
  async getUserThreads (username, page = 1) {
    return API.makeGET(`/api/users/${username}/threads/?page=${page}`)
  }
}
