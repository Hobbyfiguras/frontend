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
  async createThread (forumSlug, payload) {
    return API.makePOST(`/api/forum/${forumSlug}/create_thread/`, payload)
  },
  async updatePost (postID, newContent) {
    return API.makePATCH(`/api/posts/${postID}/`, { content: newContent })
  },
  async deletePost (postID, reason) {
    return API.makePOST(`/api/posts/${postID}/delete/`, { delete_reason: reason })
  },
  async createPost (thread, content) {
    console.log(thread.id)
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
  }
}
