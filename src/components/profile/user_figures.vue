<template>
  <div class="columns is-centered is-multiline is-mobile">
    <div v-for="item in items.item" :key="item.id" class="column is-one-fifth-tablet is-half-mobile">
      <div class="card">
        <div class="card-image">
          <figure class="image figure">
            <img class="figurepreview" :src="getFigurePreview(item)"/>
          </figure>
        </div>
        <div class="card-content">
          <a :href="getFigureLink(item)"><h1 class="subtitle">{{item.name}}</h1></a>

        </div>
      </div>
      <br/>
    </div>

    <portal v-if="!loading" to="figurecount">
      {{items.count}}
    </portal>

    <div class="column is-12">
      <b-pagination
      :total="items.count"
      :current.sync="currentPage"
      :per-page="itemsPerPage"
      order="is-centered"
      @change="changePage">
    </b-pagination>
    </div>
    </div>
</template>

<script>
import MFC from '@/api/mfc'
import PetitionsMixin from '@/components/mixins/petitions'

import debounce from 'debounce'

export default {
  name: 'userfigures',
  mounted () {
    this.fetchData()
  },

  watch: {
    // call again the method if the route changes
    '$route': 'fetchData',
    username () {
      this.fetchData()
    }
  },
  props: ['username'],
  data () {
    return {
      items: [],
      currentPage: 1,
      itemsPerPage: 22,
      loading: false,
      editing: false
    }
  },
  methods: {
    fetchData () {
      this.getItems()
    },
    getItems (page = 1) {
      this.loading = true
      this.makePetition(MFC.getUserFigures(this.username, page)).then((response) => {
        this.items = response.items
        this.loading = false
      })
    },
    getFigurePreview (figure) {
      return `https://static.myfigurecollection.net/pics/figure/big/${figure.id}.jpg`
    },
    getFigureLink (figure) {
      return `https://myfigurecollection.net/item/${figure.id}`
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

.figure {
  height: 15rem;
  overflow: hidden;
}

.figurepreview {
  height: 100%;
}
</style>
