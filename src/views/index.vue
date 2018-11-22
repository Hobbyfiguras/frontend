<template>
  <div class="container">
    <div class="columns">
      <div class="column is-hidden-mobile">
        <div class="tile is-vertical is-ancestor">
          <div class="tile is-parent is-vertical">

            <div class="tile is-child  notification is-primary post-time is-size-7">
              <div class="level is-mobile">
                <div class="level-left">Ultimos mensajes</div>
                <div class="level-right">
                </div>
              </div>
            </div>
            <router-link class="tile is-child notification is-white" v-for="thread in threads" :key="thread.id" :to="getThreadLinkData(thread)">
              <article>
                {{thread.title}} <br/>
                <p class="is-size-7">por <a>{{thread.creator.username}}</a> en {{thread.forum.name}}</p>
              </article>
            </router-link>

          </div>
        </div>
      </div>
      <div class="column is-four-fifths">
        <div class="tile is-vertical is-ancestor">
          <NewsItem v-for="newsItem in news.results" :key="newsItem.id" :newsItem="newsItem" class="tile is-parent is-vertical">
          </NewsItem>
        </div>
        <b-pagination v-if="news"
        :total="news.count"
        :current.sync="currentPage"
        :per-page="itemsPerPage"
        order="is-centered"
        @change="changePage">
      </b-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import PetitionsMixin from '@/components/mixins/petitions'
import Forum from '@/api/forum'
import NewsItem from '@/components/NewsItem'
import debounce from 'debounce'

export default {
  name: 'index',
  mixins: [PetitionsMixin],
  components: { NewsItem },
  data () {
    return {
      news: [],
      threads: [],
      itemsPerPage: 10,
      currentPage: 1
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      if (this.$route.query.page) {
        var page = parseInt(this.$route.query.page)
        this.currentPage = page
      }
      this.makePetition(Forum.getNews(this.currentPage, 10)).then((news) => {
        this.news = news.threads
        console.log('news', this.news)
      })
      this.makePetition(Forum.getThreads()).then((threads) => {
        this.threads = threads.results
      })
    },
    changePage: debounce(function (page = 1) {
      if (page === 1) {
        this.$router.push({ name: 'index' })
      } else if (page !== 0) {
        this.$router.push({ name: 'index', query: { page: page } })
      }
    }, 500)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
