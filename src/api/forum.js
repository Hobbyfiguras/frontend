import API from './api'

export default {
  // Forum categories
  async getForumCategories () {
    return API.makeGET('/api/forum/categories/')
  },
  async createForumCategory (payload) {
    return API.makePOST('/api/forum/categories/', payload)
  },
  async updateForumCategory (payload) {
    return API.makePATCH(`/api/forum/categories/${payload.slug}/`)
  },
  async deleteForumCategory (id) {
    return API.makeDELETE(`/api/forum/categories/${id}/`)
  },
  // Forum
  async createForum (payload) {
    return API.makePOST('/api/forum/', payload)
  },
  async getForum (slug) {
    return API.makeGET(`/api/forum/${slug}/`)
  },
  async moveForumUp (slug) {
    return API.makePOST(`/api/forum/${slug}/move_up/`, {})
  },
  async moveForumDown (slug) {
    return API.makePOST(`/api/forum/${slug}/move_down/`, {})
  },
  async deleteForum (slug) {
    return API.makeDELETE(`/api/forum/${slug}/`)
  },
  async updateForum (slug, payload) {
    return API.makePATCH(`/api/forum/${slug}/`, payload)
  },
  async getThreads (page = 1, pageSize = 5) {
    return API.makeGET(`/api/thread/?page=${page}&page_size=${pageSize}`)
  },
  async getForumThreads (slug, page = 1, pageSize = 20) {
    return API.makeGET(`/api/forum/${slug}/threads/?page=${page}&page_size=${pageSize}`)
  },
  async getThread (id, page = 1) {
    return API.makeGET(`/api/thread/${id}/?page=${page}`)
  },
  async updateThread (id, payload) {
    return API.makePATCH(`/api/thread/${id}/`, payload)
  },
  async createThread (forumSlug, payload) {
    return API.makePOST(`/api/forum/${forumSlug}/create_thread/`, payload)
  },
  async updatePost (postID, newContent) {
    return API.makePATCH(`/api/posts/${postID}/`, { content: newContent })
  },
  async getPost (postID) {
    return API.makeGET(`/api/posts/${postID}/`)
  },
  async deletePost (postID, reason) {
    return API.makePOST(`/api/posts/${postID}/delete/`, { delete_reason: reason })
  },
  async createPost (thread, content) {
    return API.makePOST(`/api/thread/${thread.id}/create_post/`, { content: content })
  },
  async getReports (page = 1) {
    return API.makeGET(`/api/reports/?page=${page}`)
  },
  async getForumSettings () {
    return API.makeGET(`/api/settings/`)
  },
  async votePost (postID, postTypeID) {
    return API.makePOST(`/api/posts/${postID}/vote/`, { vote_type: postTypeID })
  },
  async changeThreadSubscription (postID, subscribed) {
    return API.makePOST(`/api/thread/${postID}/change_subscription/`, { subscribed })
  },
  async reportPost (reason, postID) {
    return API.makePOST(`/api/posts/${postID}/report/`, { reason })
  },
  async banUserForPost (user, payload) {
    return API.makePOST(`/api/users/${user.username}/ban_user/`, payload)
  },
  async threadSearch (text = '', username = '', forum = '', page = 1) {
    return API.makeGET(`/api/search/threads/?text__fuzzy=${text}&username=${username}&forum=${forum}&page=${page}`)
  },
  async userSearch (text = '', page = 1) {
    return API.makeGET(`/api/search/users/?text__fuzzy=${text}&page=${page}`)
  }
}
