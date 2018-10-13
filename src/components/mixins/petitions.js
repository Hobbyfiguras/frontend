export default {
  methods: {
    setErrors (errors) {
      Object.keys(this.errors).forEach((key) => {
        this.errors[key] = null
      })
      Object.keys(errors).forEach((key) => {
        this.errors[key] = errors[key][0]
      })
    },
    makePetition (promise, errorMessage = true) {
      this.$Progress.start()
      return promise.then((r) => {
        this.$Progress.finish()
        return r
      }).catch((error) => {
        if (error) {
          this.$Progress.finish()
          this.$Progress.start()
          this.$Progress.set(100)
          this.$Progress.fail()
          if (errorMessage) {
            this.$awn.alert(this.parseError(error))
          }
        }
        throw error
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
