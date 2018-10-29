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
    getThreadLinkData (thread) {
      return {
        name: 'thread',
        params: {
          id: thread.id,
          slug: thread.slug,
          forum: thread.forum.slug
        }
      }
    },
    getPostLinkData (post, thread) {
      let threadLink = this.getThreadLinkData(thread)
      threadLink.params.page = post.page
      threadLink.hash = '#' + post.id
      return threadLink
    },
    isUserBanned (user) {
      if (user.bans.length > 0) {
        return Date.parse(user.bans[user.bans.length - 1].ban_expiry_date) > Date.now()
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
