<template>
  <div class="columns is-centered is-multiline">
    <div v-if="!loading" v-for="picture in pictures.picture" :key="picture.id" class="column is-3">
      <a :href="getPictureURL(picture)">
        <div class="card gallery-image">
          <div class="card-image">
            <figure class="image">
              <img :src="picture.medium"/>
            </figure>
          </div>
        </div>
      </a>

      <br/>
    </div>
    <portal v-if="!loading" to="photocount">
      {{pictures.count}}
    </portal>
    <div class="column is-12">
      <b-pagination
      :total="pictures.pages"
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
  name: 'userpics',
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
      pictures: [],
      currentPage: parseInt(this.$route.query.page) || 1,
      itemsPerPage: 20,
      loading: false,
      keywords: this.$route.query.keywords || '',
      activeTab: 0
    }
  },
  methods: {
    fetchData () {
      this.getItems()
    },
    getItems (page = 1) {
      this.loading = true
      this.makePetition(MFC.getPictures(this.username, page)).then((response) => {
        this.pictures = response.pictures
        this.loading = false
      })
    },
    getPictureURL (picture) {
      return `https://myfigurecollection.net/picture/${picture.id}`
    },
    changePage: debounce(function (page = 1) {
      this.getItems(page)
    }, 500)
  },
  mixins: [PetitionsMixin]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.gallery-image {
  transition: all .5s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
}
</style>
