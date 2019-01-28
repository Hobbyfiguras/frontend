<template>
  <div class="container">
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-12">
        <div class="tile">
          <div class="tile is-parent is-vertical">
            <article class="tile is-child notification is-primary">
              <div class="level is-mobile">
                <div class="level-left">
                  <div class="level-item">
                    <p class="title">Ultimos mensajes</p>
                  </div>
                </div>
                <div>
                </div>
              </div>
            </article>
            <thread v-for="thread in threads.results" :key="thread.id" :thread="thread"></thread>
          </div>
        </div>
      </div>
    </div>
    <b-pagination
    :total="threads.count"
    :current.sync="currentPage"
    :per-page="itemsPerPage"
    order="is-centered"
    @change="changePage"/>
  </div>
</template>

<script>
import thread from '@/components/forum/thread_item'

import Forum from '@/api/forum'
export default {
  components: { thread },
  data () {
    return {
      itemsPerPage: 20,
      currentPage: 1,
      threads: {}
    }
  },
  created () {
    this.changePage(1)
  },
  methods: {
    changePage (pageN) {
      Forum.getThreads(pageN, this.itemsPerPage).then((threads) => {
        this.threads = threads
      })
    }
  }
}
</script>
