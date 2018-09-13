export default {
  methods: {
    makePetition (promise, errorMessage = true) {
      return new Promise((resolve, reject) => {
        this.$Progress.start()
        promise.then((r) => {
          this.$Progress.finish()
          resolve(r)
        }).catch((error) => {
          if (error) {
            this.$Progress.finish()
            this.$Progress.start()
            this.$Progress.set(100)
            this.$Progress.fail()
            if (errorMessage) {
              this.$awn.alert(this.parseError(error))
            }
            reject(error)
          }
        })
      })
    },
    parseError (error) {
      if (error.response.data.hasOwnProperty('detail')) {
        return error.response.data.detail
      } else {
        return error.message
      }
    }
  }
}
