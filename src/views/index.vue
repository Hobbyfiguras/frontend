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
            <article v-for="thread in threads" :key="thread.id" class="tile is-child notification is-white">
              {{thread.title}} <br/>
              <p class="is-size-7">por <a>{{thread.creator.username}}</a> en {{thread.forum.name}}</p>
            </article>
          </div>
        </div>
      </div>
      <div class="column is-four-fifths">
        <div class="tile is-vertical is-ancestor">
          <div v-for="newsItem in news" :key="newsItem.id" class="tile is-parent is-vertical">
            <article class="tile thread-title is-child notification is-primary">
              <p class="title">{{newsItem.title}}</p>
            </article>
            <div class="tile is-child notification is-info post-time is-size-7">
              <div class="level">
                <div class="level-left">por {{newsItem.creator.username}} {{newsItem.created | moment("from")}}</div>
              </div>
            </div>
            <article class="tile is-child notification is-white thread-content">
              <Markdown :source="newsItem.first_post.content"></Markdown>
              <div class="level">
                <div class="level-left"></div>
                <div class="level-right">
                  <div class="level-item">
                    <router-link :to="getThreadLinkData(newsItem)">
                      <b-icon icon="comment" class="badge" :data-badge="newsItem.post_count - 1"></b-icon>
                    </router-link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PetitionsMixin from '@/components/mixins/petitions'
import Forum from '@/api/forum'
import Markdown from '@/components/markdown'
export default {
  name: 'index',
  mixins: [PetitionsMixin],
  components: { Markdown },
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.thread-title {
  padding: 1.0rem 2.5rem 1.0rem 1.5rem
}
.tile.is-vertical > .tile.is-child:not(:last-child) {
  margin-bottom: 0.25rem !important;
}
</style>
