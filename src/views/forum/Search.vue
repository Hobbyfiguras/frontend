<template>
<div>
  <div class="container">
    <form @submit.prevent="onSearch()">
      <b-field grouped>
        <b-field label="Buscar">
          <b-select v-model="searchType">
            <option value="thread">Hilos</option>
            <option value="user">Usuarios</option>
          </b-select>
        </b-field>
        <b-field label="Foro" v-if="searchType === 'thread'">
          <div class="control">
            <b-select placeholder="Foro" v-model="forum">
              <option value="">Todos</option>
              <optgroup v-if="categories" v-for="category in categories" :key="category.id" :label="category.name">
                <option v-for="forum in category.forums" :key="forum.id" :value="forum.slug">{{forum.name}}</option>
              </optgroup>
            </b-select>
          </div>
        </b-field>
      </b-field>

      <b-field>
        <div class="control">
          <b-input placeholder="Buscar..."
            type="search"
            icon="magnify"
            v-model="searchText">
          </b-input>
        </div>
        <div class="control">
          <div class="button is-primary" @click="onSearch()"><b-icon icon="magnify"></b-icon></div>
        </div>
      </b-field>
    </form>
  </div>
  <div class="container">
    <div class="tile is-ancestor" v-if="results">
      <div class="tile is-vertical is-12">
        <div class="tile">
          <div class="tile is-parent is-vertical">

            <thread v-if="searchType === 'thread'" v-for="thread in results.results" :key="thread.id" :thread="thread"></thread>
            <div v-if="searchType === 'user'">
              <article v-for="user in results.results" :key="user.username" class="tile is-child notification forum-header is-info">
                <div class="columns is-centered">
                  <div class="column">
                    <figure class="image is-128x128">
                      <div class="is-paddingless">
                        <img class="is-rounded" :src="user.avatar"/>
                      </div>
                    </figure>
                  </div>
                  <div class="column">
                    <p class="subtitle">{{user.text}}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="results && results.count <= 0" class="has-text-centered title">Nada por aquí...</div>
        <b-pagination v-if="results"
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
  name: 'Search',
  mixins: [PetitionsMixin],
  data () {
    return {
      currentPage: 1,
      itemsPerPage: 20,
      forum: this.$route.query.foro || '',
      searchType: this.$route.query.type || 'thread',
      categories: {},
      searchText: this.text,
      results: undefined
    }
  },
  mounted () {
    this.fetchData()
  },
  props: ['text'],
  components: { thread, ForumSearch },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.makePetition(Forum.getForumCategories()).then((categories) => {
        this.categories = categories
      })
      if (this.searchText) {
        this.performSearch()
      }
    },
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
      var username = this.$route.query.usuario || ''
      if (this.searchType === 'thread') {
        this.makePetition(Forum.threadSearch(this.searchText, username, this.forum, this.currentPage)).then((results) => {
          for (var i of results.results.keys()) {
            results.results[i] = this.result2Thread(results.results[i])
          }
          this.results = results
        })
      } else if (this.searchType === 'user') {
        this.makePetition(Forum.userSearch(this.searchText, this.currentPage)).then((results) => {
          this.results = results
        })
      }
    },
    onSearch () {
      var newQuery = {}
      if (this.forum !== '') {
        newQuery = { ...newQuery, ...{ foro: this.forum } }
      }
      if (this.searchType !== 'thread') {
        newQuery.type = this.searchType
      }
      this.currentPage = 1
      this.$router.push({ name: 'search', query: newQuery, params: { text: this.searchText } })
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
        this.$router.push({ name: 'search', query: newQuery, params: { text: this.searchText } })
      } else if (page !== 0) {
        this.$router.push({ name: 'search', query: { ...newQuery, page: this.currentPage }, params: { text: this.searchText } })
      }
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
