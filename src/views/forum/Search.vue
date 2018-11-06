<template>
<div class="container">
<div class="container">
  <b-field>
    <b-input placeholder="Buscar en este foro..."
        type="search"
        icon="magnify">
    </b-input>
  </b-field>
</div>
<div class="tile is-ancestor">
  <div class="tile is-vertical is-12">
    <div class="tile">
      <div class="tile is-parent is-vertical">

        <thread v-for="thread in results.results" :key="thread.id" :thread="thread"></thread>

      </div>
    </div>
  </div>
</div>
      <b-pagination
      :total="results.count"
      :current.sync="currentPage"
      :per-page="itemsPerPage"
      order="is-centered"
      @change="changePage">
    </b-pagination>
  </div>
</template>

<script>
import Forum from '@/api/forum'
import PetitionsMixin from '@/components/mixins/petitions'
import thread from '@/components/forum/thread_item'
import debounce from 'debounce'
import { mapState } from 'vuex'
import ForumSearch from '@/components/forum/ForumSearch'
export default {
  name: 'forum_view',
  mixins: [PetitionsMixin],
  data () {
    return {
      currentPage: 1,
      itemsPerPage: 20,
      results: {
        results: []
      }
    }
  },
  mounted () {
    if (this.text) {
      this.performSearch()
    }
  },
  props: ['text'],
  components: { thread, ForumSearch },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    result2Thread (result) {
      var additives = {
        creator: {
          username: result.username
        },
        forum: {
          slug: result.forum
        },
        title: result.text,
        id: result.thread_id,
        last_post: {
          creator: {
            username: result.last_post_creator
          }
        }
      }
      return { ...result, ...additives }
    },
    performSearch () {
      if (this.$route.query.page) {
        console.log(this.$route.query.page)
        var page = parseInt(this.$route.query.page)
        this.currentPage = page
      }
      var forum = this.$route.query.foro || ''
      var username = this.$route.query.usuario || ''

      this.makePetition(Forum.threadSearch(this.text, username, forum, this.currentPage)).then((results) => {
        for (var i of results.results.keys()) {
          results.results[i] = this.result2Thread(results.results[i])
        }
        this.results = results
      })
    },
    changePage: debounce(function (page = 1) {
      var forum = this.$route.query.foro
      var username = this.$route.query.usuario
      var newQuery = {}
      if (forum) {
        newQuery = { ...newQuery, ...{ foro: forum } }
      }
      if (username) {
        newQuery = { ...newQuery, ...{ usuario: username } }
      }
      if (page === 1) {
        this.$router.push({ name: 'search', query: newQuery, params: { text: this.text } })
      } else {
        this.$router.push({ name: 'search', query: { ...newQuery, page: this.currentPage }, params: { text: this.text } })
      }
      this.currentPage = page
    }, 500)
  },
  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  }
}
</script>

<style lang="scss" scoped>
@import "../../sass/variables_light";

$forum-header-transition: all .25s ease-in-out;

.forum-header {
  cursor: pointer;
  transition: $forum-header-transition;

  &.is-info {
    transition: $forum-header-transition;
    background-color: $info;
    &:hover{
      background-color: darken($info, 5%);
      transform: scale(1.01);
    }
  }
}

.tile.is-vertical > .tile.is-child:not(:last-child) {
  margin-bottom: 0.25rem !important;
}
</style>
