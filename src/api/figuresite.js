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
  async registerUser (userData) {
    return API.makePOSTnoHeaders('/api/auth/register/', userData, true)
  },
  async verifyEmail (key) {
    return API.makePOSTnoHeaders('/api/auth/register/verify-email/', { key: key }, true)
  },
  async resetPassword (payload) {
    return API.makePOSTnoHeaders('/api/auth/password_reset/verify/', payload, true)
  },
  async requestResetPassword (payload) {
    return API.makePOSTnoHeaders('/api/auth/password_reset/', payload, true)
  },
  async changePassword (payload) {
    return API.makePOST('/api/auth/change_password/', payload, true)
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
  },
  async getNotifications (page = 1) {
    return API.makeGET(`/api/notifications/?page=${page}`)
  },
  async getPrivateMessages ({ page = 1, read = '', sent = '' }) {
    return API.makeGET(`/api/private_messages/?page=${page}&read=${read}&sent=${sent}`)
  },
  async updatePrivateMessage (id, payload) {
    return API.makePATCH(`/api/private_messages/${id}/`, payload)
  },
  async getPrivateMessage (id = 1) {
    return API.makeGET(`/api/private_messages/${id}/`)
  },
  async sendMessage (username, subject, content) {
    return API.makePOST(`/api/users/${username}/send_message/`, { subject, content })
  },
  async getUnreadNotifications (page = 1) {
    return API.makeGET(`/api/notifications/unread/?page=${page}`)
  },
  async updateNotification (notification) {
    delete notification.user
    delete notification.actor
    return API.makePATCH(`/api/notifications/${notification.id}/`, notification)
  }
}
