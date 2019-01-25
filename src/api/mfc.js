import API from './api'

export default {
  async searchItem (search, page = 1) {
    return API.makeGET(`/api/mfc/figures/search?keywords=${search}&page=${page}`)
  },
  async getItem (pk) {
    return API.makeGET(`/api/mfc/items/${pk}/`)
  },
  async getPictures (username = '', page = 1) {
    return API.makeGET(`/api/mfc/pictures/search/?username=${username}&page=${page}`)
  },
  async getUserFigures (username = '', page = 1) {
    return API.makeGET(`/api/mfc/figures/${username}/?page=${page}`)
  },
  async getQuestions () {
    return API.makeGET(`/api/questions/`)
  },
  async getBackers () {
    return API.makeGET(`/api/backers/`)
  },
  async searchFigure (keywords, page = 1) {
    return API.makeGET(`/api/mfc/figures/search/?keywords=${keywords}&page=${page}`)
  },
  async getArticle (slug) {
    return new Promise((resolve, reject) => {
      API.makeGET(`/api/articles/?slug=${slug}`).then((response) => {
        if (response.count > 0) {
          resolve(response.results[0])
        } else {
          reject(new Error('Article was not found'))
        }
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
