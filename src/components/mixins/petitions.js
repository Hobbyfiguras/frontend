export default {
  methods: {
    makePetition (promise) {
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
            reject(error)
          }
        })
      })
    }
  }
}
