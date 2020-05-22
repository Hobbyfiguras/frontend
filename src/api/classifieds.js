import API from './api'

export default {
    async getClassifieds (searchTerm = "", category = "", page = 1) {
      var req = `/api/search/classifieds?text=${searchTerm}&page=${page}`
      if (category !== "") {
        req = req + `&category__exact=${category}`
      }
      return API.makeGET(req)
    },
    async createAD (payload) {
      return API.makePOST('/api/classifieds/create_ad/', payload, true)
    },
    async getClassifiedAD (slug) {
      return API.makeGET(`/api/classifieds/${slug}`)
    },
    async setAsSold(slug, receivingUserUsername) {
      return API.makePOST(`/api/classifieds/${slug}/sell_to_user/`, {username: receivingUserUsername})
    },
    async sendReview(slug, content, recommended) {
      return API.makePOST(`/api/classifieds/${slug}/send_review/`, {content, recommended})
    },
    async getCategories() {
      return API.makeGET('/api/classified_categories')
    }
  }
  