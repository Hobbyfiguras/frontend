<template>
  <div class="container">
<nav class="breadcrumb" aria-label="breadcrumbs">
  <ul>
    <li>
      <router-link :to="{name: 'ForumIndex'}">
          <span></span>
          <b-icon icon="home"></b-icon>
      </router-link>
    </li>
    <li>
      <router-link v-if="forum.slug" :to="{name: 'forum', params: {slug: forum.slug}}"><span>{{forum.name}}</span></router-link>
    </li>
  </ul>
</nav>
<div class="container">
  <ForumSearch :forum="forum"></ForumSearch>
</div>

<div class="tile is-ancestor">
  <div class="tile is-vertical is-12">
    <div class="tile">
      <div class="tile is-parent is-vertical">
        <article class="tile is-child notification is-primary">
          <div class="level is-mobile">
            <div class="level-left">
              <div class="level-item">
                <figure class="image is-64x64">
                  <img :src="forum.icon" class="is-rounded" alt="">
                </figure>
              </div>
              <div class="level-item">
                <p class="title">{{forum.name}}</p>
              </div>
            </div>
            <div class="level-right" v-if="currentUser && (currentUser.is_staff || forum.user_perms.includes('create_threads'))">
              <router-link :to="{name: 'thread_new', props: {slug: forum.slug}}">
                <button class="button is-info">Nuevo tema</button>
              </router-link>
            </div>
          </div>
        </article>
        <thread v-for="thread in forum.threads.results" :key="thread.id" :thread="thread"></thread>

      </div>
    </div>
  </div>
</div>
      <b-pagination
      :total="forum.threads.count"
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
import ForumSearch from '@/components/forum/ForumSearch'
import { mapState } from 'vuex'
export default {
  name: 'forum_view',
  mixins: [PetitionsMixin],
  data () {
    return {
      currentPage: 1,
      itemsPerPage: 15,
      forum: {
        threads: {
          count: 0,
          results: []
        }
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  props: ['slug'],
  components: { thread, ForumSearch },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      if (this.$route.query.page) {
        console.log(this.$route.query.page)
        var page = parseInt(this.$route.query.page)
        this.currentPage = page
      }
      this.makePetition(Forum.getForumThreads(this.slug, this.currentPage, this.itemsPerPage), true, true).then((forum) => {
        this.forum = forum
      })
    },
    changePage: debounce(function (page = 1) {
      if (page === 1) {
        this.$router.push({ name: 'forum', params: { slug: this.forum.slug } })
      } else {
        this.$router.push({ name: 'forum', query: { page: this.currentPage }, params: { slug: this.forum.slug } })
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
