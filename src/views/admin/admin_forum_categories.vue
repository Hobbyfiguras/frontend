<template>
  <div>
    <div class="level">
      <div class="level-left">

      </div>
      <div class="level-right">
        <div class="level-item">
          <a class="button is-primary is-rounded" @click="createCategory"><b-icon icon="plus"></b-icon></a>
        </div>
      </div>
    </div>
    <AdminCategory v-for="(category, index) in categories" :key="category.id" @deleteCategory="deleteCategory" v-model="categories[index]">
    </AdminCategory>
  </div>
</template>

<script>
import petitionsMixin from '@/components/mixins/petitions'
import Forum from '@/api/forum'
import CreateForumCategory from '@/views/admin/modals/create_forum_category'
import AdminCategory from '@/components/admin/admin_category'
export default {
  name: 'admin_forum_categories',
  mixins: [petitionsMixin],
  components: { AdminCategory },
  data () {
    return {
      categories: []
    }
  },
  methods: {
    fetchData () {
      this.makePetition(Forum.getForumCategories()).then((categories) => {
        this.categories = categories
      })
    },
    onCategoryCreated (category) {
      this.categories.push(category)
    },
    deleteCategory (category) {
      this.categories.splice(this.categories.findIndex((foundCat) => foundCat.id === category.id), 1)
    },
    createCategory () {
      this.$buefy.modal.open({
        parent: this,
        component: CreateForumCategory,
        hasModalCard: true,
        events: {
          'createCategory': this.onCategoryCreated
        }
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
