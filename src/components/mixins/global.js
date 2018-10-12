import stripMarkdown from 'strip-markdown'
import remark from 'remark'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import esLocale from 'date-fns/locale/es'

export default {
  methods: {
    fileToBase64 (file) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader()
        reader.onload = function () { resolve(reader.result) }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },
    isUserBanned (user) {
      if (user.ban_expiry_date) {
        console.log('user is banned', user.username)
        console.log(user.ban_expiry_date)
        return Date.parse(user.ban_expiry_date) > Date.now()
      } else {
        return false
      }
    },
    stripMd (content) {
      return new Promise((resolve, reject) => {
        remark()
          .use(stripMarkdown)
          .process(content, (err, file) => {
            var str = String(file)
            if (err) {
              reject(err)
            }
            var parser = new DOMParser()
            var dom = parser.parseFromString(
              '<!doctype html><body>' + str,
              'text/html')
            var decodedString = dom.body.textContent
            decodedString = decodedString.replace(/->|<-|\\/g, '')
            resolve(decodedString.substring(0, decodedString.length - 1))
          })
      })
    }
  },
  filters: {
    timeDiff (value) {
      return 'hace ' + distanceInWordsToNow(value, { locale: esLocale })
    }
  }
}
