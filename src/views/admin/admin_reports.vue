<template>
  <div>
    <div v-for="report in reports"  :key="report.id">
      <div class="card card-content">Reportado por "{{report.reason}}" el {{new Date(report.created).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}}</div>
      <div class="content">
        <PostItem class="PostItem" :post="report.post" >        </PostItem>
      </div>

    </div>
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
