<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <div class="tile is-vertical is-ancestor">
          <div class="tile is-parent is-vertical">

            <div class="tile is-child  notification is-primary post-time is-size-7">
              <div class="level is-mobile">
                <div class="level-left">Ultimos posts</div>
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
          <NewsItem v-for="newsItem in news" :key="newsItem.id" :newsItem="newsItem" class="tile is-parent is-vertical">
          </NewsItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PetitionsMixin from '@/components/mixins/petitions'
import Forum from '@/api/forum'
import NewsItem from '@/components/NewsItem'
export default {
  name: 'index',
  mixins: [PetitionsMixin],
  components: { NewsItem },
  data () {
    return {
      news: [],
      threads: []
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.makePetition(Forum.getForumThreads('noticias', 1, 5)).then((news) => {
        this.news = news.threads.results
      })
      this.makePetition(Forum.getThreads()).then((threads) => {
        this.threads = threads.results
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
