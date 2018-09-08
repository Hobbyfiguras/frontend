<template>
    <div>
    <div class="tile">
      <div class="tile is-parent is-vertical">
        <thread v-for="thread in threads.results" :key="thread.id" :thread="thread"></thread>
      </div>
    </div>
    <portal v-if="!loading" to="threadcount">
      {{threads.count}}
    </portal>
    <div class="column is-12">
      <b-pagination
      :total="threads.count"
      :current.sync="currentPage"
      :per-page="itemsPerPage"
      order="is-centered"
      @change="changePage">
    </b-pagination>
    </div>
    </div>
</template>
<script>
import PetitionsMixin from '@/components/mixins/petitions'
import markdown from '@/components/markdown'
import debounce from 'debounce'
import figuresite from '@/api/figuresite'
import thread from '@/components/forum/thread_item'
export default {
  name: 'userposts',
  mounted () {
    this.fetchData()
  },
  components: { markdown, thread },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  props: ['username'],
  data () {
    return {
      threads: [],
      currentPage: 1,
      itemsPerPage: 10,
      loading: false
    }
  },
  methods: {
    fetchData () {
      this.getItems()
    },
    getItems (page = 1) {
      this.loading = true
      this.makePetition(figuresite.getUserThreads(this.username, page)).then((response) => {
        this.threads = response
        this.loading = false
      })
    },
    changePage: debounce(function (page = 1) {
      this.getItems(page)
    }, 500)
  },
  mixins: [PetitionsMixin]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.loader {
  margin: auto;
}

.dropdown-item {
  white-space: normal !important;
}
</style>
