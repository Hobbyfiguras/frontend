import axios from 'axios'

const axiosConfig = {
  baseURL: process.env.VUE_APP_API_URL
}

const HTTP = axios.create(axiosConfig)

function makePetition (petition) {
  return new Promise((resolve, reject) => {
    HTTP.get(petition).then((r) => {
      resolve(r.data)
    }).catch((error) => {
      console.log(error)
      reject(error)
    })
  })
}

export default {
  async getArticles (page = 1, pageSize = 2) {
    return makePetition(`/api/articles/?page=${page}&page_size=${pageSize}`)
  },
  async getQuestions () {
    return makePetition(`/api/questions/`)
  },
  async getBackers () {
    return makePetition(`/api/backers/`)
  },
  async getArticle (slug) {
    return new Promise((resolve, reject) => {
      makePetition(`/api/articles/?slug=${slug}`).then((response) => {
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
