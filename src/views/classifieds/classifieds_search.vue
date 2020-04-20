<template>
  <div class="columns is-multiline is-fullwidth">
    <div class="column is-one-third" v-for="classified in classifieds" :key="classified.id">
      <ClassifiedItem :item="classified">
      </ClassifiedItem>
    </div>
    <div class="column is-12">
      <b-pagination
        :total="classifiedsCount"
        :current.sync="currentPage"
        :per-page="itemsPerPage"
        order="is-centered"
        @change="changePage">
      </b-pagination>
    </div>
  </div>
</template>

<script>
import Classifieds from '@/api/classifieds'
import ClassifiedItem from '@/components/classifieds/classified_item'
import PetitionsMixin from '@/components/mixins/petitions'
import debounce from 'debounce'
export default {
  props: ["text", "page"],
  components: { ClassifiedItem },
  mounted () {
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  data () {
    return {
      classifieds: [],
      classifiedsCount: 0,
      currentPage: 1,
      itemsPerPage: 4
    }
  },
  methods: {
    fetchData () {
      this.makePetition(Classifieds.getClassifieds(this.text, this.currentPage), true, true).then((classifieds) => {
        this.classifieds = []
        for (let i = 0; i < classifieds.results.length; i++) {
          // classified search results are slightly different from what ClassifiedItem expects.
          var element = classifieds.results[i];
          var username = element.username
          element.creator = {username}
          element.images = [{primary: true, image: element.image}]
          element.title = element.text
          this.classifieds.push(element)
        }
        this.classifiedsCount = classifieds.count
      })
    },
    changePage: debounce(function (page = 1) {
      this.currentPage = page
      this.fetchData()
    }, 500)
  },
  mixins: [PetitionsMixin]
  
}
</script>