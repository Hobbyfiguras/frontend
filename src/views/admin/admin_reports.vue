<template>
  <div>
    <div v-for="report in reports"  :key="report.id">
      <div class="card card-content">
        <p>Reportado por "{{report.reason}}" el {{new Date(report.created).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}}</p>
        <router-link class="button is-primary" :to="getPostLinkData(report.post, report.post.thread)">Ver el post</router-link>
      </div>
      <div class="content">
        <PostItem class="PostItem" :post="report.post" ></PostItem>
      </div>

    </div>

    <div class="card card-content">
      <b-pagination
        :total="reports.count"
        :current.sync="currentPage"
        :per-page="itemsPerPage"
        order="is-centered"
        @change="changePage">
      </b-pagination>
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
      currentPage: 1,
      itemsPerPage: 15
    }
  },
  methods: {
    changePage (newPage) {
      this.makePetition(Forum.getReports()).then((reports) => {
        this.reports = reports.results
      })
    }
  },
  mounted () {
    this.changePage(1)
  }
}
</script>

<style scoped>

</style>
