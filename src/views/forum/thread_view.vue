<template>
  <div class="container">

<nav class="breadcrumb" aria-label="breadcrumbs" v-if="thread">

  <ul>
    <li>
      <router-link :to="{name: 'ForumIndex'}">
          <span></span>
          <b-icon icon="home"></b-icon>
      </router-link>
    </li>
    <li>
      <router-link v-if="thread.forum.slug" :to="{name: 'forum', params: {slug: thread.forum.slug}}"><span>{{thread.forum.name}}</span></router-link>
    </li>
    <li class="is-active">
      <a href="#">
        <span>{{thread.title}}</span>
      </a>
    </li>
  </ul>
</nav>
<div class="tile is-ancestor is-vertical" v-if="thread">
  <div v-if="!thread.nsfw || isNSFWEnabled" class="tile is-vertical">
      <div class="tile is-parent is-vertical">
        <article class="tile thread-title is-child notification is-primary">
          <div v class="level">
            <div class="level-left">
              <div class="level-item">
                <p class="title">{{thread.title}}</p>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item" v-if="currentUser">
                <a class="button" @click="toggleSubscription"><b-icon v-if="thread.subscribed" icon="eye-off"></b-icon> <b-icon v-else icon="eye"></b-icon></a>
              </div>
            </div>
          </div>
        </article>
        <transition-group :name="transitonName">
          <PostItem class="PostItem" v-for="(post, index) in thread.posts.results" :isOP="index === 0 && currentPage === 1" :post="post" @changePost="changePost" :key="post.id" @deletePost="deletePost" :ref="'#' + post.id">
          </PostItem>
        </transition-group>
        <article class="container">
          <b-pagination
          :total="thread.posts.count"
          :current.sync="currentPage"
          :per-page="postsPerPage"
          order="is-centered"
          @change="changePage">
        </b-pagination>
        </article>

        <template v-if="currentUser">
              <div class="tile is-child notification is-info new-post is-size-7">
                <div class="level">
                  <div class="level-left">Nuevo post</div>
                </div>
              </div>
              <article class="tile is-child notification is-white thread-content">
                <PostCreate :thread="thread" @createPost="onCreatePost"></PostCreate>
              </article>
        </template>

      </div>
    </div>
</div>

</div>
</template>

<script>
import Forum from '@/api/forum'
import PetitionsMixin from '@/components/mixins/petitions'
import PostItem from '@/components/forum/PostItem'
import NSFWWarningMixin from '@/components/mixins/NSFWWarningMixin'
import PostCreate from '@/views/forum/post_create'
import { mapGetters, mapState } from 'vuex'
import debounce from 'debounce'

export default {
  name: 'thread_view',
  mixins: [PetitionsMixin, NSFWWarningMixin],
  components: { PostItem, PostCreate },
  data () {
    return {
      thread: null,
      postsPerPage: 20,
      currentPage: 1,
      transitonName: 'asdasd'
    }
  },
  metaInfo () {
    return {
      title: this.thread ? this.thread.title : '',
      meta: [
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: '@hobbyfiguras' },
        { name: 'twitter:title', content: this.thread ? this.thread.title : 'Hobbyfiguras' },
        { property: 'og:title', content: this.thread ? this.thread.title : 'Hobbyfiguras' }
      ]
    }
  },
  mounted () {
    this.fetchData()
  },
  props: {
    id: String,
    page: {
      default: 1
    }
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  computed: {
    ...mapGetters('settings', ['isNSFWEnabled']),
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },
  updated: debounce(function () {
    this.$nextTick(() => {
      this.scrollToHash()
    })
  }, 500), // increase to ur needs
  methods: {
    fetchData () {
      var page = this.page
      if (page === 'ultima') {
        page = 'last'
      } else {
        page = parseInt(page)
      }

      this.makePetition(Forum.getThread(this.id, page)).then((thread) => {
        this.thread = thread
        if (page === 'last') {
          this.currentPage = Math.ceil(this.thread.posts.count / this.postsPerPage)
        } else {
          this.currentPage = parseInt(this.page)
        }
        if (this.thread.nsfw && !this.isNSFWEnabled) {
          this.askNSFW()
        }
      })
    },
    changePost (newpost) {
      console.log(newpost)
      var i = this.thread.posts.results.findIndex(post => post.id === newpost.id)
      this.thread.posts.results[i].content = newpost.content
      this.thread.posts.results[i].bans = newpost.bans
      this.thread.posts.results[i].creator.bans = newpost.creator.bans
      if (newpost.votes) {
        this.thread.posts.results[i].votes = newpost.votes
      }
    },
    scrollToHash () {
      if (this.$route.hash) {
        if (this.$refs[this.$route.hash]) {
          var ref = this.$refs[this.$route.hash][0]
          if (ref) {
            this.$scrollTo(ref.$el, 1000)
          }
        }
      }
    },
    toggleSubscription () {
      this.makePetition(Forum.changeThreadSubscription(this.thread.id, !this.thread.subscribed)).then(() => {
        this.thread.subscribed = !this.thread.subscribed
      })
    },
    deletePost (postToDelete) {
      console.log(postToDelete)
      var index = this.thread.posts.results.findIndex(post => post.id === postToDelete.id)
      console.log(index)
      this.thread.posts.results[index].modified_by = this.currentUser
      this.thread.posts.results[index].delete_reason = postToDelete.delete_reason
      this.thread.posts.results[index].deleted = true
    },
    onCreatePost (post) {
      post.thread = this.thread
      var totalPages = Math.ceil(this.thread.posts.count / this.postsPerPage)
      if ((totalPages === this.currentPage) && this.thread.posts.results.length < this.postsPerPage) {
        this.transitonName = 'post'
        this.thread.posts.results.push(JSON.parse(JSON.stringify(post)))
      } else {
        var data = this.getThreadLinkData(this.thread)
        data.hash = '#' + String(post.id)
        data.params.page = 'ultima'
        this.$router.push(data)
      }
    },
    changePage: debounce(function (page = 1) {
      var data = this.getThreadLinkData(this.thread)
      if (page === 1) {
        this.$router.push(data)
      } else {
        data.params.page = page
        this.$router.push(data)
      }
    }, 500)
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

.notification {
  padding: 1.25rem 2.5rem 1.25rem 1.5rem;
  border-radius: 2px !important;
  border: 0 !important;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}

.tile.is-vertical > .tile.is-child:not(:last-child) {
  margin-bottom: 0.25rem !important;
}

.thread-title {
  padding: 1.0rem 2.5rem 1.0rem 1.5rem
}

.new-post {
  padding: 0.5rem 2.5rem 0.5rem 1.5rem
}

.post-enter-active, .post-leave-active, .post-move {
  transition: all 1s;
}
.post-enter, .post-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
