<template>
  <div>
    <PostItem class="PostItem" v-for="report in reports" :post="report.post" :key="report.id">
    </PostItem>
  </div>
</template>

<script>
import petitionsMixin from '@/components/mixins/petitions'
import Forum from '@/api/forum'
import PostItem from '@/components/forum/PostItem'
export default {
  name: 'admin_reports',
  mixins: [petitionsMixin],
  components: { PostItem },
  data () {
    return {
      reports: [],
      currentPage: 1
    }
  },
  methods: {
    fetchData () {
      this.makePetition(Forum.getReports()).then((reports) => {
        this.reports = reports.results
      })
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>

<style scoped>

</style>
