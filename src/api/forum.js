import API from './api'

export default {
  async getForumCategories () {
    return API.makeGET('/api/forum/categories')
  },
  async getForum (slug) {
    return API.makeGET(`/api/forum/${slug}/`)
  },
  async getForumThreads (slug, page = 1) {
    return API.makeGET(`/api/forum/${slug}/threads/?page=${page}`)
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
    return API.makePOST(`/api/thread/${thread.id}/create_post/`, { content: content })
  }
}
